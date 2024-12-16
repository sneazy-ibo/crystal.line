class PowerlineUI {
  constructor() {
    this.mainDialog = document.getElementById('mainDialog');
    this.observer = null;

    this.SELECTORS = {
      MAIN_DIALOG: '#mainDialog',
      MOBILE_BOX: '#mobileBoxId',
      GAME_CANVAS: '#gameCanvas',
      SOUND_BOX: '.soundBox',
      MOBILE_BOX_CLASS: '.mobileBox',
      AD_SELECTORS: [
        '#slot-1',
        '#slot-2',
        '#slot-3',
        '#slot-3-wrapper',
        '.powerline_leaderboard_venatus',
        '.powerline_center_venatus'
      ]
    };

    this.CSS_STYLES = `
      .leftBottomBox {
        z-index: 1000;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: #003a3a;
        border-radius: 0 5px 0 5px;
        padding: 5px 10px;
        border: 2px solid #05ffff;
        color: #05ffff;
      }
      .leftBottomBox a {
        color: #00FFFF;
        text-decoration: none;
      }
      .leftBottomBox a:hover {
        text-decoration: underline;
      }
      .soundBox {
        z-index: 1000;
        position: absolute;
        bottom: 0 !important;
        left: 310px !important;
        padding: 7px 10px;
      }
      .mobileBox {
        z-index: 1000;
        position: absolute;
        bottom: 40px;
        left: 0;
        padding: 1px 1px 100px 1px;
        background-color: rgba(0, 100, 100, .2);
        border-radius: 5px;
      }
    `;
  }

  init() {
    if (!this.mainDialog) return;

    this.removeOldStyles();
    this.updateMobileBox();
    this.createFooter();
    this.injectStyles();
    this.removeAdElements();
    this.setupAdObserver();
  }

  removeOldStyles() {
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (let j = rules.length - 1; j >= 0; j--) {
          if ([this.SELECTORS.SOUND_BOX, this.SELECTORS.MOBILE_BOX_CLASS].includes(rules[j].selectorText)) {
            sheet.deleteRule(j);
          }
        }
      } catch (e) {
        //
      }
    });
  }

  removeAdElements() {
    const adElements = document.querySelectorAll(this.SELECTORS.AD_SELECTORS.join(', '));
    adElements.forEach(element => element.remove());
  }

  setupAdObserver() {
    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (this.SELECTORS.AD_SELECTORS.some(selector =>
              node.matches?.(selector) || node.querySelector?.(selector)
            )) {
              node.remove();
            }
          }
        });
      });
    });

    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  updateMobileBox() {
    const mobileBox = document.querySelector(this.SELECTORS.MOBILE_BOX);
    if (!mobileBox) return;

    mobileBox.innerHTML = `
      <div style="height:10px;"></div>
      <center>
        <img src="https://github.com/Dalrae1/Powerline.io/blob/f3724b6b624a1c1e89f521d3af1d011c3f4a30ce/webserver/images/banner_mobile_text.png?raw=true">
      </center>
      <div style="line-height:60%;"><br></div>
      <center style="display: flex; justify-content: center; align-items: center; gap: 10px;">
        <a href="https://itunes.apple.com/us/app/powerline-io/id1267397935?mt=8" target="_blank">
          <img src="images/badge_ios.png" alt="iOS Badge">
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.profusionstudios.powerlineio" target="_blank">
          <img src="images/badge_android.png" alt="Android Badge">
        </a>
      </center>
    `;

    Object.assign(mobileBox.style, {
      width: '315px',
      height: '92px'
    });
  }

  createFooter() {
    const footer = document.createElement('footer');
    footer.id = 'leftBottomBox';
    footer.className = 'leftBottomBox';
    footer.style.display = 'none';

    const isLowQuality = localStorage.getItem('lq') === 'true';
    footer.innerHTML = `
      <a href="http://iogames.space" target="_blank" class="basic-text2" style="font-weight:bold;font-size:15px;">
        MORE IO GAMES
      </a>
      <font style="font-weight:bold;font-size:15px;"> • </font>
      <a href="javascript:toggleGraphics();" class="basic-text2" id="graphicsToggleLink" style="font-weight:bold;font-size:15px;">
        GRAPHICS: ${isLowQuality ? 'LOW' : 'HIGH'}
      </a>
    `;

    this.mainDialog.parentNode.appendChild(footer);

    const toggleLink = footer.querySelector('#graphicsToggleLink');
    toggleLink.addEventListener('click', () => {
      const currentSetting = localStorage.getItem('lq') === 'true';
      localStorage.setItem('lq', !currentSetting);
      setTimeout(() => {
        toggleLink.textContent = `GRAPHICS: ${!currentSetting ? 'LOW' : 'HIGH'}`;
      }, 50);
    });

    this.setupVisibilityObserver(footer);
  }

  setupVisibilityObserver(footer) {
    const updateVisibility = () => {
      const gameCanvas = document.querySelector(this.SELECTORS.GAME_CANVAS);
      const isInGame = gameCanvas && gameCanvas.style.display !== 'none';
      footer.style.display = isInGame ? 'none' : 'block';
    };

    this.observer = new MutationObserver(updateVisibility);
    this.observer.observe(this.mainDialog, {
      attributes: true,
      attributeFilter: ['style']
    });

    updateVisibility();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = this.CSS_STYLES;
    document.head.appendChild(style);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PowerlineUI;
} else {
  window.PowerlineUI = PowerlineUI;
}