const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
function esc(s=''){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function isVideo(n=''){return /\.(mp4|webm|mov|m4v)$/i.test(n)}
function titleFrom(n=''){return n.replace(/^\d{13}-/,'').replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').trim()||'Festival Memory'}
async function publicUrl(path){return sb.storage.from('gallery').getPublicUrl(path).data.publicUrl}
async function listFolder(year){
  const {data,error}=await sb.storage.from('gallery').list(year,{limit:200,sortBy:{column:'created_at',order:'desc'}})
  return error?[]:(data||[]).filter(x=>x.name && !x.name.startsWith('.'))
}
async function loadGallery(){
 const host=document.getElementById('dynamicGallery'); if(!host)return;
 host.innerHTML='<p style="text-align:center;color:#e8c9b0">Loading memories…</p>';
 const years=['2026','2025','2024']; const groups={};
 for(const y of years) groups[y]=await listFolder(y);
 // Compatibility: also show older flat files named 2024-/2025-/2026-
 const {data:root}=await sb.storage.from('gallery').list('',{limit:200,sortBy:{column:'created_at',order:'desc'}});
 for(const f of (root||[])){
   if(!f.name || f.name.startsWith('hero/') || f.name==='.emptyFolderPlaceholder') continue;
   const m=f.name.match(/^(2024|2025|2026)-/); if(m) groups[m[1]].push({...f,__flat:true});
 }
 const sections=[];
 for(const y of years){
   const files=groups[y]; if(!files.length) continue;
   const cards=await Promise.all(files.map(async f=>{
     const path=f.__flat?f.name:`${y}/${f.name}`; const url=await publicUrl(path); const t=esc(titleFrom(f.name));
     const media=isVideo(f.name)?`<video src="${url}" controls preload="metadata" playsinline></video>`:`<img src="${url}" alt="${t}" loading="lazy">`;
     return `<article class="photo-card dynamic-card"><div class="media-wrap">${media}</div><div class="caption"><span class="year">${y}</span><h3>${t}</h3></div></article>`;
   }));
   sections.push(`<div class="year-block"><div class="year-heading"><span>${y}</span><i></i><small>${files.length} memories</small></div><div class="gallery">${cards.join('')}</div></div>`);
 }
 host.innerHTML=sections.join('')||'<p style="text-align:center;color:#e8c9b0">Memories will appear here after the admin uploads them.</p>';
}
document.addEventListener('DOMContentLoaded',loadGallery);