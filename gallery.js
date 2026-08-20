const sb=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
const MEDIA=/\.(jpg|jpeg|png|webp|gif|avif|mp4|webm|mov|m4v)$/i;
const VIDEO=/\.(mp4|webm|mov|m4v)$/i;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function niceName(n){return n.replace(/^\d+-/,'').replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').trim()||'Festival Memory';}
async function loadYear(y){
 const r=await sb.storage.from('gallery').list(y,{limit:200,sortBy:{column:'created_at',order:'desc'}});
 if(r.error)return [];
 return (r.data||[]).filter(f=>f.name&&!f.name.startsWith('.')&&MEDIA.test(f.name));
}
async function loadGallery(){
 const host=document.getElementById('dynamicGallery');if(!host)return;
 host.innerHTML='<p style="text-align:center;color:#e8c9b0">Loading memories…</p>';
 const years=['2026','2025','2024'];let html='';
 for(const y of years){
  const files=await loadYear(y);if(!files.length)continue;
  let cards='';
  for(const f of files){
   const path=`${y}/${f.name}`;const url=sb.storage.from('gallery').getPublicUrl(path).data.publicUrl;const title=esc(niceName(f.name));
   const media=VIDEO.test(f.name)?`<video src="${url}" controls preload="metadata" playsinline></video>`:`<img src="${url}" alt="${title}" loading="lazy">`;
   cards+=`<article class="photo-card dynamic-card"><div class="media-wrap">${media}</div><div class="caption"><span class="year">${y}</span><h3>${title}</h3></div></article>`;
  }
  html+=`<section class="year-block"><div class="year-heading"><strong>${y}</strong><i></i><small>${files.length} ${files.length===1?'memory':'memories'}</small></div><div class="gallery">${cards}</div></section>`;
 }
 host.innerHTML=html||'<p style="text-align:center;color:#e8c9b0">No gallery photos uploaded yet.</p>';
}
document.addEventListener('DOMContentLoaded',loadGallery);