console.log('[ThemeChanger] Content script loaded');
      // Funzione per aggiornare l'icona dopo il cambio tema
      function refreshThemeIcon() {
        const theme = getLocalTheme();
        clone.innerHTML = (theme === 'dark') ? whiteSVG : graySVG;
      }





// Draggable popup interface for theme selection

(function() {
  // Create the popup only once
  // Function to change SVG color, now global

  function createThemePopup() {
    // Set the selected theme when opening
    chrome.runtime.sendMessage({action: 'getTheme'}, function(response) {
  console.log('[ThemeChanger] getTheme response:', response);
  console.log('[ThemeChanger] setTheme response:', response);
      if (response && response.theme) {
        const themeSelect = popup.querySelector('#theme-select');
        if (themeSelect) themeSelect.value = response.theme;
      }
    });
    if (document.getElementById('wplace-theme-popup')) return;
    const popup = document.createElement('div');
    popup.id = 'wplace-theme-popup';
    popup.innerHTML = `
  <style>
  #wplace-theme-popup { position: fixed; top: 32px; left: 50%; transform: translateX(-50%); z-index: 99999; background: #222; color: #fff; border-radius: 10px; box-shadow: 0 2px 12px #0008; padding: 16px 32px 12px 32px; font-family: sans-serif; min-width: 220px; user-select: none; cursor: grab; }
      #wplace-theme-popup h3 { margin: 0 0 10px 0; font-size: 1.1em; font-weight: bold; text-align: center; }
      #wplace-theme-popup .theme-btn { margin: 0 6px 6px 0; padding: 7px 16px; border: none; border-radius: 6px; background: #444; color: #fff; font-size: 1em; cursor: pointer; transition: background 0.2s; }
      #wplace-theme-popup .theme-btn.selected { background: #ff9800; color: #222; font-weight: bold; }
      #wplace-theme-popup .theme-btn.dark.selected { background: #2196f3; color: #fff; }
      #wplace-theme-popup .theme-btn.fiord.selected { background: #6a8caf; color: #fff; }
      #wplace-theme-popup .theme-btn.halloween.selected { background: #ff5722; color: #fff; }
      #wplace-theme-popup .theme-btn.original.selected { background: #fff; color: #222; }
      #wplace-theme-popup .btn {
        position: absolute;
        right: 18px;
        top: 12px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: #fff;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
        z-index: 100000;
      }
      #wplace-theme-popup .btn:hover {
        background: #444;
      }
      </style>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <h3 style="margin: 0; font-size: 1.1em; font-weight: bold; flex: 1; text-align: center; padding-right: 32px;">Theme</h3>
        <button class="btn btn-circle btn-ghost" title="Close" style="width: 28px; height: 28px;">✕</button>
      </div>
      <select id="theme-select" style="width:100%; padding:8px; border-radius:6px; background:#444; color:#fff; font-size:1em;">
        <option value="acquerello">Acquerello</option>
        <option value="aurora-boreale">Aurora Boreale</option>
        <option value="cute">Cute</option>
        <option value="dark">Dark</option>
        <option value="halloween">Halloween</option>
        <option value="liberty">Liberty</option>
        <option value="pixel-art-retro">Pixel Art Retro</option>
        <option value="positron">Positron</option>
        <option value="purple">Purple</option>
        <option value="rainbow">Rainbow</option>
        <option value="space">Space</option>
      </select>
    `;
    popup.style.display = 'none';
    document.body.appendChild(popup);
    // Drag logic
    let isDragging = false, startX = 0, startY = 0, origX = 0, origY = 0;
    popup.addEventListener('mousedown', function(e) {
      // Non trascinare se si clicca sulla X
      if (e.target.classList.contains('btn')) return;
      if (e.target.tagName === 'BUTTON') return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origX = popup.offsetLeft;
      origY = popup.offsetTop;
      popup.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      let dx = e.clientX - startX;
      let dy = e.clientY - startY;
      popup.style.left = (origX + dx) + 'px';
      popup.style.top = (origY + dy) + 'px';
    });
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        popup.style.cursor = 'grab';
      }
    });
    // X chiudi
    popup.querySelector('.btn').addEventListener('click', function(e) {
      popup.style.display = 'none';
    });

    

    // Dropdown theme selector
    const themeSelect = popup.querySelector('#theme-select');
    themeSelect.addEventListener('change', function(e) {
      const theme = themeSelect.value;
      chrome.runtime.sendMessage({action: 'setTheme', theme}, function(response) {
        if (response && response.success) {
          setTimeout(() => {
            window.location.reload();
          }, 200);
        }
      });
    });
  }

  // Bottone rosso sempre presente dopo Leaderboard
  function addThemeSwitchButton() {
    if (document.getElementById('wplace-theme-switch-btn')) return;
    const leaderboardBtn = Array.from(document.querySelectorAll('button')).find(
      btn => btn.title && btn.title.trim() === 'Leaderboard'
    );
    if (leaderboardBtn && leaderboardBtn.parentNode) {
      const clone = leaderboardBtn.cloneNode(true);
      clone.id = 'wplace-theme-switch-btn';
      clone.title = 'Switch theme'; // Imposta il colore del bottone e dell'icona SVG su nero

      // SVG icone
      const whiteSVG = `<svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45.22 35.581C45.2395 35.5367 45.2666 35.4961 45.3 35.461C45.3235 35.4253 45.3503 35.3919 45.38 35.361L45.5 35.241C45.55 35.201 45.59 35.151 45.65 35.111C45.74 35.031 45.85 34.941 45.97 34.851C46.11 34.751 46.26 34.651 46.42 34.541C46.71 34.341 47.03 34.131 47.35 33.941C47.67 33.751 47.99 33.541 48.28 33.371C51.97 31.161 58.12 27.471 55.94 19.881C55.9206 19.7878 55.8904 19.6972 55.85 19.611C55.8388 19.558 55.8185 19.5072 55.79 19.461C55.7775 19.4226 55.7607 19.3857 55.74 19.351C53.2711 14.8634 49.5318 11.205 44.9913 8.83486C40.4508 6.4647 35.3114 5.48842 30.2181 6.02853C25.1248 6.56864 20.3044 8.60108 16.362 11.8708C12.4195 15.1405 9.53067 19.5018 8.05789 24.4074C6.58512 29.313 6.59406 34.5443 8.08359 39.4448C9.57312 44.3453 12.4769 48.6967 16.4305 51.9529C20.384 55.2091 25.2113 57.2251 30.3064 57.7478C35.4016 58.2705 40.5376 57.2767 45.07 54.891C45.162 54.8509 45.2492 54.8006 45.33 54.741C45.3584 54.7235 45.3852 54.7034 45.41 54.681C48.06 52.801 50.45 49.081 48.48 44.771C47.94 43.591 47.43 42.571 46.97 41.681C46.3626 40.5906 45.8507 39.4497 45.44 38.271C45.3907 38.1237 45.3506 37.9734 45.32 37.821C45.1458 37.0943 45.1085 36.3414 45.21 35.601C45.21 35.591 45.22 35.591 45.22 35.581ZM18.01 31.881C18.01 30.9614 18.2827 30.0623 18.7937 29.2976C19.3046 28.533 20.0308 27.9369 20.8805 27.585C21.7302 27.2331 22.6652 27.141 23.5672 27.3204C24.4692 27.4998 25.2977 27.9427 25.9481 28.593C26.5984 29.2433 27.0412 30.0719 27.2206 30.9739C27.4001 31.8759 27.308 32.8108 26.956 33.6605C26.6041 34.5102 26.0081 35.2364 25.2434 35.7474C24.4787 36.2583 23.5797 36.531 22.66 36.531C21.4271 36.53 20.2449 36.0397 19.3731 35.1679C18.5013 34.2961 18.0111 33.114 18.01 31.881ZM26.43 45.711C25.7284 45.712 25.0424 45.5048 24.4586 45.1157C23.8749 44.7265 23.4198 44.1729 23.1508 43.525C22.8819 42.877 22.8113 42.1638 22.9479 41.4757C23.0845 40.7875 23.4222 40.1554 23.9183 39.6593C24.4144 39.1633 25.0465 38.8255 25.7346 38.6889C26.4227 38.5523 27.136 38.6229 27.7839 38.8918C28.4319 39.1608 28.9855 39.6159 29.3746 40.1997C29.7638 40.7834 29.971 41.4695 29.97 42.171C29.9682 43.1093 29.5946 44.0087 28.9311 44.6721C28.2676 45.3356 27.3683 45.7092 26.43 45.711ZM32.94 28.131C31.6479 28.13 30.3851 27.7461 29.3112 27.0276C28.2373 26.3092 27.4005 25.2885 26.9065 24.0946C26.4125 22.9007 26.2835 21.5871 26.5358 20.3199C26.7881 19.0527 27.4104 17.8887 28.3241 16.9751C29.2377 16.0615 30.4017 15.4392 31.6689 15.1869C32.9361 14.9345 34.2496 15.0635 35.4435 15.5575C36.6374 16.0515 37.6581 16.8884 38.3766 17.9623C39.095 19.0362 39.479 20.299 39.48 21.591C39.479 23.3249 38.7894 24.9873 37.5631 26.2129C36.3367 27.4386 34.6738 28.127 32.94 28.127V28.131Z" fill="currentColor"/></svg>`;
      const graySVG = `<svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45.22 35.581C45.2395 35.5367 45.2666 35.4961 45.3 35.461C45.3235 35.4253 45.3503 35.3919 45.38 35.361L45.5 35.241C45.55 35.201 45.59 35.151 45.65 35.111C45.74 35.031 45.85 34.941 45.97 34.851C46.11 34.751 46.26 34.651 46.42 34.541C46.71 34.341 47.03 34.131 47.35 33.941C47.67 33.751 47.99 33.541 48.28 33.371C51.97 31.161 58.12 27.471 55.94 19.881C55.9206 19.7878 55.8904 19.6972 55.85 19.611C55.8388 19.558 55.8185 19.5072 55.79 19.461C55.7775 19.4226 55.7607 19.3857 55.74 19.351C53.2711 14.8634 49.5318 11.205 44.9913 8.83486C40.4508 6.4647 35.3114 5.48842 30.2181 6.02853C25.1248 6.56864 20.3044 8.60108 16.362 11.8708C12.4195 15.1405 9.53067 19.5018 8.05789 24.4074C6.58512 29.313 6.59406 34.5443 8.08359 39.4448C9.57312 44.3453 12.4769 48.6967 16.4305 51.9529C20.384 55.2091 25.2113 57.2251 30.3064 57.7478C35.4016 58.2705 40.5376 57.2767 45.07 54.891C45.162 54.8509 45.2492 54.8006 45.33 54.741C45.3584 54.7235 45.3852 54.7034 45.41 54.681C48.06 52.801 50.45 49.081 48.48 44.771C47.94 43.591 47.43 42.571 46.97 41.681C46.3626 40.5906 45.8507 39.4497 45.44 38.271C45.3907 38.1237 45.3506 37.9734 45.32 37.821C45.1458 37.0943 45.1085 36.3414 45.21 35.601C45.21 35.591 45.22 35.591 45.22 35.581ZM18.01 31.881C18.01 30.9614 18.2827 30.0623 18.7937 29.2976C19.3046 28.533 20.0308 27.9369 20.8805 27.585C21.7302 27.2331 22.6652 27.141 23.5672 27.3204C24.4692 27.4998 25.2977 27.9427 25.9481 28.593C26.5984 29.2433 27.0412 30.0719 27.2206 30.9739C27.4001 31.8759 27.308 32.8108 26.956 33.6605C26.6041 34.5102 26.0081 35.2364 25.2434 35.7474C24.4787 36.2583 23.5797 36.531 22.66 36.531C21.4271 36.53 20.2449 36.0397 19.3731 35.1679C18.5013 34.2961 18.0111 33.114 18.01 31.881ZM26.43 45.711C25.7284 45.712 25.0424 45.5048 24.4586 45.1157C23.8749 44.7265 23.4198 44.1729 23.1508 43.525C22.8819 42.877 22.8113 42.1638 22.9479 41.4757C23.0845 40.7875 23.4222 40.1554 23.9183 39.6593C24.4144 39.1633 25.0465 38.8255 25.7346 38.6889C26.4227 38.5523 27.136 38.6229 27.7839 38.8918C28.4319 39.1608 28.9855 39.6159 29.3746 40.1997C29.7638 40.7834 29.971 41.4695 29.97 42.171C29.9682 43.1093 29.5946 44.0087 28.9311 44.6721C28.2676 45.3356 27.3683 45.7092 26.43 45.711ZM32.94 28.131C31.6479 28.13 30.3851 27.7461 29.3112 27.0276C28.2373 26.3092 27.4005 25.2885 26.9065 24.0946C26.4125 22.9007 26.2835 21.5871 26.5358 20.3199C26.7881 19.0527 27.4104 17.8887 28.3241 16.9751C29.2377 16.0615 30.4017 15.4392 31.6689 15.1869C32.9361 14.9345 34.2496 15.0635 35.4435 15.5575C36.6374 16.0515 37.6581 16.8884 38.3766 17.9623C39.095 19.0362 39.479 20.299 39.48 21.591C39.479 23.3249 38.7894 24.9873 37.5631 26.2129C36.3367 27.4386 34.6738 28.127 32.94 28.127V28.131Z" fill="currentColor"/></svg>`;

      // Funzione per ottenere il tema locale
      function getLocalTheme() {
        return localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme') || 'custom-winter';
      }

      // Imposta l'icona in base al tema locale
      const currentTheme = getLocalTheme();
      clone.innerHTML = (currentTheme === 'dark') ? whiteSVG : graySVG;

      clone.onclick = function(e) {
        e.preventDefault();
        const popup = document.getElementById('wplace-theme-popup');
        if (popup) {
          chrome.runtime.sendMessage({action: 'getTheme'}, function(response) {
            if (response && response.theme) {
              popup.querySelectorAll('.theme-btn').forEach(b => {
                b.classList.remove('selected');
                if (b.getAttribute('data-theme') === response.theme) {
                  b.classList.add('selected');
                }
              });
            }
            popup.style.display = 'block';
          });
        }
      };

      // Aggiorna l'icona quando cambia il tema
      window.addEventListener('storage', function(e) {
        if (e.key === 'theme') {
          refreshThemeIcon();
        }
      });
      // Supporto mobile: touchstart
      clone.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const popup = document.getElementById('wplace-theme-popup');
        if (popup) {
          chrome.runtime.sendMessage({action: 'getTheme'}, function(response) {
            if (response && response.theme) {
              popup.querySelectorAll('.theme-btn').forEach(b => {
                b.classList.remove('selected');
                if (b.getAttribute('data-theme') === response.theme) {
                  b.classList.add('selected');
                }
              });
            }
            popup.style.display = 'block';
          });
        }
      }, {passive: false});
      leaderboardBtn.parentNode.insertBefore(clone, leaderboardBtn.nextSibling);
      console.log('[ThemeSwitcher] Bottone rosso creato e inserito nel DOM');
    }
  }

  function observeLeaderboardButton() {
    addThemeSwitchButton();
    const observer = new MutationObserver(() => {
      addThemeSwitchButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      createThemePopup();
      observeLeaderboardButton();
    });
  } else {
    createThemePopup();
    observeLeaderboardButton();
  }
})();
