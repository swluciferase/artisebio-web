// API helper
const API = (() => {
  const base = '/api';

  function token() { return localStorage.getItem('steeg_token'); }

  function headers(json = true) {
    const h = {};
    if (json) h['Content-Type'] = 'application/json';
    const t = token();
    if (t) h['Authorization'] = 'Bearer ' + t;
    return h;
  }

  async function req(method, path, body) {
    const opts = { method, headers: headers(body !== undefined) };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const r = await fetch(base + path, opts);
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || r.statusText);
    return data;
  }

  async function upload(path, formData) {
    const h = {};
    const t = token();
    if (t) h['Authorization'] = 'Bearer ' + t;
    const r = await fetch(base + path, { method: 'POST', headers: h, body: formData });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || r.statusText);
    return data;
  }

  return {
    get:    (path)        => req('GET', path),
    post:   (path, body)  => req('POST', path, body),
    put:    (path, body)  => req('PUT', path, body),
    del:    (path)        => req('DELETE', path),
    upload,
    token,
  };
})();
