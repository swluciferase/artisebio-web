// cart.js — Shopping cart logic
const CART = (() => {
  const KEY = 'steeg_cart';

  function get() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }

  function save(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    // Dispatch event so other parts of the page can react
    window.dispatchEvent(new Event('cart-updated'));
  }

  function add(item) {
    // item: { product_id, product_name, name_zh, name_en, price, currency, image_url }
    const cart = get();
    const existing = cart.find(i => i.product_id === item.product_id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    save(cart);
    return cart;
  }

  function remove(product_id) {
    save(get().filter(i => i.product_id !== product_id));
  }

  function setQty(product_id, qty) {
    const cart = get();
    const item = cart.find(i => i.product_id === product_id);
    if (item) {
      item.qty = Math.max(1, parseInt(qty) || 1);
      save(cart);
    }
  }

  function clear() { save([]); }

  function total() {
    return get().reduce((s, i) => s + (i.price || 0) * i.qty, 0);
  }

  function count() {
    return get().reduce((s, i) => s + i.qty, 0);
  }

  return { get, add, remove, setQty, clear, total, count };
})();

// Keep badge updated whenever cart changes
window.addEventListener('cart-updated', () => {
  if (window.APP) window.APP.updateCartBadge();
});
