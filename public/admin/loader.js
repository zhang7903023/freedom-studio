(function () {
  "use strict";

  var status = document.getElementById("cms-loader-status");
  var retryButton = document.getElementById("cms-loader-retry");
  var isLoading = false;

  // Decap reads this flag as its bundle loads. The config is initialized below.
  window.CMS_MANUAL_INIT = true;

  function showStatus(message, isError) {
    status.hidden = false;
    status.textContent = message;
    status.setAttribute("aria-live", isError ? "assertive" : "polite");
  }

  function showFailure() {
    isLoading = false;
    retryButton.disabled = false;
    retryButton.hidden = false;
    showStatus("内容后台暂时无法加载，请检查网络后重试。", true);
  }

  function loadConfig() {
    return fetch("config.yml?t=" + Date.now(), { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("config request failed");
        }

        return response.text();
      })
      .then(function (source) {
        if (!window.jsyaml || typeof window.jsyaml.load !== "function") {
          throw new Error("yaml parser unavailable");
        }

        var config = window.jsyaml.load(source);
        if (!config || typeof config !== "object" || Array.isArray(config)) {
          throw new Error("invalid config");
        }

        return config;
      });
  }

  function loadCms(config) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");

      script.src = "https://unpkg.com/decap-cms@3.16.0/dist/decap-cms.js";
      script.async = true;
      script.onload = function () {
        if (!window.CMS || typeof window.CMS.init !== "function") {
          reject(new Error("cms unavailable"));
          return;
        }

        try {
          Promise.resolve(window.CMS.init({
            config: Object.assign({}, config, { load_config_file: false }),
          })).then(resolve, function () {
            reject(new Error("cms initialization failed"));
          });
        } catch (_error) {
          reject(new Error("cms initialization failed"));
        }
      };
      script.onerror = function () {
        reject(new Error("cms script failed"));
      };

      document.body.appendChild(script);
    });
  }

  function start() {
    if (isLoading) {
      return;
    }

    isLoading = true;
    retryButton.disabled = true;
    retryButton.hidden = true;
    showStatus("正在加载内容后台…", false);

    loadConfig()
      .then(loadCms)
      .then(function () {
        isLoading = false;
        showStatus("内容后台已就绪。", false);
        status.hidden = true;
      })
      .catch(showFailure);
  }

  retryButton.addEventListener("click", function () {
    window.location.reload();
  });
  start();
})();
