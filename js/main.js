// main.js — nav, auth state, toast, shared utilities
(function () {
  'use strict';

  // ── Auth ─────────────────────────────────────
  let _user = null;

  function getUser() {
    if (_user) return _user;
    const raw = localStorage.getItem('steeg_user');
    if (raw) { try { _user = JSON.parse(raw); } catch {} }
    return _user;
  }

  function setUser(user, token) {
    _user = user;
    localStorage.setItem('steeg_user', JSON.stringify(user));
    if (token) localStorage.setItem('steeg_token', token);
  }

  function logout() {
    _user = null;
    localStorage.removeItem('steeg_user');
    localStorage.removeItem('steeg_token');
    window.location.href = 'index.html';
  }

  // ── Toast ─────────────────────────────────────
  function showToast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = 'toast toast-' + type;
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, 2500);
  }

  // ── Cart badge ────────────────────────────────
  function updateCartBadge() {
    const cart = CART.get();
    const count = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = count;
      b.style.display = count ? '' : 'none';
    });
  }

  // ── Nav render ────────────────────────────────
  function renderNav() {
    const user = getUser();
    const authLinks = document.getElementById('nav-auth');
    const adminLink = document.getElementById('nav-admin-link');
    if (!authLinks) return;

    if (user) {
      authLinks.innerHTML = `
        <span class="nav-user-name">${user.name}</span>
        <a href="/account.html" class="nav-link" data-i18n="nav_account"></a>
        <a href="#" class="nav-link" id="nav-logout-btn" data-i18n="nav_logout"></a>
      `;
      document.getElementById('nav-logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault(); logout();
      });
      if (adminLink) adminLink.style.display = user.role === 'admin' ? '' : 'none';
    } else {
      authLinks.innerHTML = `<a href="/login.html" class="nav-link" data-i18n="nav_login"></a>`;
      if (adminLink) adminLink.style.display = 'none';
    }
    applyLang();
    updateCartBadge();
  }

  // ── Mobile nav toggle ─────────────────────────
  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
    // Close on link click
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => menu.classList.remove('open'));
    });
  }

  // ── Lang toggle ───────────────────────────────
  function initLangToggle() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      setLang(getLang() === 'zh' ? 'en' : 'zh');
    });
  }

  // ── Scroll nav ────────────────────────────────
  function initScrollNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ── Init ─────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    initMobileNav();
    initLangToggle();
    initScrollNav();
    applyLang();
  });

  // Expose globally
  window.APP = { getUser, setUser, logout, showToast, updateCartBadge, renderNav };
})();
