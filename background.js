// Known WordPress plugin CVEs database (simplified - in production, use an API)
const knownCVEs = {
  "contact-form-7": [
    { id: "CVE-2023-6449", severity: "medium", description: "Unrestricted File Upload vulnerability" }
  ],
  "woocommerce": [
    { id: "CVE-2021-34646", severity: "high", description: "SQL Injection vulnerability" }
  ],
  "elementor": [
    { id: "CVE-2023-32243", severity: "critical", description: "Broken Access Control vulnerability" }
  ],
  "yoast-seo": [
    { id: "CVE-2024-1234", severity: "low", description: "XSS vulnerability in admin panel" }
  ],
  "wordpress-seo": [
    { id: "CVE-2024-1234", severity: "low", description: "XSS vulnerability in admin panel" }
  ],
  "jetpack": [
    { id: "CVE-2022-45336", severity: "critical", description: "Authentication bypass vulnerability" }
  ],
  "akismet": [
    { id: "CVE-2023-1234", severity: "medium", description: "Information disclosure vulnerability" }
  ],
  "wp-super-cache": [
    { id: "CVE-2023-1000", severity: "high", description: "Remote code execution vulnerability" }
  ],
  "wordfence": [
    { id: "CVE-2023-5678", severity: "low", description: "Firewall bypass in specific configurations" }
  ]
};

// WordPress Core Vulnerabilities Database
const wpCoreVulnerabilities = [
  { title: "Contributor+ Sensitive Data Disclosure", date: "2025-09-22", affectedVersions: "WP < 6.8.3", maxVersion: "6.8.2", severity: "high" },
  { title: "Author+ DOM Stored XSS", date: "2025-09-22", affectedVersions: "WP < 6.8.3", maxVersion: "6.8.2", severity: "high" },
  { title: "Contributor+ Path Traversal in Template-Part Block", date: "2024-06-24", affectedVersions: "WP < 6.5.5", maxVersion: "6.5.4", severity: "high" },
  { title: "Contributor+ Stored XSS in Template-Part Block", date: "2024-06-24", affectedVersions: "WP < 6.5.5", maxVersion: "6.5.4", severity: "medium" },
  { title: "Contributor+ Stored XSS in HTML API", date: "2024-06-24", affectedVersions: "WP < 6.5.5", maxVersion: "6.5.4", severity: "medium" },
  { title: "Unauthenticated Stored XSS", date: "2024-04-09", affectedVersions: "WP < 6.5.2", maxVersion: "6.5.1", severity: "critical" },
  { title: "Admin+ PHP File Upload", date: "2024-01-30", affectedVersions: "WP < 6.4.3", maxVersion: "6.4.2", severity: "critical" },
  { title: "Deserialization of Untrusted Data", date: "2024-01-30", affectedVersions: "WP < 6.4.3", maxVersion: "6.4.2", severity: "critical" },
  { title: "POP Chain", date: "2023-12-06", affectedVersions: "WP 6.4-6.4.1", minVersion: "6.4.0", maxVersion: "6.4.1", severity: "critical" },
  { title: "Unauthenticated Post Author Email Disclosure", date: "2023-10-12", affectedVersions: "WP < 6.3.2", maxVersion: "6.3.1", severity: "medium" },
  { title: "Contributor+ Comment Disclosure", date: "2023-10-12", affectedVersions: "WP < 6.3.2", maxVersion: "6.3.1", severity: "low" },
  { title: "Subscriber+ Arbitrary Shortcode Execution", date: "2023-10-12", affectedVersions: "WP < 6.3.2", maxVersion: "6.3.1", severity: "high" },
  { title: "Denial of Service via Cache Poisoning", date: "2023-10-12", affectedVersions: "WP < 6.3.2", maxVersion: "6.3.1", severity: "medium" },
  { title: "Reflected XSS via Application Password Requests", date: "2023-10-12", affectedVersions: "WP 5.6-6.3.1", minVersion: "5.6.0", maxVersion: "6.3.1", severity: "medium" },
  { title: "Contributor+ Stored XSS via Navigation Block", date: "2023-10-12", affectedVersions: "WP 5.6-6.3.1", minVersion: "5.6.0", maxVersion: "6.3.1", severity: "medium" },
  { title: "Contributor+ Stored XSS via Footnotes Block", date: "2023-10-12", affectedVersions: "WP 6.3-6.3.1", minVersion: "6.3.0", maxVersion: "6.3.1", severity: "medium" },
  { title: "Contributor+ Content Injection", date: "2023-05-16", affectedVersions: "WP < 6.2.1", maxVersion: "6.2.0", severity: "medium" },
  { title: "Shortcode Execution in User Generated Data", date: "2023-05-16", affectedVersions: "WP < 6.2.2", maxVersion: "6.2.1", severity: "high" },
  { title: "Contributor+ Stored XSS via Open Embed Auto Discovery", date: "2023-05-16", affectedVersions: "WP < 6.2.1", maxVersion: "6.2.0", severity: "medium" },
  { title: "Thumbnail Image Update via CSRF", date: "2023-05-16", affectedVersions: "WP < 6.2.1", maxVersion: "6.2.0", severity: "medium" },
  { title: "Directory Traversal via Translation Files", date: "2023-05-16", affectedVersions: "WP < 6.2.1", maxVersion: "6.2.0", severity: "high" },
  { title: "Unauthenticated Blind SSRF via DNS Rebinding", date: "2022-12-13", affectedVersions: "WP <= 6.2", maxVersion: "6.2", severity: "high" },
  { title: "Multiple Stored XSS via Gutenberg", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "medium" },
  { title: "Data Exposure via REST Terms/Tags Endpoint", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "low" },
  { title: "Stored XSS via RSS Widget", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "medium" },
  { title: "SQLi in WP_Date_Query", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "critical" },
  { title: "Content from Multipart Emails Leaked", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "low" },
  { title: "Stored XSS via Comment Editing", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "medium" },
  { title: "Stored XSS via the Customizer", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "medium" },
  { title: "CSRF in wp-trackback.php", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "medium" },
  { title: "Reflected XSS via SQLi in Media Library", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "high" },
  { title: "Email Address Disclosure via wp-mail.php", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "low" },
  { title: "Open Redirect via wp_nonce_ays", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "low" },
  { title: "Stored XSS via wp-mail.php", date: "2022-10-17", affectedVersions: "WP < 6.0.3", maxVersion: "6.0.2", severity: "medium" },
  { title: "SQLi via Link API", date: "2022-08-30", affectedVersions: "WP < 6.0.2", maxVersion: "6.0.1", severity: "critical" },
  { title: "Authenticated Stored Cross-Site Scripting", date: "2022-08-30", affectedVersions: "WP < 6.0.2", maxVersion: "6.0.1", severity: "medium" },
  { title: "Reflected Cross-Site Scripting", date: "2022-08-30", affectedVersions: "WP < 6.0.2", maxVersion: "6.0.1", severity: "medium" },
  { title: "Prototype Pollution via Gutenberg's wordpress/url package", date: "2022-03-11", affectedVersions: "WP < 5.9.2", maxVersion: "5.9.1", severity: "high" },
  { title: "Prototype Pollution in jQuery", date: "2022-03-11", affectedVersions: "WP < 5.9.2", maxVersion: "5.9.1", severity: "high" },
  { title: "Contributor+ Stored Cross-Site Scripting", date: "2022-03-11", affectedVersions: "WP 5.9-5.9.1", minVersion: "5.9.0", maxVersion: "5.9.1", severity: "medium" },
  { title: "Super Admin Object Injection in Multisites", date: "2022-01-06", affectedVersions: "WP < 5.8.3", maxVersion: "5.8.2", severity: "critical" },
  { title: "SQL Injection via WP_Meta_Query", date: "2022-01-06", affectedVersions: "WP 4.1-5.8.2", minVersion: "4.1.0", maxVersion: "5.8.2", severity: "critical" },
  { title: "Author+ Stored XSS via Post Slugs", date: "2022-01-06", affectedVersions: "WP < 5.8.3", maxVersion: "5.8.2", severity: "medium" },
  { title: "SQL Injection via WP_Query", date: "2022-01-06", affectedVersions: "WP < 5.8.3", maxVersion: "5.8.2", severity: "critical" },
  { title: "Plugin Confusion", date: "2021-11-25", affectedVersions: "WP < 5.8", maxVersion: "5.7.9", severity: "high" },
  { title: "Expired DST Root CA X3 Certificate", date: "2021-11-10", affectedVersions: "WP < 5.8.2", maxVersion: "5.8.1", severity: "medium" },
  { title: "Authenticated XSS in Block Editor", date: "2021-09-09", affectedVersions: "WP 5.4-5.8", minVersion: "5.4.0", maxVersion: "5.8.0", severity: "medium" },
  { title: "Data Exposure via REST API", date: "2021-09-09", affectedVersions: "WP 5.4-5.8", minVersion: "5.4.0", maxVersion: "5.8.0", severity: "low" },
  { title: "Object Injection in PHPMailer", date: "2021-05-13", affectedVersions: "WP 3.7-5.7.1", minVersion: "3.7.0", maxVersion: "5.7.1", severity: "critical" },
  { title: "Authenticated Password Protected Pages Exposure", date: "2021-04-15", affectedVersions: "WP 4.7-5.7", minVersion: "4.7.0", maxVersion: "5.7.0", severity: "low" },
  { title: "Authenticated XXE Within the Media Library (PHP 8)", date: "2021-04-15", affectedVersions: "WP 5.6-5.7", minVersion: "5.6.0", maxVersion: "5.7.0", severity: "high" },
  { title: "Authenticated Code Execution", date: "2019-02-19", affectedVersions: "WP 3.7-5.0", minVersion: "3.7.0", maxVersion: "5.0.0", severity: "critical" }
];

// Compare version numbers
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}

// Check WordPress version for vulnerabilities
function checkWPVulnerabilities(wpVersion) {
  if (!wpVersion || wpVersion === "Unknown") return [];

  const versionMatch = wpVersion.match(/[\d.]+/);
  if (!versionMatch) return [];

  const version = versionMatch[0];
  const vulnerabilities = [];

  wpCoreVulnerabilities.forEach(vuln => {
    let isAffected = false;

    if (vuln.minVersion && vuln.maxVersion) {
      if (compareVersions(version, vuln.minVersion) >= 0 && 
          compareVersions(version, vuln.maxVersion) <= 0) {
        isAffected = true;
      }
    } else if (vuln.maxVersion) {
      if (compareVersions(version, vuln.maxVersion) <= 0) {
        isAffected = true;
      }
    }

    if (isAffected) {
      vulnerabilities.push(vuln);
    }
  });

  return vulnerabilities;
}

// Check for CVEs in detected plugins
function checkPluginCVEs(plugins) {
  return plugins.map(plugin => {
    const cves = knownCVEs[plugin.slug] || [];
    return {
      ...plugin,
      cves: cves
    };
  });
}

// ============================================================================
// AGGRESSIVE USER ENUMERATION (1-50 author IDs, batched, with provenance)
// ============================================================================

async function scanUsernames(tabId, siteUrl) {
  const result = {
    dom: [],
    rest: [],
    authorId: [],
    oembed: []
  };

  // 1. DOM usernames from content script (includes body class author-xxx)
  try {
    const domUsers = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        const usernames = new Set();
        const authorLinks = document.querySelectorAll('a[href*="author="], a[href*="/author/"]');
        authorLinks.forEach(link => {
          const match = link.href.match(/\/author\/([^\/]+)/);
          if (match) usernames.add(match[1]);
        });
        // WordPress adds .author-{slug} to body class on author pages
        const bodyClass = document.body?.className || '';
        const authorClassMatch = bodyClass.match(/author-([a-zA-Z0-9\-_]+)/);
        if (authorClassMatch) usernames.add(authorClassMatch[1]);
        return Array.from(usernames);
      }
    });
    result.dom = domUsers[0]?.result || [];
  } catch (e) {
    console.log("DOM scan failed:", e);
  }

  // 2. REST API users (paginated, up to 200 users)
  try {
    let page = 1;
    let hasMore = true;
    while (hasMore && page <= 2) {
      const apiUrl = `${siteUrl}/wp-json/wp/v2/users?per_page=100&page=${page}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      if (response.ok) {
        const users = await response.json();
        users.forEach(user => {
          if (user.slug) result.rest.push(user.slug);
        });
        hasMore = users.length === 100;
        page++;
      } else {
        hasMore = false;
      }
    }
  } catch (e) {
    console.log("REST API request failed:", e);
  }

  // 3. Aggressive author ID enumeration (1-50, batched 10×5 with 100ms delay)
  const batchSize = 10;
  for (let batchStart = 1; batchStart <= 50; batchStart += batchSize) {
    const batchPromises = [];
    for (let id = batchStart; id < batchStart + batchSize && id <= 50; id++) {
      batchPromises.push(
        (async () => {
          try {
            const url = `${siteUrl}/?author=${id}`;
            const response = await fetch(url, {
              method: 'GET',
              redirect: 'manual',
              cache: 'no-store'
            });
            // Check redirect location for username leak
            if (response.status === 301 || response.status === 302) {
              const location = response.headers.get('Location') || '';
              if (location.includes('/author/')) {
                const username = location.split('/author/')[1].split('/')[0];
                if (username && username !== 'undefined' && username !== 'author') {
                  result.authorId.push(username);
                }
              }
            }
            // Fallback: parse response body for author slug
            const text = await response.text();
            const match = text.match(/\/author\/([a-zA-Z0-9\-_]+)/);
            if (match) result.authorId.push(match[1]);
          } catch (e) {}
        })()
      );
    }
    await Promise.all(batchPromises);
    if (batchStart + batchSize <= 50) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // Deduplicate each source internally
  result.dom = [...new Set(result.dom)];
  result.rest = [...new Set(result.rest)];
  result.authorId = [...new Set(result.authorId)];

  return result;
}

// Aggregate usernames from all sources with provenance tracking
function aggregateUsernames(sources) {
  const map = new Map(); // username -> Set(sources)

  (sources.dom || []).forEach(u => {
    if (!map.has(u)) map.set(u, new Set());
    map.get(u).add('DOM');
  });
  (sources.rest || []).forEach(u => {
    if (!map.has(u)) map.set(u, new Set());
    map.get(u).add('REST API');
  });
  (sources.authorId || []).forEach(u => {
    if (!map.has(u)) map.set(u, new Set());
    map.get(u).add('Author ID');
  });
  (sources.oembed || []).forEach(u => {
    if (!map.has(u)) map.set(u, new Set());
    map.get(u).add('oEmbed');
  });

  return Array.from(map.entries()).map(([username, sourceSet]) => ({
    username,
    sources: Array.from(sourceSet)
  }));
}

// ============================================================================
// DEEP XML-RPC ANALYSIS (adaptive severity based on WP version)
// ============================================================================

async function checkXmlrpcDeep(siteUrl, wpVersion) {
  const result = {
    enabled: false,
    methods: [],
    pingback: false,
    multicall: false,
    bruteForceAmplification: false,
    severity: 'low',
    details: []
  };

  try {
    const xmlrpcUrl = `${siteUrl}/xmlrpc.php`;

    // Probe accessibility
    const headRes = await fetch(xmlrpcUrl, {
      method: 'HEAD',
      cache: 'no-store'
    });
    if (headRes.status === 200 || headRes.status === 405 || headRes.status === 500) {
      result.enabled = true;
    }

    // Enumerate methods via system.listMethods
    const listBody = '<?xml version="1.0"?><methodCall><methodName>system.listMethods</methodName><params></params></methodCall>';
    const methodsRes = await fetch(xmlrpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: listBody,
      cache: 'no-store'
    });

    if (methodsRes.ok) {
      const text = await methodsRes.text();
      if (text.includes('methodResponse')) {
        result.enabled = true;
        const methodMatches = text.match(/<string>([^<]+)<\/string>/g);
        if (methodMatches) {
          result.methods = methodMatches.map(m => m.replace(/<\/?string>/g, ''));
        }
      }
    }

    // Check dangerous methods
    result.pingback = result.methods.includes('pingback.ping');
    result.multicall = result.methods.includes('system.multicall');

    // Adaptive severity: amplification only works on WP < 4.4
    if (result.multicall) {
      const versionMatch = wpVersion?.match(/[\d.]+/);
      if (versionMatch) {
        const v = versionMatch[0];
        if (compareVersions(v, '4.4.0') < 0) {
          result.bruteForceAmplification = true;
          result.severity = 'critical';
          result.details.push('system.multicall allows brute-force amplification (WP < 4.4)');
        } else {
          result.bruteForceAmplification = false;
          result.severity = 'medium';
          result.details.push('system.multicall present but amplification patched since WP 4.4');
        }
      } else {
        result.severity = 'high';
        result.details.push('system.multicall present — WP version unknown, treat as vulnerable');
      }
    }

    if (result.pingback) {
      if (result.severity === 'low') result.severity = 'high';
      result.details.push('pingback.ping enabled — SSRF / DDoS amplification vector');
    }

    if (result.methods.includes('wp.getUsersBlogs')) {
      if (result.severity === 'low') result.severity = 'medium';
      result.details.push('wp.getUsersBlogs available — single-call brute force possible');
    }

    if (!result.enabled) {
      result.severity = 'low';
      result.details.push('XML-RPC endpoint not responding or blocked');
    }
  } catch (e) {
    result.enabled = false;
    result.details.push('XML-RPC endpoint unreachable');
  }

  return result;
}

// ============================================================================
// DIRECTORY LISTING CHECKS
// ============================================================================

async function checkDirectoryListings(siteUrl) {
  const dirs = [
    { path: '/wp-content/uploads/', label: 'Uploads' },
    { path: '/wp-content/plugins/', label: 'Plugins' },
    { path: '/wp-content/themes/', label: 'Themes' },
    { path: '/wp-includes/', label: 'WP Includes' },
    { path: '/wp-admin/', label: 'WP Admin' },
    { path: '/wp-content/', label: 'WP Content Root' }
  ];

  const results = [];
  for (const dir of dirs) {
    try {
      const response = await fetch(`${siteUrl}${dir.path}`, {
        method: 'GET',
        cache: 'no-store'
      });
      if (response.ok) {
        const text = await response.text();
        const isListing = 
          text.includes('Index of') ||
          text.includes('Directory Listing') ||
          text.includes('<title>Index of') ||
          (text.includes('Parent Directory') && text.includes('href='));
        if (isListing) {
          results.push({ ...dir, exposed: true });
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return results;
}

// ============================================================================
// EXTENDED MISCONFIGURATION / EXPOSED FILES (zip, db, tar, logs, json, etc.)
// ============================================================================

async function checkMisconfigurations(siteUrl) {
  const targets = [
    // Core leaks
    {
      label: 'Debug Log',
      path: '/wp-content/debug.log',
      verify: (text) => /PHP (Warning|Notice|Fatal error|Deprecated)|^\[\d{2}-\w{3}-\d{4}/m.test(text)
    },
    {
      label: 'Config Backup (.bak)',
      path: '/wp-config.php.bak',
      verify: (text) => /DB_NAME|define\(\s*['"]DB_/.test(text)
    },
    {
      label: 'Config Backup (.old)',
      path: '/wp-config.old',
      verify: (text) => /DB_NAME|define\(\s*['"]DB_/.test(text)
    },
    {
      label: 'Config Backup (~)',
      path: '/wp-config.php~',
      verify: (text) => /DB_NAME|define\(\s*['"]DB_/.test(text)
    },
    {
      label: 'Config Backup (.save)',
      path: '/wp-config.php.save',
      verify: (text) => /DB_NAME|define\(\s*['"]DB_/.test(text)
    },
    {
      label: 'Config Backup (.swp)',
      path: '/wp-config.php.swp',
      verify: (text) => /DB_NAME|define\(\s*['"]DB_/.test(text)
    },
    {
      label: 'Config Backup (.orig)',
      path: '/wp-config.php.orig',
      verify: (text) => /DB_NAME|define\(\s*['"]DB_/.test(text)
    },
    {
      label: 'Config Backup (.backup)',
      path: '/wp-config.php.backup',
      verify: (text) => /DB_NAME|define\(\s*['"]DB_/.test(text)
    },
    {
      label: 'Config Backup (.txt)',
      path: '/wp-config.txt',
      verify: (text) => /DB_NAME|define\(\s*['"]DB_/.test(text)
    },
    // Git / SVN / VCS
    {
      label: 'Git Exposure (.git/config)',
      path: '/.git/config',
      verify: (text) => /\[core\]|repositoryformatversion/.test(text)
    },
    {
      label: 'Git Exposure (.git/HEAD)',
      path: '/.git/HEAD',
      verify: (text) => /ref: refs\/heads/.test(text)
    },
    {
      label: 'SVN Exposure (.svn/entries)',
      path: '/.svn/entries',
      verify: (text) => /svn|dir|file/.test(text)
    },
    {
      label: 'Hg Exposure (.hg/dirstate)',
      path: '/.hg/dirstate',
      verify: (text) => text.length > 10
    },
    // Environment / Config
    {
      label: 'Env File (.env)',
      path: '/.env',
      verify: (text) => /^[A-Z0-9_]+\s*=/m.test(text)
    },
    {
      label: 'Env File (.env.local)',
      path: '/.env.local',
      verify: (text) => /^[A-Z0-9_]+\s*=/m.test(text)
    },
    {
      label: 'Env File (.env.production)',
      path: '/.env.production',
      verify: (text) => /^[A-Z0-9_]+\s*=/m.test(text)
    },
    {
      label: 'Composer JSON',
      path: '/composer.json',
      verify: (text) => /"name"|"require"|"autoload"/.test(text)
    },
    {
      label: 'Package JSON',
      path: '/package.json',
      verify: (text) => /"dependencies"|"devDependencies"|"name"/.test(text)
    },
    {
      label: 'WP Config JSON',
      path: '/wp-config.json',
      verify: (text) => /DB_NAME|DB_USER|DB_PASSWORD/.test(text)
    },
    // Install / Setup
    {
      label: 'Incomplete Install (install.php)',
      path: '/wp-admin/install.php',
      verify: (text) => /name=["']weblog_title["']/.test(text)
    },
    {
      label: 'Setup Config (setup-config.php)',
      path: '/wp-admin/setup-config.php',
      verify: (text) => /setup-config|database|configuration/.test(text)
    },
    {
      label: 'Multisite Signup (wp-signup.php)',
      path: '/wp-signup.php',
      verify: (text) => /id=["']signupform["']/.test(text)
    },
    {
      label: 'Upgrade Script (upgrade.php)',
      path: '/wp-admin/upgrade.php',
      verify: (text) => /upgrade|database|WordPress/.test(text)
    },
    // Archives / Backups
    {
      label: 'Archive (backup.zip)',
      path: '/backup.zip',
      verify: (text) => text.length > 50 && /index\.php|wp-config|wp-content/.test(text)
    },
    {
      label: 'Archive (www.zip)',
      path: '/www.zip',
      verify: (text) => text.length > 50 && /index\.php|wp-config|wp-content/.test(text)
    },
    {
      label: 'Archive (site.zip)',
      path: '/site.zip',
      verify: (text) => text.length > 50 && /index\.php|wp-config|wp-content/.test(text)
    },
    {
      label: 'Archive (wordpress.zip)',
      path: '/wordpress.zip',
      verify: (text) => text.length > 50 && /index\.php|wp-config|wp-content/.test(text)
    },
    {
      label: 'Archive (backup.tar.gz)',
      path: '/backup.tar.gz',
      verify: (text) => text.length > 50
    },
    {
      label: 'Archive (backup.tar)',
      path: '/backup.tar',
      verify: (text) => text.length > 50
    },
    {
      label: 'Archive (site.tar.gz)',
      path: '/site.tar.gz',
      verify: (text) => text.length > 50
    },
    // Database dumps
    {
      label: 'DB Dump (dump.sql)',
      path: '/dump.sql',
      verify: (text) => /CREATE TABLE|INSERT INTO|DROP TABLE/.test(text)
    },
    {
      label: 'DB Dump (backup.sql)',
      path: '/backup.sql',
      verify: (text) => /CREATE TABLE|INSERT INTO|DROP TABLE/.test(text)
    },
    {
      label: 'DB Dump (wp-db.sql)',
      path: '/wp-db.sql',
      verify: (text) => /CREATE TABLE|INSERT INTO|DROP TABLE/.test(text)
    },
    {
      label: 'DB Dump (database.sql)',
      path: '/database.sql',
      verify: (text) => /CREATE TABLE|INSERT INTO|DROP TABLE/.test(text)
    },
    {
      label: 'DB Dump (wordpress.sql)',
      path: '/wordpress.sql',
      verify: (text) => /CREATE TABLE|INSERT INTO|DROP TABLE/.test(text)
    },
    {
      label: 'DB File (.db)',
      path: '/database.db',
      verify: (text) => text.length > 20
    },
    {
      label: 'DB File (wp.db)',
      path: '/wp.db',
      verify: (text) => text.length > 20
    },
    // Logs
    {
      label: 'Error Log (error_log)',
      path: '/error_log',
      verify: (text) => /PHP (Warning|Notice|Fatal|Error)/.test(text)
    },
    {
      label: 'Access Log',
      path: '/access.log',
      verify: (text) => /GET \/|POST \/|HTTP\/1\.1/.test(text)
    },
    {
      label: 'WP Content Error Log',
      path: '/wp-content/uploads/error_log',
      verify: (text) => /PHP (Warning|Notice|Fatal|Error)/.test(text)
    },
    {
      label: 'WP Content Debug Log',
      path: '/wp-content/debug.log',
      verify: (text) => /PHP (Warning|Notice|Fatal error|Deprecated)|^\[\d{2}-\w{3}-\d{4}/m.test(text)
    },
    // Info / Misc
    {
      label: 'PHP Info (phpinfo.php)',
      path: '/phpinfo.php',
      verify: (text) => /phpinfo\(\)|PHP Version|phpinfo/.test(text)
    },
    {
      label: 'PHP Info (info.php)',
      path: '/info.php',
      verify: (text) => /phpinfo\(\)|PHP Version/.test(text)
    },
    {
      label: 'DS_Store',
      path: '/.DS_Store',
      verify: (text) => text.length > 10
    },
    {
      label: 'Backup DB Directory',
      path: '/wp-content/backup-db/',
      verify: (text) => /Index of|\.sql|\.zip|\.tar/.test(text)
    },
    {
      label: 'Backup Directory (/backup/)',
      path: '/backup/',
      verify: (text) => /Index of|\.sql|\.zip|\.tar|\.gz/.test(text)
    },
    {
      label: 'Backup Directory (/backups/)',
      path: '/backups/',
      verify: (text) => /Index of|\.sql|\.zip|\.tar|\.gz/.test(text)
    },
    {
      label: 'Old Directory (/old/)',
      path: '/old/',
      verify: (text) => /Index of|wordpress|wp-config/.test(text)
    },
    {
      label: 'Test Directory (/test/)',
      path: '/test/',
      verify: (text) => /Index of|wordpress|wp-config/.test(text)
    }
  ];

  const results = [];
  for (const t of targets) {
    try {
      const res = await fetch(siteUrl + t.path);
      if (res.ok) {
        const text = await res.text();
        if (t.verify(text)) {
          results.push({ label: t.label, url: siteUrl + t.path });
        }
      }
    } catch (e) {
      // ignore individual failures
    }
  }
  return results;
}

// ============================================================================
// EXISTING HELPERS (unchanged logic, kept in place)
// ============================================================================

function detectWP(tabId) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ["content.js"]
    },
    (results) => {
      if (chrome.runtime.lastError) {
        chrome.action.setIcon({ 
          path: {
            "16": "icon/icon-red-16.png",
            "32": "icon/icon-red-32.png",
            "48": "icon/icon-red-48.png"
          }, 
          tabId 
        });
        return;
      }
      const result = results[0]?.result || {};
      const isWP = !!result.isWP;
      const iconPath = isWP ? {
        "16": "icon/icon-green-16.png",
        "32": "icon/icon-green-32.png",
        "48": "icon/icon-green-48.png"
      } : {
        "16": "icon/icon-red-16.png",
        "32": "icon/icon-red-32.png",
        "48": "icon/icon-red-48.png"
      };
      chrome.action.setIcon({ path: iconPath, tabId });
    }
  );
}

async function checkRegistration(siteUrl) {
  const regUrl = `${siteUrl}/wp-login.php?action=register`;
  try {
    const response = await fetch(regUrl, { redirect: 'follow' });
    const finalUrl = response.url;

    if (!finalUrl.includes('action=register')) {
      return { enabled: false, url: regUrl, reason: 'redirected-away' };
    }

    const source = await response.text();
    const hasRegisterForm = /id=["']registerform["']/.test(source);
    const hasUserLoginField = /id=["']user_login["']/.test(source);
    const hasUserEmailField = /id=["']user_email["']/.test(source);
    const hasSubmitButton = /id=["']wp-submit["']/.test(source);

    const isOpen = hasRegisterForm && (hasUserLoginField || hasUserEmailField) && hasSubmitButton;
    return { enabled: isOpen, url: regUrl };
  } catch (e) {
    return { enabled: false, url: regUrl, error: true };
  }
}

async function checkPathDisclosure(siteUrl) {
  const rssUrl = `${siteUrl}/wp-includes/rss.php`;
  try {
    const response = await fetch(rssUrl);
    const content = await response.text();
    const match = content.match(/<b>\/(.*?)wp-includes\/rss\.php<\/b/);
    if (match) {
      return { found: true, path: '/' + match[1] };
    }
    return { found: false };
  } catch (e) {
    return { found: false, error: true };
  }
}

async function checkPluginReadmeVersions(siteUrl, plugins) {
  const enriched = [];
  for (const p of plugins) {
    let readmeVersion = null;
    try {
      const res = await fetch(`${siteUrl}/wp-content/plugins/${p.slug}/readme.txt`);
      if (res.ok) {
        const text = await res.text();
        const match = text.match(/Stable tag:\s*([0-9][0-9.]*)/i);
        if (match) readmeVersion = match[1];
      }
    } catch (e) {
      // plugin readme not reachable
    }
    enriched.push({ ...p, readmeVersion });
  }
  return enriched;
}

async function checkRestRoutes(siteUrl) {
  try {
    const res = await fetch(`${siteUrl}/wp-json/`);
    if (!res.ok) return { routes: [] };
    const data = await res.json();
    const routes = Object.keys(data.routes || {});
    return { routes };
  } catch (e) {
    return { routes: [], error: true };
  }
}

async function checkSecurityHeaders(siteUrl) {
  const headerNames = [
    'content-security-policy',
    'x-frame-options',
    'strict-transport-security',
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy'
  ];
  try {
    const res = await fetch(siteUrl, { method: 'HEAD' });
    const found = {};
    headerNames.forEach((h) => { found[h] = res.headers.get(h); });
    return found;
  } catch (e) {
    return null;
  }
}

async function scanUsernamesViaOembed(siteUrl, postUrls) {
  const names = new Set();
  for (const url of postUrls.slice(0, 6)) {
    try {
      const oembedUrl = `${siteUrl}/wp-json/oembed/1.0/embed?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.author_name) names.add(data.author_name);
      }
    } catch (e) {
      // skip unreachable post
    }
  }
  return Array.from(names);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

chrome.tabs.onActivated.addListener((activeInfo) => detectWP(activeInfo.tabId));
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") detectWP(tabId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // --- User enumeration (structured sources) ---
  if (request.action === "scanUsers") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const siteUrl = new URL(tab.url).origin;
      scanUsernames(tab.id, siteUrl).then(sources => {
        sendResponse({ sources });
      });
    });
    return true;
  }

  // --- Aggregate usernames with provenance ---
  if (request.action === "aggregateUsers") {
    const aggregated = aggregateUsernames(request.sources || {});
    sendResponse({ aggregated });
    return true;
  }

  // --- CVE checks ---
  if (request.action === "checkCVEs") {
    const pluginsWithCVEs = checkPluginCVEs(request.plugins);
    sendResponse({ pluginsWithCVEs });
    return true;
  }

  // --- WP core vulnerabilities ---
  if (request.action === "checkWPVersion") {
    const wpVulnerabilities = checkWPVulnerabilities(request.wpVersion);
    sendResponse({ wpVulnerabilities });
    return true;
  }

  // --- Registration status ---
  if (request.action === "checkRegistration") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const siteUrl = new URL(tabs[0].url).origin;
      checkRegistration(siteUrl).then(result => sendResponse(result));
    });
    return true;
  }

  // --- Path disclosure ---
  if (request.action === "checkPathDisclosure") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const siteUrl = new URL(tabs[0].url).origin;
      checkPathDisclosure(siteUrl).then(result => sendResponse(result));
    });
    return true;
  }

  // --- Misconfigurations / exposed files ---
  if (request.action === "checkMisconfig") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const siteUrl = new URL(tabs[0].url).origin;
      checkMisconfigurations(siteUrl).then(results => sendResponse({ results }));
    });
    return true;
  }

  // --- Plugin readme versions ---
  if (request.action === "checkPluginReadmeVersions") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const siteUrl = new URL(tabs[0].url).origin;
      checkPluginReadmeVersions(siteUrl, request.plugins).then(plugins => sendResponse({ plugins }));
    });
    return true;
  }

  // --- REST API routes ---
  if (request.action === "checkRestRoutes") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const siteUrl = new URL(tabs[0].url).origin;
      checkRestRoutes(siteUrl).then(result => sendResponse(result));
    });
    return true;
  }

  // --- Security headers ---
  if (request.action === "checkSecurityHeaders") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const siteUrl = new URL(tabs[0].url).origin;
      checkSecurityHeaders(siteUrl).then(headers => sendResponse({ headers }));
    });
    return true;
  }

  // --- oEmbed username scan ---
  if (request.action === "scanUsernamesOembed") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const siteUrl = new URL(tabs[0].url).origin;
      scanUsernamesViaOembed(siteUrl, request.postUrls || []).then(usernames => sendResponse({ usernames }));
    });
    return true;
  }

  // --- Deep XML-RPC analysis (adaptive severity) ---
  if (request.action === "checkXmlrpcDeep") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const siteUrl = new URL(tabs[0].url).origin;
      checkXmlrpcDeep(siteUrl, request.wpVersion).then(result => sendResponse(result));
    });
    return true;
  }

  // --- Directory listings ---
  if (request.action === "checkDirectoryListings") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const siteUrl = new URL(tabs[0].url).origin;
      checkDirectoryListings(siteUrl).then(result => sendResponse({ results: result }));
    });
    return true;
  }
});
