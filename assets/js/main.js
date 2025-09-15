/* Main behaviors: smooth skip, form validation for Devis */
(function () {
  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn();
  }

  function initSkipLink() {
    const skip = document.querySelector('a[href="#contenu"]');
    if (!skip) return;
    skip.addEventListener('click', function (e) {
      const target = document.getElementById('contenu');
      if (target) { target.setAttribute('tabindex', '-1'); target.focus(); }
    });
  }

  function initDevisForm() {
    const form = document.getElementById('devis-form');
    if (!form) return;
    const requiredSelectors = 'input[required], select[required], textarea[required]';

    function setError(input, message) {
      let error = input.parentElement.querySelector('.field-error');
      if (!error) {
        error = document.createElement('div');
        error.className = 'field-error';
        input.parentElement.appendChild(error);
      }
      error.textContent = message;
      input.setAttribute('aria-invalid', 'true');
    }

    function clearError(input) {
      const error = input.parentElement.querySelector('.field-error');
      if (error) error.textContent = '';
      input.removeAttribute('aria-invalid');
    }

    function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
    }

    function validatePhone(value) {
      return /^(\+?\d[\d\s]{7,15})$/.test(String(value));
    }

    form.addEventListener('submit', function (e) {
      let valid = true;
      const inputs = form.querySelectorAll(requiredSelectors);
      inputs.forEach(function (input) {
        clearError(input);
        if (!input.value || (input.type === 'checkbox' && !input.checked)) {
          setError(input, 'Ce champ est requis.');
          valid = false;
          return;
        }
        if (input.name === 'email' && !validateEmail(input.value)) {
          setError(input, 'Veuillez saisir une adresse email valide.');
          valid = false;
        }
        if (input.name === 'telephone' && !validatePhone(input.value)) {
          setError(input, 'Veuillez saisir un numéro valide.');
          valid = false;
        }
        if (input.name === 'rgpd' && input.type === 'checkbox' && !input.checked) {
          setError(input, 'Veuillez accepter la politique de confidentialité.');
          valid = false;
        }
      });
      if (!valid) e.preventDefault();
      else {
        // For demo: prevent real submission
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }
        setTimeout(function () {
          if (btn) { btn.disabled = false; btn.textContent = 'Obtenir mon devis'; }
          alert('Merci ! Votre demande de devis a été reçue.');
          form.reset();
        }, 800);
      }
    });
  }

  onReady(function () {
    initSkipLink();
    initDevisForm();
    // Theme support (persist simple light theme; extendable to dark)
    try {
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    } catch (e) {}
  });
})();


