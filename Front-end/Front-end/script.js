(function() {
  const listEl = document.getElementById('fileList');
  const statusEl = document.getElementById('status');
  const cpfInput = document.getElementById('cpfSearch');
  const dateFromInput = document.getElementById('dateFrom');
  const dateToInput = document.getElementById('dateTo');
  const sortOrderSelect = document.getElementById('sortOrder');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const pageInfoEl = document.getElementById('pageInfo');

  // Login elements (somente se existirem nesta página)
  const loginSection = document.getElementById('loginSection');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginFeedback = document.getElementById('loginFeedback');

  const FOLDER_PATH = '/excel/';

  // --- Autenticação (Token) ---
  const TOKEN_KEY = 'adminAuthToken';

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
  }

  function setToken(token) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch {}
  }

  function clearToken() {
    try { localStorage.removeItem(TOKEN_KEY); } catch {}
  }

  function isAuthenticated() {
    return !!getToken();
  }

  function updateLoginUI() {
    const logged = isAuthenticated();
    if (logoutBtn) logoutBtn.style.display = logged ? '' : 'none';
    if (loginBtn) loginBtn.style.display = logged ? 'none' : '';
    if (emailInput) emailInput.disabled = logged;
    if (passwordInput) passwordInput.disabled = logged;
    if (loginFeedback) loginFeedback.textContent = '';
  }

  async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = new Headers(options.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(url, { credentials: 'same-origin', redirect: 'follow', cache: 'no-store', ...options, headers });
  }

  function setStatus(message) {
    if (statusEl) statusEl.textContent = message;
  }

  function getFileExtension(filename) {
    const idx = filename.lastIndexOf('.');
    return idx >= 0 ? filename.slice(idx + 1).toLowerCase() : '';
  }

  function isExcelFile(filename) {
    const ext = getFileExtension(filename);
    return [
      'xls','xlsx','xlsm','xlsb','xltx','xltm','xlam','csv'
    ].includes(ext);
  }

  function extractCpfDigits(text) {
    const onlyDigits = (text || '').replace(/\D+/g, '');
    const match = onlyDigits.match(/(\d{11})/); // primeiro CPF encontrado
    return match ? match[1] : '';
  }

  function parseDateFromFilename(name) {
    function makeLocal(yyyy, MM, dd) {
      const y = Number(yyyy);
      const m = Number(MM) - 1;
      const d = Number(dd);
      return new Date(y, m, d); // data local sem deslocamento por fuso
    }
    // Tenta formatos comuns presentes no nome do arquivo
    // 1) YYYY-MM-DD[...]
    const m1 = name.match(/(?:^|\D)(20\d{2})[-_\.](\d{2})[-_\.](\d{2})(?:\D|$)/);
    if (m1) {
      const d = makeLocal(m1[1], m1[2], m1[3]);
      if (!isNaN(d)) return d;
    }
    // 2) DD-MM-YYYY
    const m2 = name.match(/(?:^|\D)(\d{2})[-_\.](\d{2})[-_\.](20\d{2})(?:\D|$)/);
    if (m2) {
      const d = makeLocal(m2[3], m2[2], m2[1]);
      if (!isNaN(d)) return d;
    }
    // 3) YYYYMMDD
    const m3 = name.match(/(?:^|\D)(20\d{2})(\d{2})(\d{2})(?:\D|$)/);
    if (m3) {
      const d = makeLocal(m3[1], m3[2], m3[3]);
      if (!isNaN(d)) return d;
    }
    // 4) ISO-like sem ':' (e.g., 2025-10-05T14-55-13-667Z)
    const m4 = name.match(/(?:^|\D)(20\d{2})[-_\.](\d{2})[-_\.](\d{2})[T _-]?(\d{2})?[-_\.]?(\d{2})?[-_\.]?(\d{2})?(?:\D|$)/);
    if (m4) {
      const yyyy = m4[1], MM = m4[2], dd = m4[3];
      const d = makeLocal(yyyy, MM, dd);
      if (!isNaN(d)) return d;
    }
    return null;
  }

  function getBasename(pathLike) {
    // normaliza e extrai apenas o último segmento (nome do arquivo)
    const decoded = (() => { try { return decodeURIComponent(pathLike); } catch { return pathLike; } })();
    const normalized = decoded.replace(/\\/g, '/');
    const parts = normalized.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : normalized;
  }

  function createItemNode(fileObj) {
    const filename = fileObj.name;
    const li = document.createElement('li');
    li.className = 'file-item';

    const nameWrap = document.createElement('div');
    nameWrap.className = 'file-name';
    const ext = document.createElement('span');
    ext.className = 'ext';
    const extValue = getFileExtension(filename) || 'FILE';
    ext.textContent = extValue.toUpperCase();
    const name = document.createElement('span');
    name.textContent = filename;
    nameWrap.appendChild(ext);
    nameWrap.appendChild(name);

    const meta = document.createElement('div');
    meta.style.color = 'var(--muted)';
    meta.style.fontSize = '12px';
    const dateStr = fileObj.date ? formatDateKeyLocal(fileObj.date) : 'sem data';
    const cpfStr = fileObj.cpf || 'sem CPF';
    meta.textContent = `Data: ${dateStr} • CPF: ${cpfStr}`;
    nameWrap.appendChild(meta);

    const link = document.createElement('a');
    link.className = 'download-btn';
    link.href = '#';
    link.textContent = 'Baixar';
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!isAuthenticated()) {
        setStatus('Faça login para baixar arquivos.');
        return;
      }
      try {
        setStatus('Baixando…');
        const url = '/excel/download/' + encodeURIComponent(filename);
        let res = await authFetch(url, {
          method: 'GET',
          headers: { 'Accept': 'application/octet-stream' }
        });
        // Se o servidor redirecionar e o navegador tiver removido o header, tenta novamente manualmente
        if (res.redirected) {
          res = await authFetch(res.url, {
            method: 'GET',
            headers: { 'Accept': 'application/octet-stream' }
          });
        }
        if (!res.ok) {
          setStatus('Falha no download (verifique seu login).');
          return;
        }
        const blob = await res.blob();
        const urlDownload = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlDownload;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(urlDownload);
        setStatus('Download concluído.');
      } catch (err) {
        setStatus('Erro no download.');
      }
    });

    li.appendChild(nameWrap);
    li.appendChild(link);
    return li;
  }

  async function tryFetchIndex() {
    // Tenta obter um índice simples (servidor com autoindex) e extrair links
    try {
      const res = await authFetch(FOLDER_PATH, { method: 'GET' });
      if (!res.ok) return null;
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const anchors = Array.from(doc.querySelectorAll('a'))
        .map(a => decodeURIComponent(a.getAttribute('href') || ''))
        .filter(href => !!href && !href.startsWith('?'));
      return anchors;
    } catch (e) {
      return null;
    }
  }

  async function tryFetchManifest() {
    // Caso exista um arquivo manifest.json dentro da pasta compartilhada
    try {
      const res = await authFetch(FOLDER_PATH + 'manifest.json', { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      if (!Array.isArray(data)) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  async function loadFiles() {
    if (!isAuthenticated()) {
      window.location.href = './login.html';
      return;
    }
    setStatus('Carregando lista…');
    let entries = await tryFetchManifest();
    if (!entries) entries = await tryFetchIndex();

    if (!entries || entries.length === 0) {
      setStatus('Não foi possível listar automaticamente. Use "Abrir pasta".');
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Dica: Coloque um manifest.json com ["arquivo1.xlsx", ...] em "Documentos Excel" para listar aqui.';
      listEl.appendChild(empty);
      return;
    }

    // Filtra possíveis caminhos e mantém apenas arquivos Excel
    const files = entries
      .map(item => getBasename(item))
      .filter(item => item && !item.endsWith('/') && isExcelFile(item));

    if (files.length === 0) {
      setStatus('Nenhum arquivo Excel encontrado.');
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Coloque arquivos .xlsx, .xls ou .csv em "Documentos Excel".';
      listEl.appendChild(empty);
      return;
    }

    // Constrói modelo enriquecido
    state.all = files.map(name => ({
      name,
      href: FOLDER_PATH + encodeURIComponent(name),
      cpf: extractCpfDigits(name),
      date: parseDateFromFilename(name)
    }));

    applyAndRender();
  }

  function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    return d;
  }

  function endOfDay(date) {
    const d = new Date(date);
    d.setHours(23,59,59,999);
    return d;
  }

  function getInputDate(el, end = false) {
    if (!el) return null;
    if (el.valueAsDate) {
      const d = new Date(el.valueAsDate);
      return end ? endOfDay(d) : startOfDay(d);
    }
    const v = (el.value || '').trim();
    if (!v) return null;
    // aceita yyyy-mm-dd ou dd/mm/yyyy
    const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      const d = new Date(`${iso[1]}-${iso[2]}-${iso[3]}`);
      return end ? endOfDay(d) : startOfDay(d);
    }
    const br = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) {
      const d = new Date(`${br[3]}-${br[2]}-${br[1]}`);
      return end ? endOfDay(d) : startOfDay(d);
    }
    const d = new Date(v);
    return isNaN(d) ? null : (end ? endOfDay(d) : startOfDay(d));
  }

  function formatDateKeyLocal(date) {
    const d = startOfDay(date);
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }

  function compareByDate(a, b, order) {
    const va = a.date ? a.date.getTime() : -Infinity;
    const vb = b.date ? b.date.getTime() : -Infinity;
    return order === 'asc' ? va - vb : vb - va;
  }

  function applyAndRender() {
    const cpfQuery = (cpfInput ? cpfInput.value : '').replace(/\D+/g, '');
    const sortOrder = (sortOrderSelect && (sortOrderSelect.value === 'asc' || sortOrderSelect.value === 'desc')) ? sortOrderSelect.value : 'desc';
    const fromValue = getInputDate(dateFromInput, false);
    const toValue = getInputDate(dateToInput, true);

    let filtered = state.all.slice();

    if (cpfQuery) {
      filtered = filtered.filter(f => (f.cpf || '').includes(cpfQuery));
    }

    if (fromValue) {
      filtered = filtered.filter(f => f.date && startOfDay(f.date) >= fromValue);
    }
    if (toValue) {
      filtered = filtered.filter(f => f.date && startOfDay(f.date) <= toValue);
    }

    filtered.sort((a, b) => compareByDate(a, b, sortOrder));

    // Agrupa por dia (YYYY-MM-DD)
    const groups = new Map();
    for (const f of filtered) {
      const key = f.date ? formatDateKeyLocal(f.date) : 'sem-data';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(f);
    }

    // Paginação por blocos de 5 dias
    const days = Array.from(groups.keys()).sort((a,b) => sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
    state.pagination.totalPages = Math.max(1, Math.ceil(days.length / state.pagination.daysPerPage));
    if (state.pagination.page > state.pagination.totalPages) state.pagination.page = state.pagination.totalPages;
    const startIdx = (state.pagination.page - 1) * state.pagination.daysPerPage;
    const endIdx = startIdx + state.pagination.daysPerPage;
    const pageDays = days.slice(startIdx, endIdx);

    listEl.innerHTML = '';
    if (pageDays.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Nenhum arquivo corresponde aos filtros.';
      listEl.appendChild(empty);
      setStatus('0 arquivo(s) encontrado(s) com os filtros.');
    } else {
      let totalOnPage = 0;
      for (const day of pageDays) {
        const header = document.createElement('li');
        header.className = 'file-item';
        header.style.borderTop = '1px solid var(--border)';
        header.style.marginTop = '8px';
        header.style.fontWeight = '600';
        header.textContent = day === 'sem-data' ? 'Sem data' : day;
        listEl.appendChild(header);
        const items = groups.get(day);
        items.forEach(it => listEl.appendChild(createItemNode(it)));
        totalOnPage += items.length;
      }
      setStatus(`${filtered.length} arquivo(s) encontrado(s). Exibindo ${totalOnPage} no período desta página.`);
    }

    // Atualiza controles de paginação
    if (pageInfoEl) pageInfoEl.textContent = `Página ${state.pagination.page} de ${state.pagination.totalPages}`;
    if (prevPageBtn) prevPageBtn.disabled = state.pagination.page <= 1;
    if (nextPageBtn) nextPageBtn.disabled = state.pagination.page >= state.pagination.totalPages;
  }

  const state = { all: [] };

  document.addEventListener('DOMContentLoaded', () => {
    updateLoginUI();
    if (!isAuthenticated()) {
      window.location.href = './login.html';
      return;
    }
    loadFiles();
    if (cpfInput) cpfInput.addEventListener('input', applyAndRender);
    if (dateFromInput) dateFromInput.addEventListener('change', applyAndRender);
    if (dateToInput) dateToInput.addEventListener('change', applyAndRender);
    if (sortOrderSelect) sortOrderSelect.addEventListener('change', applyAndRender);
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => { state.pagination.page = Math.max(1, state.pagination.page - 1); applyAndRender(); });
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => { state.pagination.page = Math.min(state.pagination.totalPages, state.pagination.page + 1); applyAndRender(); });

    // Nesta página não há botão de login; o acesso é redirecionado para login.html

    if (logoutBtn) logoutBtn.addEventListener('click', () => {
      clearToken();
      window.location.href = './login.html';
    });
  });

  state.pagination = { page: 1, totalPages: 1, daysPerPage: 5 };
})();


