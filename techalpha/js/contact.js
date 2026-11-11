// Contact form: data Supabase ke "messages" table me save hota hai
const f=document.getElementById('contactForm'),out=document.getElementById('formMsg');
f.addEventListener('submit',async e=>{
  e.preventDefault();const btn=f.querySelector('button');btn.disabled=true;out.textContent='Sending...';
  const d=Object.fromEntries(new FormData(f));
  const {error}=await db.from('messages').insert({name:d.name,email:d.email,phone:d.phone||null,message:d.message});
  btn.disabled=false;
  if(error){out.textContent='Sorry, message was not sent. Please try again or use WhatsApp.';console.error(error);return}
  out.textContent='Thank you! Your message has been received. We will reply within 24 hours.';f.reset();
});
