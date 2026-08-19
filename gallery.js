const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

function escapeHtml(s='') { return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function mediaType(name='') { return /\.(mp4|webm|mov|m4v)$/i.test(name) ? 'video' : 'image'; }
function prettyName(name) { return name.replace(/^\d{4}-/, '').replace(/[-_]+/g,' ').replace(/\.[^.]+$/,'').trim(); }

async function loadGallery() {
  const host = document.getElementById('dynamicGallery');
  if (!host) return;
  host.innerHTML = '<p style="text-align:center;color:#e8c9b0">Loading memories…</p>';
  const { data, error } = await sb.storage.from('gallery').list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
  if (error) {
    host.innerHTML = '<p style="text-align:center;color:#ffd76a">Gallery is being prepared. Please try again shortly.</p>';
    console.error(error); return;
  }
  const files = (data || []).filter(x => x.name && x.name !== '.emptyFolderPlaceholder');
  if (!files.length) { host.innerHTML = '<p style="text-align:center;color:#e8c9b0">2026 memories will appear here after upload.</p>'; return; }
  host.innerHTML = files.map(file => {
    const { data: u } = sb.storage.from('gallery').getPublicUrl(file.name);
    const type = mediaType(file.name);
    const title = escapeHtml(prettyName(file.name));
    const media = type === 'video'
      ? `<video src="${u.publicUrl}" controls preload="metadata" playsinline></video>`
      : `<img src="${u.publicUrl}" alt="${title}" loading="lazy">`;
    return `<article class="photo-card dynamic-card"><div class="media-wrap">${media}</div><div class="caption"><span class="year">2026</span><h3>${title}</h3></div></article>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', loadGallery);
