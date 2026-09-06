<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS 订阅</title>
        <style>
          :root { color-scheme: light dark; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif;
            background: #ffffff; color: #1d1d1f; line-height: 1.7;
          }
          .wrap { max-width: 680px; margin: 0 auto; padding: 48px 20px 80px; }
          .brand { display: inline-block; font-weight: 800; font-size: 1.25rem; letter-spacing: 0.02em; }
          .brand .dot { color: #007aff; }
          h1 { font-size: 1.5rem; margin: 28px 0 8px; letter-spacing: -0.02em; }
          .desc { color: #6e6e73; margin-bottom: 8px; }
          .tip { font-size: 0.9rem; color: #6e6e73; background: #f5f5f7; border-radius: 10px; padding: 12px 16px; margin: 20px 0 36px; }
          .tip a { color: #007aff; }
          .item { border-top: 1px solid #e5e5e5; padding: 20px 0; }
          .item:last-child { border-bottom: 1px solid #e5e5e5; }
          .meta { font-size: 0.82rem; color: #86868b; margin-bottom: 6px; }
          .meta .cat { color: #007aff; }
          .item a.title { font-size: 1.08rem; font-weight: 600; color: #1d1d1f; text-decoration: none; }
          .item a.title:hover { color: #007aff; }
          .item p { font-size: 0.95rem; color: #6e6e73; margin-top: 6px; }
          .tags { margin-top: 8px; }
          .tags span { display: inline-block; font-size: 0.78rem; color: #6e6e73; border: 1px solid #e5e5e5; border-radius: 980px; padding: 1px 10px; margin-right: 6px; }
          footer { margin-top: 48px; font-size: 0.85rem; color: #86868b; }
          footer a { color: #007aff; text-decoration: none; }
          @media (prefers-color-scheme: dark) {
            body { background: #0b0b0b; color: #f5f5f7; }
            .desc, .tip, .item p, .meta, footer { color: #a1a1a6; }
            .tip { background: #161618; }
            .item { border-color: #2c2c2e; }
            .item:last-child { border-color: #2c2c2e; }
            .item a.title { color: #f5f5f7; }
            .tags span { color: #a1a1a6; border-color: #2c2c2e; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <span class="brand"><xsl:value-of select="/rss/channel/title"/><span class="dot">.</span></span>
          <h1>RSS 订阅源</h1>
          <p class="desc"><xsl:value-of select="/rss/channel/description"/></p>
          <div class="tip">
            这是给 RSS 阅读器用的订阅源。把上面的网址复制到 Feedly、Inoreader、NetNewsWire 等阅读器里添加即可；<a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>返回网站 →</a>
          </div>
          <xsl:for-each select="/rss/channel/item">
            <div class="item">
              <div class="meta">
                <span class="cat"><xsl:value-of select="category[1]"/></span>
                <xsl:text> · </xsl:text>
                <xsl:value-of select="concat(substring(pubDate,6,6), substring(pubDate,12,5))"/>
              </div>
              <a class="title">
                <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                <xsl:value-of select="title"/>
              </a>
              <p><xsl:value-of select="description"/></p>
              <div class="tags">
                <xsl:for-each select="category[position() &gt; 1]">
                  <span><xsl:value-of select="."/></span>
                </xsl:for-each>
              </div>
            </div>
          </xsl:for-each>
          <footer>
            共 <xsl:value-of select="count(/rss/channel/item)"/> 篇 · <a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute><xsl:value-of select="/rss/channel/link"/></a>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
