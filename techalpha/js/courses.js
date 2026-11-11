// Services page: published courses Supabase se load hote hain
(async()=>{
  const box=document.getElementById('courseList');if(!box)return;
  const {data,error}=await db.from('courses').select('*').eq('published',true).order('created_at',{ascending:false});
  if(error||!data.length){box.innerHTML='<p class="section-sub">New courses are coming soon.</p>';return}
  box.innerHTML=data.map(c=>`<div class="card">${c.image_url?`<img src="${esc(c.image_url)}" alt="${esc(c.title)}" style="border-radius:10px;margin-bottom:16px;aspect-ratio:16/9;object-fit:cover;width:100%">`:''}
  <h3>${esc(c.title)}</h3><p>${esc(c.category||'')}</p><p style="margin:8px 0">${esc(c.description||'')}</p>
  <b style="color:var(--cyan);font-size:1.2rem">Rs ${Number(c.price).toLocaleString()}</b>
  <p style="margin-top:14px"><a class="btn btn-ghost" href="contact.html">Enroll</a></p></div>`).join('');
})();
