import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const loader = await readFile(new URL("../public/admin/loader.js", import.meta.url), "utf8");

function createHarness({ fetchResponse, parse, cms } = {}) {
  const status = createElement();
  const retryButton = createElement();
  const scripts = [];
  let reloadCount = 0;
  const document = {
    body: {
      appendChild(element) {
        scripts.push(element);
      },
    },
    createElement() {
      return createElement();
    },
    getElementById(id) {
      return id === "cms-loader-status" ? status : retryButton;
    },
  };
  const sandbox = {
    Date,
    Error,
    Object,
    Array,
    Promise,
    document,
    fetch: async () => fetchResponse,
    CMS: cms,
    location: {
      reload() {
        reloadCount += 1;
      },
    },
  };

  if (parse) {
    sandbox.jsyaml = { load: parse };
  }

  sandbox.window = sandbox;
  vm.runInNewContext(loader, sandbox, { filename: "public/admin/loader.js" });
  return {
    sandbox,
    scripts,
    status,
    retryButton,
    getReloadCount: () => reloadCount,
  };
}

function createElement() {
  return {
    attributes: new Map(),
    disabled: false,
    hidden: false,
    listeners: new Map(),
    textContent: "",
    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    },
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
  };
}

async function drain() {
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
  }
}

test("manually initializes Decap after config and CDN load", async () => {
  const parsedConfig = {
    backend: { name: "git-gateway", auth_endpoint: "/auth" },
    auth: { email_claim: "email" },
  };
  let initialization;
  const { sandbox, scripts, status } = createHarness({
    fetchResponse: { ok: true, text: async () => "backend: git-gateway" },
    parse: () => parsedConfig,
    cms: { init: (options) => { initialization = options; } },
  });

  await drain();

  assert.equal(sandbox.CMS_MANUAL_INIT, true);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, "https://unpkg.com/decap-cms@3.16.0/dist/decap-cms.js");
  assert.equal(scripts[0].async, true);

  scripts[0].onload();
  await drain();

  assert.deepEqual(JSON.parse(JSON.stringify(initialization)), {
    config: {
      backend: { name: "git-gateway", auth_endpoint: "/auth" },
      auth: { email_claim: "email" },
      load_config_file: false,
    },
  });
  assert.equal(status.hidden, true);
});

test("shows retry without exposing details when config request fails", async () => {
  const { scripts, status, retryButton } = createHarness({
    fetchResponse: { ok: false, text: async () => "unused" },
    parse: () => { throw new Error("should not parse"); },
  });

  await drain();

  assert.equal(scripts.length, 0);
  assert.equal(status.textContent, "内容后台暂时无法加载，请检查网络后重试。");
  assert.equal(status.hidden, false);
  assert.equal(retryButton.hidden, false);
  assert.equal(retryButton.disabled, false);
});

test("shows retry when the Decap CDN script fails", async () => {
  const { scripts, status, retryButton } = createHarness({
    fetchResponse: { ok: true, text: async () => "backend: git-gateway" },
    parse: () => ({ backend: { name: "git-gateway" } }),
  });

  await drain();
  assert.equal(scripts.length, 1);

  scripts[0].onerror();
  await drain();

  assert.equal(status.textContent, "内容后台暂时无法加载，请检查网络后重试。");
  assert.equal(retryButton.hidden, false);
  assert.equal(retryButton.disabled, false);
});

test("reloads when the YAML parser was unavailable on the first attempt", async () => {
  const { scripts, status, retryButton, getReloadCount } = createHarness({
    fetchResponse: { ok: true, text: async () => "backend: git-gateway" },
  });

  await drain();

  assert.equal(scripts.length, 0);
  assert.equal(status.textContent, "内容后台暂时无法加载，请检查网络后重试。");
  retryButton.listeners.get("click")();
  assert.equal(getReloadCount(), 1);
});

test("keeps the error state when async CMS initialization rejects", async () => {
  const { scripts, status, retryButton } = createHarness({
    fetchResponse: { ok: true, text: async () => "backend: git-gateway" },
    parse: () => ({ backend: { name: "git-gateway" } }),
    cms: {
      init: async () => {
        throw new Error("internal initialization detail");
      },
    },
  });

  await drain();
  scripts[0].onload();
  await drain();

  assert.equal(status.textContent, "内容后台暂时无法加载，请检查网络后重试。");
  assert.equal(status.hidden, false);
  assert.equal(retryButton.hidden, false);
  assert.equal(retryButton.disabled, false);
});
