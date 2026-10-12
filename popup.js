// Dark mode toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

let currentTabId;
let currentPostUrls = [];
let currentWPVersion = "Unknown";

// Initialize popup
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentTabId = tabs[0].id;
  chrome.tabs.sendMessage(tabs[0].id, { action: "checkWP" }, (response) => {
    const status = document.getElementById("status");
    const scanButton = document.getElementById("scanUsers");

    if (response?.isWP) {
      status.innerHTML = '<span>✅</span><span>WordPress Detected</span>';
      status.className = "yes";
      scanButton.disabled = false;
      document.getElementById("checkReg").disabled = false;
      document.getElementById("checkPath").disabled = false;
      document.getElementById("checkMisconfig").disabled = false;
      document.getElementById("checkRestRoutes").disabled = false;
      document.getElementById("checkHeaders").disabled = false;
      document.getElementById("checkXmlrpcDeep").disabled = false;
      document.getElementById("checkDirListings").disabled = false;
      currentPostUrls = response.postUrls || [];
      currentWPVersion = response.wpVersion || "Unknown";

      // Update site info
      document.getElementById("siteTitle").textContent = response.siteTitle || "Unknown";
      document.getElementById("wpVersion").textContent = response.wpVersion || "Unknown";
      document.getElementById("theme").textContent = response.theme || "Unknown";
      document.getElementById("restApi").textContent = response.restApi || "Not available";
      document.getElementById("xmlrpc").textContent = response.xmlrpc || "Unknown";

      // Display plugins if detected
      if (response.plugins && response.plugins.length > 0) {
        displayPlugins(response.plugins);

        // Cross-check versions against each plugin's readme.txt in the background,
        // then re-render once the (usually more accurate) versions come back.
        chrome.runtime.sendMessage(
          { action: "checkPluginReadmeVersions", plugins: response.plugins },
          (readmeResponse) => {
            if (readmeResponse?.plugins) {
              displayPlugins(readmeResponse.plugins);
            }
          }
        );
      }

      // Display WordPress vulnerabilities if detected
      if (response.wpVulnerabilities && response.wpVulnerabilities.length > 0) {
        displayWPVulnerabilities(response.wpVulnerabilities);
      }
    } else {
      status.innerHTML = '<span>❌</span><span>Not WordPress</span>';
      status.className = "no";
      document.getElementById("siteTitle").textContent = "N/A";
      document.getElementById("wpVersion").textContent = "N/A";
      document.getElementById("theme").textContent = "N/A";
      document.getElementById("restApi").textContent = "N/A";
      document.getElementById("xmlrpc").textContent = "N/A";
    }
  });
});

// Display detected plugins
function displayPlugins(plugins) {
  const pluginsSection = document.getElementById("pluginsSection");
  const pluginsDiv = document.getElementById("plugins");

  pluginsSection.style.display = "block";
  pluginsDiv.innerHTML = "";

  if (plugins.length === 0) {
    pluginsDiv.innerHTML = '<div class="empty-state">No plugins detected</div>';
    return;
  }

  plugins.forEach(plugin => {
    const pluginItem = document.createElement("div");
    pluginItem.className = "plugin-item";

    let cveHTML = "";
    if (plugin.cves && plugin.cves.length > 0) {
      cveHTML = plugin.cves.map(cve => {
        const severity = cve.severity || "medium";
        return `<span class="cve-badge cve-${severity}" title="${cve.description || ''}">${cve.id}</span>`;
      }).join(" ");
    }

    let readmeHTML = "";
    if (plugin.readmeVersion && plugin.readmeVersion !== plugin.version) {
      readmeHTML = `<div class="plugin-version">readme.txt Stable tag: ${plugin.readmeVersion}</div>`;
    }

    pluginItem.innerHTML = `
      <div class="plugin-name">${plugin.name}</div>
      <div class="plugin-version">Version: ${plugin.version || "Unknown"}</div>
      ${readmeHTML}
      ${cveHTML}
    `;

    pluginsDiv.appendChild(pluginItem);
  });
}

// Display WordPress core vulnerabilities
function displayWPVulnerabilities(vulns) {
  if (!vulns || vulns.length === 0) return;

  const vulnSection = document.getElementById("wpVulnSection");
  const vulnDiv = document.getElementById("wpVulnerabilities");

  vulnSection.style.display = "block";
  vulnDiv.innerHTML = "";

  vulns.forEach(vuln => {
    const vulnItem = document.createElement("div");
    vulnItem.className = "plugin-item";

    const severity = vuln.severity || "medium";

    vulnItem.innerHTML = `
      <div class="plugin-name">${vuln.title}</div>
      <div class="plugin-version">${vuln.date}</div>
      <span class="cve-badge cve-${severity}">${vuln.affectedVersions}</span>
    `;

    vulnDiv.appendChild(vulnItem);
  });
}

// Copy to clipboard function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied: ' + text);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// ============================================================================
// USERNAME SCAN — AGGRESSIVE (1-50 IDs) WITH SOURCE PROVENANCE
// ============================================================================

document.getElementById("scanUsers").addEventListener("click", () => {
  const button = document.getElementById("scanUsers");
  const resultsDiv = document.getElementById("userResults");

  button.disabled = true;
  button.innerHTML = '<span class="loading"></span><span>Scanning...</span>';
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = '<div class="empty-state">Enumerating users via DOM, REST API, Author IDs (1-50), and oEmbed...</div>';

  // Step 1: Get structured sources from background
  chrome.runtime.sendMessage({ action: "scanUsers" }, (response) => {
    const sources = response?.sources || { dom: [], rest: [], authorId: [], oembed: [] };

    // Step 2: Get oEmbed users
    chrome.runtime.sendMessage(
      { action: "scanUsernamesOembed", postUrls: currentPostUrls },
      (oembedResponse) => {
        sources.oembed = oembedResponse?.usernames || [];

        // Step 3: Aggregate with provenance
        chrome.runtime.sendMessage(
          { action: "aggregateUsers", sources: sources },
          (aggResponse) => {
            button.disabled = false;
            button.innerHTML = '<span>🔍</span><span>Scan for Usernames</span>';

            const aggregated = aggResponse?.aggregated || [];

            if (aggregated.length) {
              const chips = aggregated.map(item => {
                const sourceBadges = item.sources.map(s => {
                  const colors = {
                    'DOM': '#46b450',
                    'REST API': '#00a0d2', 
                    'Author ID': '#f56e28',
                    'oEmbed': '#8268a8'
                  };
                  return `<span style="display:inline-block;background:${colors[s]||'#666'};color:white;padding:1px 5px;border-radius:3px;font-size:9px;margin-left:3px;vertical-align:middle;">${s}</span>`;
                }).join('');
                return `<span class="username-chip" onclick="copyToClipboard('${item.username}')" title="Click to copy">${item.username}${sourceBadges}</span>`;
              }).join("");
              resultsDiv.innerHTML = `<strong>Found ${aggregated.length} username(s):</strong><br><div style="margin-top:8px;font-size:11px;color:var(--text-secondary);">💡 Click username to copy. Colored badges show discovery source.</div>${chips}`;
            } else {
              resultsDiv.innerHTML = '<div class="empty-state">No usernames found or site is protected</div>';
            }
          }
        );
      }
    );
  });
});

// ============================================================================
// REGISTRATION STATUS CHECK
// ============================================================================

document.getElementById("checkReg").addEventListener("click", () => {
  const button = document.getElementById("checkReg");
  const resultsDiv = document.getElementById("regResults");

  button.disabled = true;
  button.innerHTML = '<span class="loading"></span><span>Checking...</span>';
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = '<div class="empty-state">Probing registration endpoint...</div>';

  chrome.runtime.sendMessage({ action: "checkRegistration" }, (response) => {
    button.disabled = false;
    button.innerHTML = '<span>Check User Registration Status</span>';

    if (response?.enabled) {
      resultsDiv.innerHTML = `<div class="plugin-item">Registration is <b style="color:#dc3232;">enabled</b> on this site.<br><a href="${response.url}" target="_blank">${response.url}</a></div>`;
    } else if (response?.reason === 'redirected-away') {
      resultsDiv.innerHTML = '<div class="empty-state">Registration is disabled — the site redirected away from the register page.</div>';
    } else if (response?.error) {
      resultsDiv.innerHTML = '<div class="empty-state">Could not reach the registration endpoint.</div>';
    } else {
      resultsDiv.innerHTML = '<div class="empty-state">Registration form not detected on this page.</div>';
    }
  });
});

// ============================================================================
// PATH DISCLOSURE CHECK
// ============================================================================

document.getElementById("checkPath").addEventListener("click", () => {
  const button = document.getElementById("checkPath");
  const resultsDiv = document.getElementById("pathResults");

  button.disabled = true;
  button.innerHTML = '<span class="loading"></span><span>Checking...</span>';
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = '<div class="empty-state">Probing wp-includes/rss.php...</div>';

  chrome.runtime.sendMessage({ action: "checkPathDisclosure" }, (response) => {
    button.disabled = false;
    button.innerHTML = '<span>Check Path Disclosure</span>';

    if (response?.found) {
      resultsDiv.innerHTML = `<div class="plugin-item">Server path disclosed:<br><span class="username-chip" onclick="copyToClipboard('${response.path}')" title="Click to copy">${response.path}</span></div>`;
    } else {
      resultsDiv.innerHTML = '<div class="empty-state">No path disclosure found.</div>';
    }
  });
});

// ============================================================================
// MISCONFIGURATION / EXPOSED FILES CHECK (extended: zip, db, tar, logs, json)
// ============================================================================

document.getElementById("checkMisconfig").addEventListener("click", () => {
  const button = document.getElementById("checkMisconfig");
  const resultsDiv = document.getElementById("misconfigResults");

  button.disabled = true;
  button.innerHTML = '<span class="loading"></span><span>Checking...</span>';
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = '<div class="empty-state">Probing 45+ common exposed paths (backups, archives, DB dumps, logs, configs)...</div>';

  chrome.runtime.sendMessage({ action: "checkMisconfig" }, (response) => {
    button.disabled = false;
    button.innerHTML = '<span>Check Misconfigurations</span>';

    const results = response?.results || [];
    if (results.length === 0) {
      resultsDiv.innerHTML = '<div class="empty-state">No common misconfigurations found. Good!</div>';
      return;
    }

    const items = results.map(r =>
      `<div class="plugin-item"><div class="plugin-name">⚠️ ${r.label}</div><a href="${r.url}" target="_blank" style="font-size:11px;word-break:break-all;">${r.url}</a></div>`
    ).join("");
    resultsDiv.innerHTML = `<strong style="color:#dc3232;">${results.length} exposed file(s) found:</strong>${items}`;
  });
});

// ============================================================================
// REST API ROUTE LISTING
// ============================================================================

document.getElementById("checkRestRoutes").addEventListener("click", () => {
  const button = document.getElementById("checkRestRoutes");
  const resultsDiv = document.getElementById("restRoutesResults");

  button.disabled = true;
  button.innerHTML = '<span class="loading"></span><span>Fetching...</span>';
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = '<div class="empty-state">Fetching wp-json/ index...</div>';

  chrome.runtime.sendMessage({ action: "checkRestRoutes" }, (response) => {
    button.disabled = false;
    button.innerHTML = '<span>List REST API Routes</span>';

    const routes = response?.routes || [];
    if (routes.length === 0) {
      resultsDiv.innerHTML = '<div class="empty-state">No routes found or REST API is disabled.</div>';
      return;
    }

    const items = routes.map(r => `<div style="font-size:11px;font-family:monospace;padding:2px 0;word-break:break-all;">${r}</div>`).join("");
    resultsDiv.innerHTML = `<strong>${routes.length} route(s):</strong>${items}`;
  });
});

// ============================================================================
// SECURITY HEADERS CHECK
// ============================================================================

document.getElementById("checkHeaders").addEventListener("click", () => {
  const button = document.getElementById("checkHeaders");
  const resultsDiv = document.getElementById("headersResults");

  button.disabled = true;
  button.innerHTML = '<span class="loading"></span><span>Checking...</span>';
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = '<div class="empty-state">Reading response headers...</div>';

  chrome.runtime.sendMessage({ action: "checkSecurityHeaders" }, (response) => {
    button.disabled = false;
    button.innerHTML = '<span>Check Security Headers</span>';

    const headers = response?.headers;
    if (!headers) {
      resultsDiv.innerHTML = '<div class="empty-state">Could not read headers.</div>';
      return;
    }

    const items = Object.entries(headers).map(([name, value]) => {
      const present = !!value;
      const icon = present ? '✅' : '❌';
      const color = present ? 'var(--text-primary)' : '#dc3232';
      return `<div class="plugin-item"><div class="plugin-name" style="color:${color}">${icon} ${name}</div><div class="plugin-version">${present ? value : 'Not set — security risk'}</div></div>`;
    }).join("");
    resultsDiv.innerHTML = items;
  });
});

// ============================================================================
// DEEP XML-RPC SCAN (adaptive severity based on WP version)
// ============================================================================

document.getElementById("checkXmlrpcDeep").addEventListener("click", () => {
  const button = document.getElementById("checkXmlrpcDeep");
  const resultsDiv = document.getElementById("xmlrpcDeepResults");

  button.disabled = true;
  button.innerHTML = '<span class="loading"></span><span>Analyzing...</span>';
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = '<div class="empty-state">Probing XML-RPC methods, pingback, multicall...</div>';

  chrome.runtime.sendMessage({ action: "checkXmlrpcDeep", wpVersion: currentWPVersion }, (response) => {
    button.disabled = false;
    button.innerHTML = '<span>🔍</span><span>Deep XML-RPC Scan</span>';

    if (!response?.enabled) {
      resultsDiv.innerHTML = '<div class="empty-state">XML-RPC appears disabled or unreachable.</div>';
      return;
    }

    const severityColor = {
      'critical': '#dc3232',
      'high': '#f56e28',
      'medium': '#f56e28',
      'low': '#46b450'
    };

    let html = `<div class="plugin-item" style="border-left-color:${severityColor[response.severity]||'#666'}">`;
    html += `<div class="plugin-name">Status: ${response.enabled ? 'Enabled' : 'Disabled'} | Severity: <span style="color:${severityColor[response.severity]||'#666'};font-weight:700;">${response.severity.toUpperCase()}</span></div>`;

    if (response.methods.length) {
      html += `<div class="plugin-version">Methods enumerated: ${response.methods.length}</div>`;
    }

    if (response.pingback) {
      html += `<div style="color:#f56e28;font-size:12px;margin-top:4px;">⚠️ pingback.ping available → SSRF / DDoS amplification</div>`;
    }
    if (response.multicall) {
      html += `<div style="color:#f56e28;font-size:12px;margin-top:4px;">⚠️ system.multicall available</div>`;
    }
    if (response.bruteForceAmplification) {
      html += `<div style="color:#dc3232;font-size:12px;margin-top:4px;font-weight:600;">🚨 Brute-force amplification VULNERABLE (WP &lt; 4.4)</div>`;
    }

    if (response.details.length) {
      html += `<div style="margin-top:8px;font-size:11px;color:var(--text-secondary);line-height:1.5;">${response.details.join('<br>')}</div>`;
    }

    html += '</div>';
    resultsDiv.innerHTML = html;
  });
});

// ============================================================================
// DIRECTORY LISTINGS CHECK
// ============================================================================

document.getElementById("checkDirListings").addEventListener("click", () => {
  const button = document.getElementById("checkDirListings");
  const resultsDiv = document.getElementById("dirListingsResults");

  button.disabled = true;
  button.innerHTML = '<span class="loading"></span><span>Checking...</span>';
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = '<div class="empty-state">Probing common directories for index listings...</div>';

  chrome.runtime.sendMessage({ action: "checkDirectoryListings" }, (response) => {
    button.disabled = false;
    button.innerHTML = '<span>📁</span><span>Check Directory Listings</span>';

    const results = response?.results || [];
    if (results.length === 0) {
      resultsDiv.innerHTML = '<div class="empty-state">No directory listings found. Good!</div>';
      return;
    }

    const items = results.map(r =>
      `<div class="plugin-item" style="border-left-color:#f56e28;"><div class="plugin-name">⚠️ ${r.label}</div><a href="${r.path}" target="_blank" style="font-size:11px;word-break:break-all;">${r.path}</a></div>`
    ).join("");
    resultsDiv.innerHTML = `<strong style="color:#f56e28;">${results.length} exposed directory listing(s):</strong>${items}`;
  });
});
