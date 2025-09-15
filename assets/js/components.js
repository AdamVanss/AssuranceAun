/* Inject shared header and footer across pages */
(function () {
  function createHeader() {
    const navLinks = [
      { href: "/", label: "Accueil" },
      { href: "/produits/", label: "Produits", mega: true },
      { href: "/devis/", label: "Devis" },
      { href: "/sinistres/", label: "Sinistres" },
      { href: "/a-propos.html", label: "À propos" },
      { href: "/faq.html", label: "FAQ" },
      { href: "/contact.html", label: "Contact" }
    ];

    const path = window.location.pathname.toLowerCase();
    function isActive(href) {
      if (href === "/" && (path === "/" || path.endsWith("/index.html"))) return true;
      return path.startsWith(href) && href !== "/";
    }

    return `
      <div class="container site-nav">
        <a class="branding" href="/">
          <img src="/assets/img/logo.svg" alt="Logo Assurance" width="32" height="32" />
          <strong>Assurance</strong>
        </a>
        <button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir le menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <nav id="primary-nav" class="nav-links" aria-label="Navigation principale">
          ${navLinks.map(l => l.mega ? `<a href="${l.href}" data-has-mega="true" ${isActive(l.href) ? 'aria-current="page"' : ''}>${l.label}</a>` : `<a href="${l.href}" ${isActive(l.href) ? 'aria-current="page"' : ''}>${l.label}</a>`).join(" ")}
        </nav>
        <div class="nav-cta">
          <a class="btn" href="/devis/">Obtenir un devis</a>
          <a class="btn secondary" href="/espace-client.html" aria-label="Espace client">Espace client</a>
        </div>
      </div>`;
  }

  function createFooter() {
    return `
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="branding">
              <img src="/assets/img/logo.svg" alt="Logo Assurance" width="28" height="28" />
              <strong>Assurance</strong>
            </div>
            <p class="mt-4 text-muted">L'assurance simple et claire pour protéger l'essentiel.</p>
          </div>
          <div>
            <h4>Produits</h4>
            <ul>
              <li><a href="/produits/">Vue d'ensemble</a></li>
              <li><a href="/produits/auto.html">Auto</a></li>
              <li><a href="/produits/habitation.html">Habitation</a></li>
              <li><a href="/produits/sante.html">Santé</a></li>
              <li><a href="/produits/vie.html">Vie</a></li>
              <li><a href="/produits/voyage.html">Voyage</a></li>
              <li><a href="/produits/pro.html">Professionnels</a></li>
            </ul>
          </div>
          <div>
            <h4>Compagnie</h4>
            <ul>
              <li><a href="/a-propos.html">À propos</a></li>
              <li><a href="/conseils/">Conseils & Guides</a></li>
              <li><a href="/contact.html">Contact</a></li>
              <li><a href="/assistance.html">Assistance 24/7</a></li>
            </ul>
          </div>
          <div>
            <h4>Légal</h4>
            <ul>
              <li><a href="/legal/mentions-legales.html">Mentions légales</a></li>
              <li><a href="/legal/cgu.html">Conditions d'utilisation</a></li>
              <li><a href="/legal/politique-confidentialite.html">Politique de confidentialité</a></li>
              <li><a href="/legal/cookies.html">Cookies</a></li>
              <li><a href="/legal/reclamations.html">Réclamations & Médiation</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <small>© <span id="year"></span> Assurance. Tous droits réservés.</small>
          <small>RCS – Capital social – ORIAS (si courtier).</small>
        </div>
      </div>`;
  }

  function init() {
    const headerEl = document.getElementById("site-header");
    if (headerEl) {
      headerEl.classList.add("site-header");
      headerEl.innerHTML = createHeader();
      const toggle = headerEl.querySelector('#menu-toggle');
      if (toggle) {
        toggle.addEventListener('click', function(){
          const isOpen = document.body.getAttribute('data-nav-open') === 'true';
          document.body.setAttribute('data-nav-open', String(!isOpen));
          toggle.setAttribute('aria-expanded', String(!isOpen));
        });
      }
      // Close mobile nav when clicking backdrop or nav links
      document.addEventListener('click', function(e){
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.classList.contains('nav-backdrop') || target.closest('#primary-nav a')) {
          document.body.setAttribute('data-nav-open', 'false');
          const t = headerEl.querySelector('#menu-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      // Close on resize to desktop
      window.addEventListener('resize', function(){
        if (window.innerWidth >= 900) {
          document.body.setAttribute('data-nav-open', 'false');
          const t = headerEl.querySelector('#menu-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      let lastY = window.scrollY;
      function onScroll(){
        const scrolled = window.scrollY > 8;
        headerEl.classList.toggle('is-scrolled', scrolled);
        lastY = window.scrollY;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    const footerEl = document.getElementById("site-footer");
    if (footerEl) {
      footerEl.classList.add("site-footer");
      footerEl.innerHTML = createFooter();
      const yearEl = footerEl.querySelector('#year');
      if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    }

    // Mobile overlay backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    // Mega menu (desktop)
    const nav = document.getElementById('primary-nav');
    if (nav) {
      const produitsLink = nav.querySelector('a[data-has-mega="true"]');
      if (produitsLink) {
        const panel = document.createElement('div');
        panel.className = 'mega-panel';
        panel.setAttribute('role', 'dialog');
        panel.innerHTML = `
          <div class="mega-grid">
            <a class="mega-item" href="/produits/auto.html">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13l2-5a2 2 0 0 1 2-1h8a2 2 0 0 1 2 1l2 5"/><rect x="3" y="13" width="18" height="6" rx="2"/><path d="M6 19v2M18 19v2"/></svg>
              <div><h5>Auto</h5><p>Du tiers au tous risques.</p></div>
            </a>
            <a class="mega-item" href="/produits/habitation.html">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>
              <div><h5>Habitation</h5><p>Appartement, maison, coloc.</p></div>
            </a>
            <a class="mega-item" href="/produits/sante.html">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21C12 21 4 13 4 8a8 8 0 1 1 16 0c0 5-8 13-8 13z"/></svg>
              <div><h5>Santé</h5><p>Mutuelle pour tous les profils.</p></div>
            </a>
            <a class="mega-item" href="/produits/vie.html">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              <div><h5>Vie</h5><p>Protéger vos proches.</p></div>
            </a>
            <a class="mega-item" href="/produits/voyage.html">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 21l-2-4H5l3-7 4 3 7-3-3 7h-3l-2 4z"/></svg>
              <div><h5>Voyage</h5><p>Annulation, santé, bagages.</p></div>
            </a>
            <a class="mega-item" href="/produits/pro.html">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10"/></svg>
              <div><h5>Professionnels</h5><p>RC Pro, multirisque.</p></div>
            </a>
          </div>`;
        headerEl.appendChild(panel);

        let megaOpen = false; let megaTimer;
        function openMega(){ if (window.innerWidth < 900) return; megaOpen = true; panel.classList.add('is-open'); }
        function closeMega(){ megaOpen = false; panel.classList.remove('is-open'); }
        produitsLink.addEventListener('mouseenter', openMega);
        produitsLink.addEventListener('focus', openMega);
        headerEl.addEventListener('mouseleave', closeMega);
        window.addEventListener('scroll', closeMega, { passive: true });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


