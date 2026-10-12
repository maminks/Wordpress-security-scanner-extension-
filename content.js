(() => {
  // Check if the site is WordPress
  const isWP =
    document.querySelector('meta[name="generator"][content*="WordPress"]') ||
    document.documentElement.innerHTML.includes("/wp-content/") ||
    document.documentElement.innerHTML.includes("/wp-includes/") ||
    document.documentElement.innerHTML.includes("wp-json");

  // Gather site info
  const siteTitle = document.title || "Unknown";
  const generatorMeta = document.querySelector('meta[name="generator"]')?.content || "Unknown";
  const themeMatch = document.documentElement.innerHTML.match(/wp-content\/themes\/([a-zA-Z0-9\-_]+)/);
  const theme = themeMatch ? themeMatch[1] : "Unknown";
  const restApi = document.documentElement.innerHTML.includes("/wp-json/") ? "Available" : "Not available";

  // Detect WordPress plugins
  function detectPlugins() {
    const plugins = new Map();
    const html = document.documentElement.innerHTML;

    // Detect plugins from script and link tags
    const scriptLinks = document.querySelectorAll('script[src*="/wp-content/plugins/"], link[href*="/wp-content/plugins/"]');
    scriptLinks.forEach(element => {
      const url = element.src || element.href;
      const match = url.match(/\/wp-content\/plugins\/([^\/]+)/);
      if (match) {
        const pluginSlug = match[1];
        if (!plugins.has(pluginSlug)) {
          plugins.set(pluginSlug, {
            name: formatPluginName(pluginSlug),
            slug: pluginSlug,
            version: extractVersion(url) || "Unknown"
          });
        }
      }
    });

    // Additional detection from inline HTML
    const pluginRegex = /\/wp-content\/plugins\/([a-zA-Z0-9\-_]+)(?:\/[^'"]*)?(?:\?ver=([0-9.]+))?/g;
    let match;
    while ((match = pluginRegex.exec(html)) !== null) {
      const pluginSlug = match[1];
      const version = match[2] || "Unknown";
      if (!plugins.has(pluginSlug)) {
        plugins.set(pluginSlug, {
          name: formatPluginName(pluginSlug),
          slug: pluginSlug,
          version: version
        });
      } else if (version !== "Unknown" && plugins.get(pluginSlug).version === "Unknown") {
        plugins.get(pluginSlug).version = version;
      }
    }

    return Array.from(plugins.values());
  }

  // Format plugin slug to readable name
  function formatPluginName(slug) {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Extract version from URL
  function extractVersion(url) {
    const versionMatch = url.match(/[?&]ver=([0-9.]+)/);
    return versionMatch ? versionMatch[1] : null;
  }

  // Fallback WordPress version detection methods (ported from WPintel)
  function versionFromEmoji(html) {
    const m = html.match(/wp-emoji-release\.min\.js\?ver=(.*?)"/);
    return m ? m[1] : null;
  }

  async function versionFromFeed(baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/feed/`);
      const text = await res.text();
      const m = text.match(/<generator>https:\/\/wordpress\.org\/\?v=(.*?)<\/generator>/);
      return m ? m[1] : null;
    } catch (e) { return null; }
  }

  async function versionFromAtom(baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/feed/atom`);
      const text = await res.text();
      const m = text.match(/version="(.*?)"\s*>WordPress/);
      return m ? m[1] : null;
    } catch (e) { return null; }
  }

  async function versionFromOpml(baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/wp-links-opml.php`);
      const text = await res.text();
      const m = text.match(/generator="WordPress\/(.*?)"/);
      return m ? m[1] : null;
    } catch (e) { return null; }
  }

  // Resolve WP version via generator meta first, then fall back through
  // emoji script / RSS feed / Atom feed / OPML, same order as WPintel.
  async function resolveWPVersion() {
    if (/WordPress/.test(generatorMeta)) {
      const m = generatorMeta.match(/WordPress (.*)/);
      if (m) return m[1];
    }
    const baseUrl = window.location.origin;
    const html = document.documentElement.innerHTML;
    return (
      versionFromEmoji(html) ||
      (await versionFromFeed(baseUrl)) ||
      (await versionFromAtom(baseUrl)) ||
      (await versionFromOpml(baseUrl)) ||
      "Unknown"
    );
  }

  // Check for usernames in author links (DOM only)
  function scanDomForUsernames() {
    const usernames = new Set();
    const authorLinks = document.querySelectorAll('a[href*="author="], a[href*="/author/"]');
    authorLinks.forEach(link => {
      const match = link.href.match(/\/author\/([^\/]+)/);
      if (match) usernames.add(match[1]);
    });
    return Array.from(usernames);
  }

  // Collect a handful of same-origin post/page links from the current page.
  // Used to feed the oEmbed username-enumeration source in the background script.
  function collectPostUrls() {
    const origin = window.location.origin;
    const urls = new Set();
    document.querySelectorAll('a[href]').forEach(a => {
      try {
        const href = new URL(a.href, origin);
        if (href.origin !== origin) return;
        // Skip obvious non-content links (assets, admin, feeds, anchors-only)
        if (/\.(css|js|png|jpe?g|gif|svg|webp|xml|pdf)$/i.test(href.pathname)) return;
        if (/\/wp-(admin|json|includes|content)\//.test(href.pathname)) return;
        if (href.pathname === '/' || href.pathname === '') return;
        urls.add(href.href.split('#')[0]);
      } catch (e) {
        // ignore malformed hrefs
      }
    });
    return Array.from(urls).slice(0, 6);
  }

  // Check if XML-RPC is enabled
  async function checkXmlrpc() {
    try {
      const baseUrl = window.location.origin;
      const xmlrpcUrl = `${baseUrl}/xmlrpc.php`;

      const response = await fetch(xmlrpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml'
        },
        body: '<?xml version="1.0"?><methodCall><methodName>system.listMethods</methodName><params></params></methodCall>'
      });

      if (response.ok) {
        const text = await response.text();
        if (text.includes('methodResponse') || text.includes('XML-RPC')) {
          return 'Enabled';
        }
      }
      return 'Disabled';
    } catch (error) {
      return 'Unknown';
    }
  }

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkWP") {
      const detectedPlugins = isWP ? detectPlugins() : [];

      // Check XML-RPC status first, resolve version with fallback chain in parallel
      Promise.all([checkXmlrpc(), resolveWPVersion()]).then(([xmlrpcStatus, resolvedVersion]) => {
        // Request CVE information for detected plugins
        if (detectedPlugins.length > 0) {
          chrome.runtime.sendMessage({
            action: "checkCVEs",
            plugins: detectedPlugins
          }, (cveResponse) => {
            // Also check WordPress core vulnerabilities
            chrome.runtime.sendMessage({
              action: "checkWPVersion",
              wpVersion: resolvedVersion
            }, (wpVulnResponse) => {
              sendResponse({
                isWP: !!isWP,
                siteTitle,
                wpVersion: resolvedVersion,
                theme,
                restApi,
                xmlrpc: xmlrpcStatus,
                domUsers: scanDomForUsernames(),
                postUrls: collectPostUrls(),
                plugins: cveResponse?.pluginsWithCVEs || detectedPlugins,
                wpVulnerabilities: wpVulnResponse?.wpVulnerabilities || []
              });
            });
          });
        } else {
          // No plugins, but still check WP core vulnerabilities
          chrome.runtime.sendMessage({
            action: "checkWPVersion",
            wpVersion: resolvedVersion
          }, (wpVulnResponse) => {
            sendResponse({
              isWP: !!isWP,
              siteTitle,
              wpVersion: resolvedVersion,
              theme,
              restApi,
              xmlrpc: xmlrpcStatus,
              domUsers: scanDomForUsernames(),
              postUrls: collectPostUrls(),
              plugins: [],
              wpVulnerabilities: wpVulnResponse?.wpVulnerabilities || []
            });
          });
        }
      });
      return true; // Keep message channel open for async response
    } else if (request.action === "scanDomUsers") {
      sendResponse({ usernames: scanDomForUsernames() });
    }
  });

  // Return info for background script (if needed)
  return {
    isWP: !!isWP,
    siteTitle,
    wpVersion: generatorMeta,
    theme,
    restApi,
    domUsers: scanDomForUsernames(),
    plugins: isWP ? detectPlugins() : [],
    postUrls: collectPostUrls()
  };
})();
