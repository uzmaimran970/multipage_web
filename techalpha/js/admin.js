// ===== Admin dashboard =====
const $=s=>document.querySelector(s);let courses=[];
function show(on){$('#login').hidden=on;$('#panel').hidden=!on;if(on){loadMsgs();loadCourses()}}
db.auth.getSession().then(({data})=>show(!!data.session));
$('#loginForm').onsubmit=async e=>{e.preventDefault();
  const {error}=await db.auth.signInWithPassword({email:$('#em').value,password:$('#pw').value});
  if(error)$('#loginErr').textContent=error.message;else show(true)};
$('#logout').onclick=async()=>{await db.auth.signOut();show(false)};
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.tab').forEach(t=>t.hidden=t.id!==b.dataset.tab);
  document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('btn-primary',x===b))});
// --- Messages (students ke forms) ---
async function loadMsgs(){
  const {data,error}=await db.from('messages').select('*').order('created_at',{ascending:false});
  if(error){$('#msgBody').innerHTML='<tr><td colspan="5">'+esc(error.message)+'</td></tr>';return}
  $('#newCount').textContent=data.filter(m=>m.status==='new').length;
  $('#msgBody').innerHTML=data.length?data.map(m=>`<tr class="${m.status}"><td>${new Date(m.created_at).toLocaleString()}</td>
  <td>${esc(m.name)}<br><small>${esc(m.email)}<br>${esc(m.phone||'')}</small></td><td>${esc(m.message)}</td><td>${m.status}</td>
  <td><button class="btn btn-ghost" data-m="${m.id}" data-s="${m.status==='new'?'read':'new'}">Mark ${m.status==='new'?'read':'new'}</button>
  <button class="btn btn-ghost" data-dm="${m.id}">Delete</button></td></tr>`).join(''):'<tr><td colspan="5">No messages yet.</td></tr>'}
$('#msgBody').onclick=async e=>{const b=e.target;
  if(b.dataset.m)await db.from('messages').update({status:b.dataset.s}).eq('id',b.dataset.m);
  else if(b.dataset.dm&&confirm('Delete this message?'))await db.from('messages').delete().eq('id',b.dataset.dm);
  else return;loadMsgs()};
// --- Courses (products) ---
async function loadCourses(){
  const {data}=await db.from('courses').select('*').order('created_at',{ascending:false});courses=data||[];
  $('#courseBody').innerHTML=courses.length?courses.map(c=>`<tr><td>${esc(c.title)}<br><small>${esc(c.category||'')}</small></td>
  <td>Rs ${Number(c.price).toLocaleString()}</td><td>${c.published?'Live':'Hidden'}</td>
  <td><button class="btn btn-ghost" data-e="${c.id}">Edit</button> <button class="btn btn-ghost" data-dc="${c.id}">Delete</button></td></tr>`).join(''):'<tr><td colspan="4">No courses yet. Add one above.</td></tr>'}
$('#courseBody').onclick=async e=>{const b=e.target;
  if(b.dataset.e){const c=courses.find(x=>x.id===b.dataset.e),f=$('#courseForm');
    f.id.value=c.id;f.title.value=c.title;f.category.value=c.category||'';f.price.value=c.price;
    f.image_url.value=c.image_url||'';f.description.value=c.description||'';f.published.checked=c.published;
    $('#preview').src=c.image_url||'';$('#preview').hidden=!c.image_url;
    $('#formTitle').textContent='Edit course';f.scrollIntoView()}
  else if(b.dataset.dc&&confirm('Delete this course?')){await db.from('courses').delete().eq('id',b.dataset.dc);loadCourses()}};
$('#courseForm').onsubmit=async e=>{e.preventDefault();const f=e.target,msg=$('#courseMsg');
  let url=f.image_url.value||null;
  const file=f.image_file.files[0];
  if(file){ // nayi image upload karo
    if(file.size>2*1024*1024){msg.textContent='Image must be under 2 MB.';return}
    const ext=file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g,'');
    const path=crypto.randomUUID()+'.'+ext;
    msg.textContent='Uploading image...';
    const {error:ue}=await db.storage.from('course-images').upload(path,file,{contentType:file.type});
    if(ue){msg.textContent=ue.message;return}
    url=db.storage.from('course-images').getPublicUrl(path).data.publicUrl;
  }
  const row={title:f.title.value,category:f.category.value||null,price:+f.price.value||0,image_url:url,description:f.description.value||null,published:f.published.checked};
  const q=f.id.value?db.from('courses').update(row).eq('id',f.id.value):db.from('courses').insert(row);
  const {error}=await q;msg.textContent=error?error.message:'Saved.';
  if(!error){f.reset();f.published.checked=true;f.id.value='';f.image_url.value='';$('#preview').hidden=true;
    $('#formTitle').textContent='Add course';loadCourses()}};
// Image chunte hi preview dikhao
$('#courseForm').image_file.onchange=e=>{const fl=e.target.files[0];
  if(fl){$('#preview').src=URL.createObjectURL(fl);$('#preview').hidden=false}};