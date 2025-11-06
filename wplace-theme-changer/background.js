chrome.declarativeNetRequest.onRuleMatchedDebug && chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  console.log('[ThemeChanger] Rule matched:', info);
});
console.log('[ThemeChanger] Service worker started');

// Manifest V3 service worker background

const THEMES = [
  "acquerello",
  "aurora-boreale",
  "cute",
  "dark",
  "halloween",
  "liberty",
  "pixel-art-retro",
  "positron",
  "purple",
  "rainbow",
  "space"
];

let selectedTheme = "space";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[ThemeChanger] Message received:', request);
  if (request.action === "setTheme" && THEMES.includes(request.theme)) {
  console.log('[ThemeChanger] Theme set to:', selectedTheme);
    selectedTheme = request.theme;
    sendResponse({success: true, theme: selectedTheme});
    updateThemeRedirect(selectedTheme);
  } else if (request.action === "getTheme") {
    sendResponse({theme: selectedTheme});
  }
  return true;
});

  function updateThemeRedirect(theme) {
  console.log('[ThemeChanger] Updating redirect rule for theme:', theme);
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            url: `https://wplacepixels.web.app/themes/${theme}.json`
          }
        },
        condition: {
          urlFilter: "/styles/",
          resourceTypes: ["xmlhttprequest"]
        }
      }
    ]
  }, () => {
    console.log('[ThemeChanger] Dynamic rules updated for theme:', theme);
    // Test fetch del file JSON del tema
    fetch(`https://wplacepixels.web.app/themes/${theme}.json`)
      .then(r => {
        console.log('[ThemeChanger] Theme JSON fetch status:', r.status);
        return r.text();
      })
      .then(text => {
        console.log('[ThemeChanger] Theme JSON content:', text.slice(0, 200));
      })
      .catch(e => {
        console.error('[ThemeChanger] Theme JSON fetch error:', e);
      });
  });
  }

  // Imposta la regola di default all'avvio
  updateThemeRedirect(selectedTheme);
