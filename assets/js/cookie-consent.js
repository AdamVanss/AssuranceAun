/* Minimal cookie consent banner (demo). Replace with a full CMP for production. */
(function () {
  var STORAGE_KEY = 'cookieConsent';
  function hasDecision() { try { return !!localStorage.getItem(STORAGE_KEY); } catch (e) { return true; } }
  function saveDecision(val) { try { localStorage.setItem(STORAGE_KEY, val); } catch (e) {} }

  function renderBanner() {
    var div = document.createElement('div');
    div.className = 'cookie-banner';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-live', 'polite');
    div.innerHTML = '
      <div>
        <strong>Cookies</strong>
        <p class="mt-2 mb-0">Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience. Vous pouvez accepter, refuser ou personnaliser vos choix.</p>
        <div class="cookie-actions">
          <a class="btn ghost" href="/legal/cookies.html">Paramétrer</a>
          <button class="btn secondary" data-action="decline">Refuser</button>
          <button class="btn" data-action="accept">Accepter</button>
        </div>
      </div>';
    document.body.appendChild(div);
    div.addEventListener('click', function (e) {
      var t = e.target;
      if (!(t instanceof HTMLElement)) return;
      var action = t.getAttribute('data-action');
      if (action === 'accept') { saveDecision('accepted'); div.remove(); }
      if (action === 'decline') { saveDecision('declined'); div.remove(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { if (!hasDecision()) renderBanner(); });
  } else {
    if (!hasDecision()) renderBanner();
  }
})();


