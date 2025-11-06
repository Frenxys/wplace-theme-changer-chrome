chrome.declarativeNetRequest.onRuleMatchedDebug && chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  console.log('[ThemeChanger] Rule matched:', info);
});
console.log('[ThemeChanger] Service worker started');

// Manifest V3 service worker background



let selectedTheme = "space";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[ThemeChanger] Message received:', request);
  if (request.action === "setTheme" && typeof request.theme === "string" && request.theme.length > 0) {
    selectedTheme = request.theme;
    console.log('[ThemeChanger] Theme set to:', selectedTheme);
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
            url: `https://wplacepixels-default-rtdb.europe-west1.firebasedatabase.app/themes/${theme}.json`
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
    fetch(`https://wplacepixels-default-rtdb.europe-west1.firebasedatabase.app/themes/${theme}.json`)
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


// Stampa tutti i temi disponibili su Firebase all'avvio
fetch('https://wplacepixels-default-rtdb.europe-west1.firebasedatabase.app/themes.json')
  .then(r => r.json())
  .then(data => {
    if (data && typeof data === 'object') {
      const themeKeys = Object.keys(data);
      console.log('[ThemeChanger] Temi disponibili su Firebase:');
      themeKeys.forEach(key => {
        const displayName = data[key].name || key;
        console.log(`- ${key} (${displayName})`);
      });
    } else {
      console.log('[ThemeChanger] Nessun tema trovato su Firebase.');
    }
  })
  .catch(e => {
    console.error('[ThemeChanger] Errore fetch temi Firebase:', e);
  });

// Imposta la regola di default all'avvio
updateThemeRedirect(selectedTheme);
