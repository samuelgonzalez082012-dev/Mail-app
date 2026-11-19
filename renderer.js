
/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IC={
 menu:'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
 archive:'M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z',
 trash:'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
 star:'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
 starOn:'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
 mail:'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
 back:'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
 reply:'M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z',
 fwd:'M12 8V4l8 8-8 8v-4H4V8z',
 spam:'M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z',
 refresh:'M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
 edit:'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
 close:'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
 attach:'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',
 send:'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z'
};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24"><path d="${IC[n]}"/></svg>`;
function toast(msg,undo){
 const t=$('#toast');$('#toasttxt').textContent=msg;
 const u=$('#toastundo');u.style.display=undo?'':'none';u.onclick=()=>{t.style.display='none';undo&&undo()};
 t.style.display='flex';clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display='none',6000);
}
function busy(on){const l=$('#loading');l.style.width=on?'70%':'100%';if(!on)setTimeout(()=>l.style.width='0',300)}
function parseAddr(s){
 s=s||'';const m=s.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
 if(m)return{name:m[1].trim()||m[2].split('@')[0],email:m[2].trim()};
 return{name:s.split('@')[0]||s,email:s.trim()};
}
function splitAddrs(s){return(s||'').match(/(?:"[^"]*"|[^,])+/g)?.map(x=>x.trim()).filter(Boolean)||[]}
function fmtDate(ms,full){
 const d=new Date(ms),n=new Date();
 if(full)return d.toLocaleString([],{weekday:'short',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
 if(d.toDateString()===n.toDateString())return d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
 if(d.getFullYear()===n.getFullYear())return d.toLocaleDateString([],{month:'short',day:'numeric'});
 return d.toLocaleDateString([],{year:'numeric',month:'short',day:'numeric'});
}
function fmtChat(ms){
 const d=new Date(ms),n=new Date(),y=new Date(Date.now()-864e5);
 const t=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
 if(d.toDateString()===n.toDateString())return 'Today at '+t;
 if(d.toDateString()===y.toDateString())return 'Yesterday at '+t;
 return d.toLocaleDateString()+' '+t;
}
function b64uToBytes(s){
 s=s.replace(/-/g,'+').replace(/_/g,'/');const b=atob(s),a=new Uint8Array(b.length);
 for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;
}
function decodePart(part){
 const bytes=b64uToBytes(part.body.data);
 const ct=(part.headers||[]).find(h=>h.name.toLowerCase()==='content-type')?.value||'';
 const cs=(ct.match(/charset="?([^";\s]+)/i)||[])[1]||'utf-8';
 try{return new TextDecoder(cs).decode(bytes)}catch{return new TextDecoder('utf-8').decode(bytes)}
}
function bytesToB64(bytes){let s='';for(let i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000));return btoa(s)}
const toB64Url=str=>bytesToB64(new TextEncoder().encode(str)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const wrap76=s=>s.replace(/.{1,76}/g,'$&\r\n').trim();
function findPart(p,mime){
 if(p.mimeType===mime&&p.body&&p.body.data)return p;
 for(const c of p.parts||[]){const r=findPart(c,mime);if(r)return r}
 return null;
}
function findAtts(p,out=[]){
 if(p.filename&&p.body&&p.body.attachmentId)out.push(p);
 (p.parts||[]).forEach(c=>findAtts(c,out));return out;
}
function hdr(m,n){return(m.payload.headers.find(h=>h.name.toLowerCase()===n)||{}).value||''}
function msgText(m){
 const t=findPart(m.payload,'text/plain');if(t)return decodePart(t);
 const h=findPart(m.payload,'text/html');
 if(h)return new DOMParser().parseFromString(decodePart(h),'text/html').body.textContent;
 return '';
}

/* ---------- state & auth ---------- */
const SCOPE='https://www.googleapis.com/auth/gmail.modify';
const API='https://gmail.googleapis.com/gmail/v1/users/me/';
const S={label:'INBOX',q:'',tokens:[''],page:0,next:null,rows:[],openId:null,thread:null,replyTo:null,labels:[],me:'',req:0};
let CID=localStorage.getItem('bbm_cid')||'';
let tok=null,tokExp=0,tc=null,pending=null,stickUntil=0;

function show(id){['setup','signin'].forEach(x=>$('#'+x).style.display=x===id?'flex':'none');$('#app').style.display=id==='app'?'grid':'none'}
function initAuth(){
 tc=google.accounts.oauth2.initTokenClient({client_id:CID,scope:SCOPE,
  callback:r=>{
   if(r.error){pending&&pending.rej(r);pending=null;return}
   tok=r.access_token;tokExp=Date.now()+(r.expires_in-60)*1000;
   pending&&pending.res(tok);pending=null;
  },
  error_callback:e=>{pending&&pending.rej(e);pending=null}});
}
function requestToken(prompt){
 if(pending)return pending.p;
 let res,rej;const p=new Promise((a,b)=>{res=a;rej=b});
 pending={p,res,rej};tc.requestAccessToken({prompt});return p;
}
async function token(){if(tok&&Date.now()<tokExp)return tok;return requestToken('')}
async function api(path,opt={}){
 for(let i=0;i<2;i++){
  const t=await token();
  const r=await fetch(API+path,{method:opt.method||'GET',
   headers:{Authorization:'Bearer '+t,...(opt.body?{'Content-Type':'application/json'}:{})},
   body:opt.body?JSON.stringify(opt.body):undefined});
  if(r.status===401&&i===0){tok=null;continue}
  if(!r.ok){let m=r.statusText;try{m=(await r.json()).error.message}catch{}throw new Error(m)}
  return r.status===204?null:r.json();
 }
}

/* ---------- boot ---------- */
function loadGsi(){
 return new Promise((res,rej)=>{
  if(window.google&&google.accounts)return res();
  const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';
  s.onload=res;s.onerror=()=>rej(new Error('Could not load Google sign-in (offline?)'));document.head.appendChild(s);
 });
}
async function boot(){
 $('#origin').textContent=location.origin;
 $('#menubtn').innerHTML=ic('menu');
 $('#composebtn').innerHTML=ic('edit')+' Compose';
 $('#cclose').innerHTML=ic('close');
 $('#refresh').innerHTML=ic('refresh');
 $('#chatsend').innerHTML=ic('send');
 $('#chatfull').innerHTML=ic('edit');
 if(!CID){show('setup');return}
 show('signin');
 try{await loadGsi();initAuth()}catch(e){$('#signinerr').textContent=e.message;return}
 if(localStorage.getItem('bbm_signed')==='1'){try{await requestToken('none');await startApp()}catch{show('signin')}}
}
$('#savecid').onclick=()=>{
 const v=$('#cid').value.trim();if(!v)return;
 CID=v;localStorage.setItem('bbm_cid',v);boot();
};
$('#changecid').onclick=e=>{e.preventDefault();$('#cid').value=CID;show('setup')};
$('#signinbtn').onclick=async()=>{
 $('#signinerr').textContent='';
 try{await requestToken('select_account');localStorage.setItem('bbm_signed','1');await startApp()}
 catch(e){$('#signinerr').textContent='Sign-in failed: '+(e.error||e.type||e.message||'cancelled')}
};
$('#signout').onclick=()=>{
 if(tok)google.accounts.oauth2.revoke(tok,()=>{});
 tok=null;localStorage.removeItem('bbm_signed');S.rows=[];closeReader();show('signin');
};
async function startApp(){
 const p=await api('profile');S.me=p.emailAddress;
 $('#email').textContent=S.me;$('#avatar').textContent=S.me[0].toUpperCase();
 show('app');loadLabels();loadList();
}

/* ---------- labels ---------- */
const SYS=[['INBOX','Inbox'],['STARRED','Starred'],['SENT','Sent'],['DRAFT','Drafts'],['ALL','All Mail'],['SPAM','Spam'],['TRASH','Trash']];
let lblTimer;
function loadLabelsSoon(){clearTimeout(lblTimer);lblTimer=setTimeout(loadLabels,800)}
async function loadLabels(){
 try{
  const {labels}=await api('labels');
  const user=labels.filter(l=>l.type==='user').sort((a,b)=>a.name.localeCompare(b.name)).slice(0,40);
  const need=['INBOX','SPAM',...user.map(l=>l.id)];
  const det=await Promise.all(need.map(id=>api('labels/'+encodeURIComponent(id)).catch(()=>null)));
  const unread={};det.forEach(d=>{if(d)unread[d.id]=d.threadsUnread});
  S.labels=[...SYS.map(([id,name])=>({id,name,n:unread[id]})),{h:'Labels'},...user.map(l=>({id:l.id,name:l.name,n:unread[l.id]}))];
  if(!user.length)S.labels.pop();
  renderLabels();
 }catch(e){console.warn(e)}
}
function renderLabels(){
 $('#labels').innerHTML=S.labels.map(l=>l.h?`<div class="lbl-h">${l.h}</div>`:
  `<div class="lbl ${!S.q&&S.label===l.id?'active':''}" data-id="${esc(l.id)}"><span>${esc(l.name)}</span><small>${l.n?l.n:''}</small></div>`).join('');
 document.title=(S.labels[0]&&S.labels[0].n?`(${S.labels[0].n}) `:'')+'Bare Bones Mail';
}
$('#labels').onclick=e=>{
 const el=e.target.closest('.lbl');if(!el)return;
 S.label=el.dataset.id;S.q='';$('#search').value='';S.tokens=[''];S.page=0;
 $('#app').classList.remove('menu','reading');closeReader();renderLabels();loadList();
};
$('#menubtn').onclick=()=>$('#app').classList.toggle('menu');

/* ---------- list ---------- */
async function loadList(){
 const my=++S.req;busy(true);
 $('#list').innerHTML='<div class="empty">Loading…</div>';
 try{
  const p=new URLSearchParams({maxResults:'25'});
  if(S.q)p.set('q',S.q);
  else if(S.label!=='ALL')p.append('labelIds',S.label);
  if(S.label==='TRASH'||S.label==='SPAM')p.set('includeSpamTrash','true');
  if(S.q)p.set('includeSpamTrash','true');
  const pt=S.tokens[S.page];if(pt)p.set('pageToken',pt);
  const res=await api('threads?'+p);
  const ids=res.threads||[];
  const ths=await Promise.all(ids.map(t=>api(`threads/${t.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`)));
  if(my!==S.req)return;
  S.next=res.nextPageToken||null;
  S.rows=ths.map(t=>{
   const ms=t.messages,last=ms[ms.length-1],first=ms[0];
   const outbound=S.label==='SENT'||S.label==='DRAFT';
   const seen=[];ms.forEach(m=>{const a=parseAddr(hdr(m,outbound?'to':'from'));if(!seen.includes(a.name))seen.push(a.name)});
   let names=seen.slice(-3).join(', ');if(ms.length>1)names+=` (${ms.length})`;
   if(S.label==='DRAFT')names='Draft: '+names;
   return{id:t.id,names,subject:hdr(first,'subject')||'(no subject)',snippet:last.snippet,date:+last.internalDate,
    unread:ms.some(m=>m.labelIds?.includes('UNREAD')),starred:ms.some(m=>m.labelIds?.includes('STARRED'))};
  });
  renderList();
 }catch(e){
  if(my===S.req)$('#list').innerHTML=`<div class="empty err">${esc(e.message||e.type||'Error')}</div>`;
 }finally{busy(false)}
}
function renderList(){
 $('#list').innerHTML=S.rows.length?S.rows.map(r=>`
  <div class="row ${r.unread?'unread':''} ${r.id===S.openId?'open':''}" data-id="${r.id}">
   <button class="star ${r.starred?'on':''}" data-act="star" title="Star">${ic(r.starred?'starOn':'star')}</button>
   <div class="from">${esc(r.names)}</div><div class="date">${fmtDate(r.date)}</div>
   <div class="sub"><b>${esc(r.subject)}</b> — ${esc(r.snippet)}</div>
   <div class="rowact">
    <button class="iconbtn" data-act="archive" title="Archive">${ic('archive')}</button>
    <button class="iconbtn" data-act="trash" title="Delete">${ic('trash')}</button>
    <button class="iconbtn" data-act="unread" title="Mark read/unread">${ic('mail')}</button>
   </div>
  </div>`).join(''):'<div class="empty">Nothing here.</div>';
 $('#older').disabled=!S.next;$('#newer').disabled=S.page===0;
 $('#range').textContent=S.rows.length?`Page ${S.page+1}`:'';
}
$('#list').onclick=e=>{
 const row=e.target.closest('.row');if(!row)return;
 const btn=e.target.closest('[data-act]');
 if(btn){e.stopPropagation();act(row.dataset.id,btn.dataset.act);return}
 openThread(row.dataset.id);
};
$('#older').onclick=()=>{if(!S.next)return;S.tokens[S.page+1]=S.next;S.page++;loadList()};
$('#newer').onclick=()=>{if(S.page>0){S.page--;loadList()}};
$('#refresh').onclick=()=>{loadList();loadLabels()};
$('#search').onkeydown=e=>{
 if(e.key==='Enter'){S.q=e.target.value.trim();S.tokens=[''];S.page=0;closeReader();renderLabels();loadList()}
 if(e.key==='Escape')e.target.blur();
};

/* ---------- actions ---------- */
const modify=(id,add,rem)=>api(`threads/${id}/modify`,{method:'POST',body:{addLabelIds:add,removeLabelIds:rem}});
function dropRow(id){
 S.rows=S.rows.filter(r=>r.id!==id);renderList();
 if(S.openId===id)closeReader();
 if(!S.rows.length&&S.next)loadList();
}
async function act(id,kind){
 const row=S.rows.find(r=>r.id===id);
 try{
  if(kind==='star'){
   const on=!(row&&row.starred);
   await modify(id,on?['STARRED']:[],on?[]:['STARRED']);
   if(row){row.starred=on;renderList()}
   if(S.openId===id)renderToolbar();
  }else if(kind==='unread'){
   const mk=!(row&&row.unread);
   await modify(id,mk?['UNREAD']:[],mk?[]:['UNREAD']);
   if(row){row.unread=mk;renderList()}
   if(mk&&S.openId===id)closeReader();
   loadLabelsSoon();
  }else if(kind==='archive'){
   await modify(id,[],['INBOX']);
   if(S.label==='INBOX'&&!S.q)dropRow(id);else if(S.openId===id)closeReader();
   toast('Conversation archived',async()=>{await modify(id,['INBOX'],[]);loadList();loadLabelsSoon()});
   loadLabelsSoon();
  }else if(kind==='trash'){
   if(S.label==='TRASH'&&!S.q){await api(`threads/${id}/untrash`,{method:'POST'});dropRow(id);toast('Moved to Inbox')}
   else{
    await api(`threads/${id}/trash`,{method:'POST'});
    dropRow(id);toast('Moved to Trash',async()=>{await api(`threads/${id}/untrash`,{method:'POST'});loadList();loadLabelsSoon()});
   }
   loadLabelsSoon();
  }else if(kind==='spam'){
   await modify(id,['SPAM'],['INBOX']);dropRow(id);
   toast('Reported as spam',async()=>{await modify(id,['INBOX'],['SPAM']);loadList()});loadLabelsSoon();
  }
 }catch(e){toast('Failed: '+e.message)}
}

/* ---------- chat view ---------- */
const isMine=m=>(m.labelIds||[]).includes('SENT')||parseAddr(hdr(m,'from')).email.toLowerCase()===S.me.toLowerCase();
function closeReader(){
 S.openId=null;S.thread=null;S.replyTo=null;$('#app').classList.remove('reading');
 $('#rtool').style.display='none';$('#chatbar').style.display='none';
 $('#rbody').innerHTML='<div class="empty">Select a conversation to open it.</div>';
 document.querySelectorAll('.row.open').forEach(r=>r.classList.remove('open'));
}
function renderToolbar(){
 const r=S.rows.find(x=>x.id===S.openId);
 const subj=(S.thread&&S.thread.id===S.openId?hdr(S.thread.messages[0],'subject'):(r&&r.subject))||'(no subject)';
 const t=$('#rtool');t.style.display='flex';
 t.innerHTML=`<button class="iconbtn back" data-a="back" title="Back">${ic('back')}</button>
  <div class="rtitle"><i>#</i><span>${esc(subj)}</span></div>
  <button class="iconbtn" data-a="archive" title="Archive (e)">${ic('archive')}</button>
  <button class="iconbtn" data-a="spam" title="Report spam">${ic('spam')}</button>
  <button class="iconbtn" data-a="trash" title="${S.label==='TRASH'&&!S.q?'Restore':'Delete (#)'}">${ic('trash')}</button>
  <button class="iconbtn" data-a="unread" title="Mark as unread">${ic('mail')}</button>
  <button class="iconbtn" data-a="star" title="Star" style="${r&&r.starred?'color:#f4b400':''}">${ic(r&&r.starred?'starOn':'star')}</button>`;
}
$('#rtool').onclick=e=>{
 const b=e.target.closest('[data-a]');if(!b)return;
 if(b.dataset.a==='back')closeReader();else act(S.openId,b.dataset.a);
};
async function openThread(id){
 S.openId=id;S.thread=null;S.replyTo=null;$('#app').classList.add('reading');
 document.querySelectorAll('.row').forEach(r=>r.classList.toggle('open',r.dataset.id===id));
 $('#rbody').innerHTML='<div class="empty">Loading…</div>';$('#chatbar').style.display='none';renderToolbar();busy(true);
 try{
  const t=await api(`threads/${id}?format=full`);
  if(S.openId!==id)return;
  S.thread=t;renderThread(t);
  if(t.messages.some(m=>m.labelIds?.includes('UNREAD'))){
   const r=S.rows.find(x=>x.id===id);if(r){r.unread=false;renderList()}
   modify(id,[],['UNREAD']).then(loadLabelsSoon).catch(()=>{});
  }
 }catch(e){$('#rbody').innerHTML=`<div class="empty err">${esc(e.message)}</div>`}
 finally{busy(false)}
}
function renderThread(t){
 const ms=t.messages,me=S.me.toLowerCase();
 const body=$('#rbody');body.innerHTML='';
 const wrap=document.createElement('div');wrap.className='chat';
 const subj=hdr(ms[0],'subject')||'(no subject)';
 const people=[];ms.forEach(m=>{const a=parseAddr(hdr(m,'from'));if(a.email.toLowerCase()!==me&&!people.includes(a.name))people.push(a.name)});
 const intro=document.createElement('div');intro.className='intro';
 intro.innerHTML=`<div class="big">#</div><h3>${esc(subj)}</h3><p>This is the start of your conversation${people.length?' with '+esc(people.slice(0,3).join(', ')):''}.</p>`;
 wrap.appendChild(intro);
 let prev=null,prevDay='';
 ms.forEach(m=>{
  const f=parseAddr(hdr(m,'from')),ts=+m.internalDate,d=new Date(ts),day=d.toDateString();
  if(day!==prevDay){
   const dv=document.createElement('div');dv.className='dv';
   dv.textContent=d.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric',year:'numeric'});
   wrap.appendChild(dv);prevDay=day;prev=null;
  }
  const mine=isMine(m);
  const key=mine?'__me':f.email.toLowerCase();
  const group=!!prev&&prev.key===key&&ts-prev.ts<7*60000;
  wrap.appendChild(chatMsg(m,f,mine,ts,group));
  prev={key,ts};
 });
 body.appendChild(wrap);
 stickUntil=Date.now()+1500;body.scrollTop=body.scrollHeight;
 renderToolbar();updateChatbar();
}
function chatMsg(m,f,mine,ts,group){
 const hue=[...f.email.toLowerCase()].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7)%360;
 const el=document.createElement('div');el._m=m;el.className='cm'+(group?' group':'');
 const name=mine?'You':f.name;
 el.innerHTML=`<div class="cav" style="background:hsl(${hue} 50% 42%)">${esc((f.name[0]||'?').toUpperCase())}</div>
  <div class="gt">${new Date(ts).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</div>
  <div class="cbody">${group?'':`<div class="chd"><span class="cname" style="color:hsl(${hue} 65% var(--nl))" title="${esc(f.email)}">${esc(name)}</span><span class="ctime" title="${esc(fmtDate(ts,true))}">${fmtChat(ts)}</span></div>`}<div class="ctext"></div></div>
  <div class="cact"><button class="iconbtn" data-c="reply" title="Reply to this message">${ic('reply')}</button><button class="iconbtn" data-c="fwd" title="Forward">${ic('fwd')}</button></div>`;
 const box=el.querySelector('.ctext');
 renderBody(m,box,{img:false,quote:false,exp:false});
 const atts=findAtts(m.payload);
 if(atts.length){
  const d=document.createElement('div');d.className='atts';
  atts.forEach(a=>{
   const b=document.createElement('button');b.className='att';
   b.innerHTML=`${ic('attach')}<span>${esc(a.filename)}</span><small>${Math.max(1,Math.round(a.body.size/1024))} KB</small>`;
   b.onclick=()=>download(m.id,a);d.appendChild(b);
  });
  el.querySelector('.cbody').appendChild(d);
 }
 return el;
}
$('#rbody').onclick=e=>{
 const b=e.target.closest('[data-c]');if(!b)return;
 const m=b.closest('.cm')._m;
 if(b.dataset.c==='reply'){S.replyTo=m;updateChatbar();$('#chatin').focus()}
 else startReply(m,'fwd');
};
/* split a plain-text email into the new part and the quoted history */
function splitQuote(text){
 const lines=text.replace(/\r/g,'').split('\n');let cut=lines.length;
 for(let i=0;i<lines.length;i++){
  const l=lines[i];
  if((/^On\s.+/.test(l)&&(/wrote:\s*$/.test(l)||/wrote:\s*$/.test(lines[i+1]||'')))||/^-{2,}\s*Original Message\s*-{2,}/i.test(l)||/^>/.test(l)){cut=i;break}
 }
 let main=lines.slice(0,cut).join('\n').trim();
 if(!main||cut===lines.length)return{main:text.trim(),quoted:'',full:text.trim()};
 return{main,quoted:lines.slice(cut).join('\n').trim(),full:text.trim()};
}
function renderBody(m,box,st){
 box.innerHTML='';
 const html=findPart(m.payload,'text/html');
 const ctl=document.createElement('div');ctl.className='ctl';
 const addBtn=(label,fn)=>{const b=document.createElement('button');b.className='qbtn';b.textContent=label;b.onclick=fn;ctl.appendChild(b)};
 if(html){
  const doc=decodePart(html);
  const hasQuote=/gmail_quote|<blockquote|yahoo_quoted/i.test(doc);
  const hasImg=/<img[^>]+src=["']?https?:/i.test(doc);
  if(hasImg&&!st.img)addBtn('Load images',()=>{st.img=true;renderBody(m,box,st)});
  if(hasQuote)addBtn(st.quote?'Hide quoted text':'Show quoted text',()=>{st.quote=!st.quote;renderBody(m,box,st)});
  if(ctl.children.length)box.appendChild(ctl);
  const wrap=document.createElement('div');wrap.className='frame';
  const f=document.createElement('iframe');
  f.setAttribute('sandbox','allow-same-origin allow-popups allow-popups-to-escape-sandbox');
  const hideQ=st.quote?'':'.gmail_quote,.gmail_extra,blockquote[type=cite],.yahoo_quoted{display:none!important}';
  f.srcdoc=`<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${st.img?'https: http: data:':'data:'}; style-src 'unsafe-inline'; font-src https: data:"><base target="_blank"><style>body{margin:0;padding:6px 8px;font:14px/1.5 system-ui,sans-serif;color:#222;background:#fff;word-wrap:break-word;overflow-y:hidden}img{max-width:100%;height:auto}${hideQ}</style>${doc}`;
  const more=document.createElement('button');more.className='more';more.textContent='Show more';
  more.onclick=()=>{st.exp=true;wrap.classList.remove('clipped')};
  f.onload=()=>{
   try{
    const d=f.contentDocument.documentElement;
    const fit=()=>{
     f.style.height=d.scrollHeight+'px';
     if(!st.exp&&d.scrollHeight>420)wrap.classList.add('clipped');
     if(Date.now()<stickUntil){const b=$('#rbody');b.scrollTop=b.scrollHeight}
    };
    fit();new ResizeObserver(fit).observe(d);
   }catch{}
  };
  wrap.appendChild(f);wrap.appendChild(more);box.appendChild(wrap);
 }else{
  const {main,quoted,full}=splitQuote(msgText(m));
  if(quoted)addBtn(st.quote?'Hide quoted text':'Show quoted text',()=>{st.quote=!st.quote;renderBody(m,box,st)});
  const p=document.createElement('div');p.className='plain';
  const txt=st.quote?full:main;
  p.innerHTML=esc(txt).replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')||'<span style="color:var(--muted)">(no text)</span>';
  box.appendChild(p);
  if(ctl.children.length)box.appendChild(ctl);
 }
}
async function download(msgId,a){
 try{
  busy(true);
  const r=await api(`messages/${msgId}/attachments/${a.body.attachmentId}`);
  const url=URL.createObjectURL(new Blob([b64uToBytes(r.data)],{type:a.mimeType}));
  const l=document.createElement('a');l.href=url;l.download=a.filename;l.click();
  setTimeout(()=>URL.revokeObjectURL(url),5000);
 }catch(e){toast('Download failed: '+e.message)}finally{busy(false)}
}

/* ---------- chat composer (reply box at the bottom) ---------- */
function chatReplyInfo(){
 const ms=S.thread.messages,me=S.me.toLowerCase();
 const target=S.replyTo||[...ms].reverse().find(m=>!isMine(m))||ms[ms.length-1];
 let to,cc;
 if(isMine(target)){to=hdr(target,'to');cc=hdr(target,'cc')}
 else{
  to=hdr(target,'reply-to')||hdr(target,'from');
  const toList=splitAddrs(to).map(a=>parseAddr(a).email.toLowerCase());
  cc=[...splitAddrs(hdr(target,'to')),...splitAddrs(hdr(target,'cc'))].filter(a=>{
   const e=parseAddr(a).email.toLowerCase();return e!==me&&!toList.includes(e);
  }).join(', ');
 }
 const subj=hdr(S.thread.messages[0],'subject');
 return{to,cc,subject:/^re:/i.test(subj)?subj:'Re: '+subj,inReplyTo:hdr(target,'message-id'),
  refs:(hdr(target,'references')+' '+hdr(target,'message-id')).trim(),threadId:S.thread.id};
}
function updateChatbar(){
 const bar=$('#chatbar');
 if(!S.thread){bar.style.display='none';return}
 bar.style.display='block';
 const i=chatReplyInfo();
 const names=splitAddrs(i.to).map(a=>parseAddr(a).name);
 const n=splitAddrs(i.cc).length;
 $('#replyhint').innerHTML=`Replying to <b>${esc(names.join(', ')||'…')}</b>${n?` and ${n} other${n>1?'s':''}`:''}${S.replyTo?'<button id="cancelreply" title="Cancel">✕</button>':''}`;
 $('#chatin').placeholder='Message '+(names[0]||'');
}
$('#replyhint').onclick=e=>{if(e.target.id==='cancelreply'){S.replyTo=null;updateChatbar()}};
const chatIn=$('#chatin');
chatIn.oninput=()=>{chatIn.style.height='auto';chatIn.style.height=Math.min(chatIn.scrollHeight,160)+'px'};
chatIn.onkeydown=e=>{
 if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();sendChat()}
 else if(e.key==='Escape')chatIn.blur();
};
$('#chatsend').onclick=sendChat;
$('#chatfull').onclick=()=>{
 if(!S.thread)return;const i=chatReplyInfo();
 openCompose({title:'Reply',to:i.to,cc:i.cc,subject:i.subject,body:chatIn.value,threadId:i.threadId,inReplyTo:i.inReplyTo,refs:i.refs});
 chatIn.value='';chatIn.style.height='auto';
};
async function sendChat(){
 const text=chatIn.value.trim();if(!text||!S.thread)return;
 const info=chatReplyInfo(),tid=S.thread.id;
 chatIn.disabled=true;$('#chatsend').disabled=true;
 try{
  await sendRaw({...info,body:text});
  chatIn.value='';chatIn.style.height='auto';S.replyTo=null;
  const t=await api(`threads/${tid}?format=full`);
  if(S.openId===tid){S.thread=t;renderThread(t)}
  const r=S.rows.find(x=>x.id===tid);
  if(r){r.snippet=text.slice(0,120);r.date=Date.now();renderList()}
 }catch(e){toast('Failed to send: '+e.message)}
 finally{chatIn.disabled=false;$('#chatsend').disabled=false;chatIn.focus()}
}

/* ---------- compose window ---------- */
let CTX={};
function openCompose(o={}){
 CTX={threadId:o.threadId,inReplyTo:o.inReplyTo,refs:o.refs};
 $('#ctitle').textContent=o.title||'New message';
 $('#cto').value=o.to||'';$('#ccc').value=o.cc||'';$('#csub').value=o.subject||'';$('#cbody').value=o.body||'';
 $('#cmsg').textContent='';$('#csend').disabled=false;$('#csend').textContent='Send';
 $('#compose').style.display='flex';
 const f=o.to?$('#cbody'):$('#cto');f.focus();if(o.to)f.setSelectionRange(0,0);
}
function closeCompose(){$('#compose').style.display='none'}
function startReply(m,kind){
 const f=hdr(m,'reply-to')||hdr(m,'from');
 const subj=hdr(m,'subject');
 const date=fmtDate(+m.internalDate,true),from=hdr(m,'from');
 const quote=`\n\nOn ${date}, ${from} wrote:\n`+msgText(m).trim().split('\n').map(l=>'> '+l).join('\n');
 if(kind==='fwd'){
  openCompose({title:'Forward',subject:/^fwd:/i.test(subj)?subj:'Fwd: '+subj,
   body:`\n\n---------- Forwarded message ----------\nFrom: ${from}\nDate: ${date}\nSubject: ${subj}\nTo: ${hdr(m,'to')}\n\n`+msgText(m).trim()});
  return;
 }
 let to=f,cc='';
 if(kind==='all'){
  const me=S.me.toLowerCase();
  const toList=splitAddrs(f);
  const others=[...splitAddrs(hdr(m,'to')),...splitAddrs(hdr(m,'cc'))].filter(a=>!a.toLowerCase().includes(me)&&!toList.some(x=>x.toLowerCase()===a.toLowerCase()));
  cc=others.join(', ');
 }
 openCompose({title:'Reply',to,cc,subject:/^re:/i.test(subj)?subj:'Re: '+subj,body:quote,
  threadId:m.threadId,inReplyTo:hdr(m,'message-id'),refs:(hdr(m,'references')+' '+hdr(m,'message-id')).trim()});
}
function encHeader(s){return/^[\x20-\x7e]*$/.test(s)?s:'=?UTF-8?B?'+bytesToB64(new TextEncoder().encode(s))+'?='}
async function sendRaw(o){
 const lines=['To: '+o.to];
 if(o.cc)lines.push('Cc: '+o.cc);
 lines.push('Subject: '+encHeader(o.subject||''));
 if(o.inReplyTo){lines.push('In-Reply-To: '+o.inReplyTo);lines.push('References: '+(o.refs||o.inReplyTo))}
 lines.push('MIME-Version: 1.0','Content-Type: text/plain; charset="UTF-8"','Content-Transfer-Encoding: base64','');
 lines.push(wrap76(bytesToB64(new TextEncoder().encode(o.body||''))));
 await api('messages/send',{method:'POST',body:{raw:toB64Url(lines.join('\r\n')),...(o.threadId?{threadId:o.threadId}:{})}});
}
async function send(){
 const to=$('#cto').value.trim();
 if(!to){$('#cmsg').textContent='Add a recipient.';return}
 const btn=$('#csend');btn.disabled=true;btn.textContent='Sending…';$('#cmsg').textContent='';
 try{
  await sendRaw({to,cc:$('#ccc').value.trim(),subject:$('#csub').value,body:$('#cbody').value,threadId:CTX.threadId,inReplyTo:CTX.inReplyTo,refs:CTX.refs});
  closeCompose();toast('Message sent');
  if(S.label==='SENT'||CTX.threadId){loadList();if(S.openId)openThread(S.openId)}
 }catch(e){$('#cmsg').textContent=e.message;btn.disabled=false;btn.textContent='Send'}
}
$('#composebtn').onclick=()=>{$('#app').classList.remove('menu');openCompose()};
$('#csend').onclick=send;
$('#cclose').onclick=$('#cdiscard').onclick=()=>{
 if(($('#cbody').value.trim()||$('#cto').value.trim())&&!confirm('Discard this message?'))return;
 closeCompose();
};

/* ---------- keyboard ---------- */
document.addEventListener('keydown',e=>{
 if(e.ctrlKey&&e.key==='Enter'&&$('#compose').style.display==='flex'){send();return}
 if(/INPUT|TEXTAREA/.test(document.activeElement.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
 if($('#app').style.display==='none')return;
 const k=e.key;
 if(k==='c'){e.preventDefault();openCompose()}
 else if(k==='/'){e.preventDefault();$('#search').focus()}
 else if(k==='Escape')closeReader();
 else if(S.openId&&k==='e')act(S.openId,'archive');
 else if(S.openId&&k==='#')act(S.openId,'trash');
 else if(S.openId&&k==='r'&&S.thread){e.preventDefault();chatIn.focus()}
 else if(k==='j'||k==='k'){
  const i=S.rows.findIndex(r=>r.id===S.openId),n=k==='j'?i+1:i-1;
  if(S.rows[n])openThread(S.rows[n].id);
 }
});

boot();
