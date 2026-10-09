const API=(window.CONFIG&&CONFIG.API)||'/api/v1',$=s=>document.querySelector(s),fmt=n=>Number(n||0).toLocaleString('uz'),
esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
dt=s=>s?new Date(/Z|\+/.test(s)?s:s+'Z').toLocaleString('uz',{dateStyle:'short',timeStyle:'short'}):'—';
let tok=localStorage.tok,me,boss=localStorage.boss,view;
const FN={rate:'kurs',amount:'summa',value:'qiymat',level:'daraja',phone:'telefon',username:'username',full_name:'ism',password:'parol',boss_percent:'foiz',guide_level:'daraja',car_model:'mashina',title:'tur nomi',start_at:'vaqt',tourist_name:'turist',total_price:'narx',stars:'yulduz'};
const msgOf=d=>{if(typeof d.detail=='string')return d.detail;if(Array.isArray(d.detail))return d.detail.map(e=>{const f=(e.loc||[]).filter(x=>x!='body').pop(),t=e.type||'';
 const m=t=='missing'?'to‘ldirilmagan':/^(greater|less)/.test(t)?'qiymat noto‘g‘ri (chegaradan tashqarida)':/type|parsing|string_too/.test(t)?'noto‘g‘ri yoki bo‘sh':(e.msg||'').replace('Value error, ','');return (f?(FN[f]||f)+': ':'')+m}).join('; ');return 'Ma’lumotlarni tekshiring'};
async function api(p,m='GET',b){const r=await fetch(API+p,{method:m,headers:{'Content-Type':'application/json',...(tok?{Authorization:'Bearer '+tok}:{})},body:b?JSON.stringify(b):undefined}).catch(()=>{throw Error('Serverga ulanib bo‘lmadi. Server uyg‘onayotgan bo‘lishi mumkin — 1 daqiqadan keyin qayta urinib ko‘ring')});
 if(r.status==204)return{};const d=await r.json().catch(()=>({}));
 if(r.status==401&&tok&&p!='/auth/login'){logout();throw Error('Qayta kiring')}
 if(!r.ok)throw Error(msgOf(d));return d}
const Q=p=>me.role=='admin'?p+(p.includes('?')?'&':'?')+'boss_id='+boss:p;
function toast(t,ok=1){const e=document.createElement('div');e.className='toast'+(ok?'':' er');e.textContent=t;$('#toasts').append(e);setTimeout(()=>e.remove(),3500)}
const go=f=>async(...a)=>{try{await f(...a)}catch(e){toast(e.message,0)}};
function modal(h){const d=document.createElement('div');d.className='modal';d.innerHTML=`<div class=box>${h}</div>`;d.onclick=e=>e.target==d&&d.remove();document.body.append(d);return d}
function form(title,fields,submit){const m=modal(`<form><h3>${title}</h3>${fields.map(([n,l,t,o])=>`<label>${l}${t=='select'?`<select name=${n}>${o.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select>`:t=='area'?`<textarea name=${n}>${esc(o||'')}</textarea>`:`<input name=${n} type="${t||'text'}" value="${esc(o||'')}">`}</label>`).join('')}<div class=ferr></div><div class=row><button type=button class=ghost>Bekor</button><button>Saqlash</button></div></form>`);
 m.querySelector('.ghost').onclick=()=>m.remove();
 m.querySelector('form').onsubmit=async e=>{e.preventDefault();const o={};new FormData(e.target).forEach((v,k)=>{if(v!=='')o[k]=v});const er=m.querySelector('.ferr');er.textContent='';
  try{await submit(o);m.remove()}catch(x){er.textContent='⚠️ '+x.message;toast(x.message,0)}}}
const table=(h,r)=>`<div class="card tw"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${r.map(x=>`<tr>${x.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')||`<tr><td colspan=${h.length} class=mut>Hozircha bo‘sh</td></tr>`}</tbody></table></div>`;
const seg=(o,c,f)=>`<span class=seg>${o.map(([k,l])=>`<b class="${k==c?'on':''}" onclick="${f}('${k}')">${l}</b>`).join('')}</span>`;
const chip=s=>`<span class="chip ${s}">${({draft:'Shablon',open:'Ochiq',ready:'Tayyor',completed:'Yakunlangan',cancelled:'Bekor'})[s]||s}</span>`;
const html=h=>{$('#main').innerHTML=h};const load=()=>html('<div class=spin></div>');
const ROLE={super_admin:'Super admin',boss:'Boshliq',admin:'Admin',guide:'Gid',driver:'Haydovchi'};
const NAV={super_admin:[['users','👥','Foydalanuvchilar'],['settings','⚙️','Sozlamalar']],boss:[['stats','📊','Analitika'],['pay','💸','To‘lovlar'],['admins','🧑‍💼','Adminlar']],
 admin:[['tours','🗺️','Turlar'],['account','💰','Hisobim']],guide:[['avail','🧭','Turlar'],['mine','📌','Turlarim'],['account','🏅','Hisobim']],driver:[['avail','🚐','Ishlar'],['mine','📌','Ishlarim'],['account','💰','Hisobim']]};
function logout(){localStorage.clear();tok=me=null;boot()}
function loginUI(){$('#app').innerHTML=`<div class=login><form class=box id=lf><div class=logo>🧭</div><h2 style="text-align:center">Tur Boshqaruv</h2><p class=mut style="text-align:center">Hisobingizga kiring</p>
<label>Username<input name=username placeholder="masalan: superadmin" autocapitalize=off autocomplete=username required></label><label>Parol<input name=password type=password required></label><button style="width:100%;margin-top:8px">Kirish</button></form></div>`;
 $('#lf').onsubmit=go(async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const t=await api('/auth/login','POST',f);tok=localStorage.tok=t.access_token;boot()})}
async function boot(){if(!tok)return loginUI();try{me=await api('/users/me')}catch{return loginUI()}
 const nav=[...NAV[me.role]||[],['inbox','✉️','Xabarlar']];
 $('#app').innerHTML=`<div class=shell><aside><div class=brand>🧭 Tur Boshqaruv</div>${nav.map(([k,i,l])=>`<a data-v=${k} onclick="show('${k}')">${i} ${l}${k=='inbox'?'<span id=bd></span>':''}</a>`).join('')}
 <a onclick="A.pw()">🔑 Parol</a><a onclick="logout()">🚪 Chiqish</a></aside><div><main><div class=top><div><h2 id=ttl></h2><div class=who>${esc(me.full_name)} · ${ROLE[me.role]}${me.guide_level?' · '+me.guide_level+'-daraja':''}</div></div></div><div id=main></div></main></div></div>`;
 show(nav[0][0]);poll();clearInterval(window.pt);window.pt=setInterval(poll,30000)}
async function poll(){try{const d=await api('/messages?unread_only=true&limit=1');$('#bd').innerHTML=d.unread?`<span class=badge>${d.unread}</span>`:''}catch{}}
async function show(v,...a){view=v;document.querySelectorAll('aside a').forEach(x=>x.classList.toggle('on',x.dataset.v==v));
 $('#ttl').textContent=(document.querySelector(`aside a[data-v=${v}]`)?.textContent||'').trim();load();try{await V[v](...a)}catch(e){html(`<div class=card>⚠️ ${esc(e.message)}</div>`)}}
const V={},A={};
// ---------- umumiy ----------
V.inbox=async()=>{const d=await api('/messages?limit=100');html(`<div class=bar><button onclick="A.send()">✍️ Xabar yozish</button></div>`+(d.items.map(m=>`<div class="card msg ${m.read?'':'new'}" onclick="A.read(${m.id},this)"><b>${esc(m.sender_name)}</b> <span class=mut>${dt(m.created_at)}</span><pre>${esc(m.body)}</pre></div>`).join('')||'<div class="card mut">Xabarlar yo‘q</div>'));poll()};
A.read=go(async(id,el)=>{await api(`/messages/${id}/read`,'POST');el.classList.remove('new');poll()});
A.send=()=>form('Xabar yozish',[['username','Username (masalan: admin1)'],['body','Matn','area']],async o=>{await api('/messages','POST',o);toast('Yuborildi ✓')});
A.pw=()=>form('Parolni almashtirish',[['old_password','Eski parol','password'],['new_password','Yangi parol','password']],async o=>{await api('/auth/change-password','POST',o);toast('Parol yangilandi ✓')});
V.account=async()=>{const d=await api('/me/account'),g=d.guide;html(`<div class=grid><div class=card><div class=mut>Olinadigan summa</div><div class=stat>${fmt(d.to_receive)} so‘m</div><div class=mut>jarima: ${fmt(d.unpaid_fines)}</div></div>
 ${d.rating?`<div class=card><div class=mut>Reyting</div><div class=stat>⭐ ${d.rating}</div></div>`:''}
 ${g?`<div class=card><div class=mut>Daraja</div><div class=stat>${g.level}-daraja</div><div class=mut>Shu darajada: ${g.level_tours} tur · jami ${g.completed_tours}${g.level==1?`<br>Amaliyot: ${g.practice_done?'✅':'⬜'} · Suhbat: ${g.interview_passed?'✅':'⬜'}`:''}</div></div>`:''}</div><h3>To‘lovlar</h3>`+
 table(['Sana','Summa','Holat',''],d.payments.map(p=>[dt(p.created_at),fmt(p.net)+' so‘m',p.status=='confirmed'?'✅ tasdiqlangan':'⏳ kutilmoqda',p.status=='paid_by_boss'?`<button class="sm ok" onclick="A.conf(${p.id})">Oldim</button>`:''])))};
A.conf=go(async id=>{await api(`/payments/${id}/confirm`,'POST');toast('Tasdiqlandi ✓');show('account')});
// ---------- super admin ----------
V.users=async()=>{html(`<div class=bar><input id=sq placeholder="🔍 Ism, telefon yoki username"><select id=rf><option value="">Hammasi</option>${['admin','boss','guide','driver'].map(r=>`<option value=${r}>${ROLE[r]}</option>`)}</select><button onclick="A.newUser()">＋ Yangi</button></div><div id=ut></div>`);
 let t;const ld=go(async()=>{const d=await api(`/users?limit=100&search=${encodeURIComponent($('#sq').value)}${$('#rf').value?'&role='+$('#rf').value:''}`);
 $('#ut').innerHTML=table(['Ism','Telefon','Username','Rol','',''],d.items.map(u=>[esc(u.full_name),u.phone,'@'+u.username,ROLE[u.role]+(u.guide_level?' · '+u.guide_level+'-d':'')+(u.boss_percent!=null?' · '+u.boss_percent+'%':'')+(u.car_model?' · '+esc(u.car_model):''),
 u.is_active?'<span class="chip ready">faol</span>':'<span class="chip cancelled">o‘chiq</span>',`<button class="sm ghost" onclick="A.act(${u.id},${!u.is_active})">${u.is_active?'O‘chirish':'Yoqish'}</button> ${u.role=='guide'?`<button class="sm ghost" onclick="A.lvl(${u.id})">Daraja</button> <button class="sm ghost" onclick="A.intv(${u.id})">Suhbat ✓</button>`:''}`]))});
 $('#sq').oninput=()=>{clearTimeout(t);t=setTimeout(ld,300)};$('#rf').onchange=ld;A.reload=ld;ld()};
A.act=go(async(id,v)=>{await api(`/users/${id}/active`,'PATCH',{is_active:v});A.reload()});
A.lvl=id=>form('Darajani o‘zgartirish',[['level','Daraja (1-7)','number']],async o=>{await api(`/guides/${id}/level`,'PATCH',{level:+o.level});A.reload()});
A.intv=go(async id=>{await api(`/guides/${id}/interview-passed`,'POST');toast('Suhbat tasdiqlandi ✓');A.reload()});
A.newUser=()=>form('Yangi foydalanuvchi',[['role','Rol','select',Object.entries(ROLE).slice(1).map(([k,v])=>[k,v])],['full_name','Ism familya'],['phone','Telefon'],['username','Username (o‘zgarmaydi)'],['password','Boshlang‘ich parol'],
 ['boss_percent','Boshliq uchun: foiz %','number'],['guide_level','Gid uchun: daraja (1-7)','number'],['car_model','Haydovchi uchun: mashina rusumi']],async o=>{
 ['boss_percent','guide_level'].forEach(k=>o[k]&&(o[k]=+o[k]));await api('/users','POST',o);toast('Yaratildi ✓');A.reload()});
V.settings=async()=>{const[r,lv,sh,st]=await Promise.all([api('/currency/rate'),api('/level-rates'),api('/super/share'),api('/settings')]);
 html(`<div class=grid><div class=card><div class=mut>Dollar kursi ${r.is_default?'(hali kiritilmagan)':''}</div><div class=stat>${fmt(r.rate)} so‘m</div><div class=acts><button class=sm onclick="A.rate()">Kursni yangilash</button></div></div>
 <div class=card><div class=mut>Mening ulushim (${sh.month})</div><div class=stat>${fmt(sh.total)} so‘m</div></div>
 <div class=card><div class=mut>Admin haqi (1 tur)</div><div class=stat>$${st.admin_fee_usd}</div><div class=acts><button class="sm ghost" onclick="A.fee()">O‘zgartirish</button></div></div></div>
 <h3>Daraja summalari (so‘m)</h3>`+table(['Daraja','Belgilangan','Amaldagi',''],lv.map(l=>[l.level+'-daraja',l.amount?fmt(l.amount):'—',l.effective?fmt(l.effective):'—',`<button class="sm ghost" onclick="A.setLv(${l.level})">Belgilash</button>`]))+
 `<h3>Ulush (boshliqlar)</h3>`+table(['Boshliq','Foiz','Ulush'],sh.items.map(i=>[esc(i.boss_name),i.percent+'%',fmt(i.share)+' so‘m']))+`<div class=bar><button onclick="A.bc()">📢 Ommaviy xabar</button></div>`)};
A.rate=()=>form('Dollar kursi',[['rate','1 $ = necha so‘m','number']],async o=>{await api('/currency/rate','PUT',{rate:+o.rate});show('settings')});
A.fee=()=>form('Admin haqi ($)',[['value','Har tur uchun, dollar','number']],async o=>{await api('/settings/admin_fee_usd','PUT',o);show('settings')});
A.setLv=l=>form(l+'-daraja summasi',[['amount','Summa (so‘m)','number']],async o=>{await api('/level-rates/'+l,'PUT',{amount:+o.amount});show('settings')});
A.bc=()=>form('Ommaviy xabar',[['target','Kimlarga','select',[['guide','Gidlar'],['driver','Haydovchilar'],['admin','Adminlar'],['boss','Boshliqlar'],['all','Hammaga']]],['body','Matn','area']],async o=>{const d=await api('/messages/broadcast','POST',o);toast(d.sent+' kishiga yuborildi ✓')});
// ---------- boshliq ----------
let per='week';A.per=k=>{per=k;show('stats')};
V.stats=async()=>{const[d,b]=await Promise.all([api('/boss/analytics?period='+per),api('/boss/balance')]),t=d.totals;
 html(`<div class=bar>${seg([['day','Kun'],['week','Hafta'],['month','Oy']],per,'A.per')}</div><div class=grid><div class=card><div class=mut>Chiqishlar</div><div class=stat>${t.runs}</div></div><div class=card><div class=mut>Tushum</div><div class=stat>${fmt(t.revenue)}</div></div>
 <div class=card><div class=mut>Xarajat</div><div class=stat>${fmt(t.expenses)}</div></div><div class=card><div class=mut>Foyda</div><div class=stat>${fmt(t.profit)}</div><div class=mut>≈ $${fmt(d.totals_usd.profit)}</div></div>
 <div class=card><div class=mut>Balans (bo‘sh)</div><div class=stat>${fmt(b.free_balance)}</div><div class=mut>kassa ${fmt(b.cash_balance)} · to‘lanmagan ${fmt(b.unpaid_obligations)}</div></div></div><h3>Turlar bo‘yicha</h3>`+
 table(['Tur','Chiqish','Tushum','Xarajat','Natija'],d.tours.map(x=>[esc(x.title),x.runs,fmt(x.revenue),fmt(x.expenses),`<b style="color:var(--${x.profit>=0?'ok':'er'})">${fmt(x.profit)}</b>`])))};
V.pay=async()=>{const[d,h]=await Promise.all([api('/boss/payouts/due'),api('/boss/payouts')]);
 html(`<h3>To‘lanadiganlar</h3>`+table(['Ism','Rol','Turlar','Jami','Jarima','To‘lash',''],d.map(x=>[esc(x.full_name),ROLE[x.role],x.tours_count,fmt(x.gross),fmt(x.fines),`<b>${fmt(x.net)}</b>`,`<button class="sm ok" onclick="A.pay(${x.user_id})">To‘ladim</button>`]))+
 `<h3>Tarix</h3>`+table(['Sana','Kimga','Summa','Holat'],h.map(p=>[dt(p.created_at),esc(p.full_name),fmt(p.net),p.status=='confirmed'?'✅ oldi':'⏳ tasdiq kutilmoqda'])))};
A.pay=go(async id=>{if(!confirm('To‘lovni amalga oshirdingizmi?'))return;await api('/boss/payouts/pay','POST',{user_id:id});toast('Belgilandi ✓');show('pay')});
V.admins=async()=>{const m=await api('/boss/admins');html(`<div class=bar><button onclick="A.addAdm()">＋ Admin biriktirish</button></div><div class=grid>${m.map(a=>`<div class=card><b>${esc(a.full_name)}</b><div class=mut>@${a.username} · ${a.phone}</div><div class=acts><button class="sm er" onclick="A.rmAdm(${a.id})">Olib tashlash</button></div></div>`).join('')||'<div class="card mut">Admin biriktirilmagan</div>'}</div>`)};
A.addAdm=go(async()=>{const l=await api('/admins');form('Admin tanlang',[['admin_id','Administrator','select',l.map(a=>[a.id,a.full_name+' (@'+a.username+')'])]],async o=>{await api('/boss/admins','POST',{admin_id:+o.admin_id});show('admins')})});
A.rmAdm=go(async id=>{await api('/boss/admins/'+id,'DELETE');show('admins')});
// ---------- admin ----------
V.tours=async()=>{if(!boss){const b=await api('/me/bosses');if(b.length==1){boss=localStorage.boss=b[0].id}else return html(`<h3>Qaysi boshliq bilan ishlaysiz?</h3><div class=grid>${b.map(x=>`<div class=card onclick="A.pick(${x.id})" style="cursor:pointer"><b>${esc(x.full_name)}</b><div class=mut>@${x.username}</div></div>`).join('')||'<div class="card mut">Sizga hali boshliq biriktirilmagan</div>'}</div>`)}
 const d=await api(Q('/tours?limit=100'));html(`<div class=bar><button onclick="A.newTour()">＋ Yangi tur</button><button class=ghost onclick="A.pick(null)">🔄 Boshliqni almashtirish</button></div><div class=grid>`+d.map(t=>`<div class=card><div style="display:flex;justify-content:space-between">${chip(t.status)}<span class=mut>${dt(t.start_at)}</span></div><h3>${esc(t.title)}</h3>
 <div class=mut>👤 ${esc(t.tourist_name)} · ${t.pax_count} kishi · ${fmt(t.total_price)} so‘m${t.price_currency=='USD'?' ($'+t.price_original+')':''}<br>🧭 ${esc(t.guide_name||'gid yo‘q')} · 🚐 ${esc(t.driver_name||'haydovchi yo‘q')}</div><div class=acts>
 ${t.status=='draft'?`<button class=sm onclick="A.pub(${t.id})">Yuborish</button><button class="sm er" onclick="A.del(${t.id})">O‘chirish</button>`:''}<button class="sm ghost" onclick="A.clone(${t.id})">Nusxa</button>
 ${['open','ready'].includes(t.status)?`<button class="sm ghost" onclick="A.apps(${t.id})">Arizalar</button><button class="sm ghost" onclick="A.worker(${t.id},${!!t.guide_id},${!!t.driver_id})">Ishchi</button><button class="sm er" onclick="A.cancel(${t.id})">Bekor</button>`:''}
 ${t.fine_prompt?`<button class="sm er" onclick="A.fine(${t.id},${t.guide_id},${t.driver_id})">Jarima bormi?</button>`:''}</div></div>`).join('')+'</div>')};
A.pick=id=>{boss=id;id?localStorage.boss=id:localStorage.removeItem('boss');show('tours')};
const tourFields=[['title','Tur nomi'],['start_at','Boshlanish vaqti','datetime-local'],['pickup_address','Olib ketish manzili'],['stops','Nuqtalar (har qatorda: manzil | daqiqa)','area'],['price_currency','Narx valyutasi','select',[['UZS','So‘m'],['USD','Dollar $']]],['total_price','Turistdan keladigan summa','number'],['platform_percent','Platforma foizi %','number'],
 ['guide_amount','Gidga taklif (so‘m)','number'],['guide_note','Gid uchun qisqa xabar','area'],['driver_amount','Haydovchiga taklif (so‘m)','number'],['driver_note','Haydovchi uchun qisqa xabar','area'],['tourist_name','Turist ism familyasi'],['tourist_phone','Turist telefoni'],['tourist_email','Turist emaili','email'],['messenger','Qaysi messenjer (Telegram, WhatsApp...)'],['pax_count','Odamlar soni','number'],['description','Tavsif','area']];
const mk=o=>{o.stops=(o.stops||'').split('\n').filter(x=>x.trim()).map(l=>{const[a,m]=l.split('|');return{address:a.trim(),duration_minutes:+(m||0)}});['total_price','platform_percent','guide_amount','driver_amount','pax_count'].forEach(k=>o[k]!=null&&(o[k]=+o[k]));return o};
A.newTour=()=>form('Yangi tur',tourFields,async o=>{await api(Q('/tours'),'POST',mk(o));toast('Saqlandi ✓');show('tours')});
A.clone=id=>form('Nusxa olish (ishdan bir kun oldin)',[['start_at','Yangi sana va vaqt','datetime-local'],['tourist_name','Turist (o‘zgartirish ixtiyoriy)'],['pax_count','Odamlar soni','number'],['total_price','Narx (ixtiyoriy)','number'],['price_currency','Valyuta','select',[['','— o‘zgarishsiz —'],['UZS','So‘m'],['USD','Dollar']]]],async o=>{['pax_count','total_price'].forEach(k=>o[k]&&(o[k]=+o[k]));await api(Q(`/tours/${id}/clone`),'POST',o);toast('Nusxa tayyor ✓');show('tours')});
A.pub=id=>form('Gidlarga yuborish',[['min_guide_level','Qaysi darajadan (shu va undan yuqori)','select',[2,3,4,5,6,7].map(x=>[x,x+'-daraja'])]],async o=>{await api(Q(`/tours/${id}/publish`),'POST',{min_guide_level:+o.min_guide_level});toast('Yuborildi 🚀');show('tours')});
A.del=go(async id=>{await api(Q('/tours/'+id),'DELETE');show('tours')});
A.cancel=id=>form('Turni bekor qilish',[['reason','Sabab']],async o=>{await api(Q(`/tours/${id}/cancel`),'POST',o);show('tours')});
A.worker=(id,g,d)=>form('Ishchini bekor qilish / qayta yuborish',[['role','Kim','select',[['guide','Gid'],['driver','Haydovchi']]],['act','Amal','select',[['cancel-worker','Bekor qilish'],['redispatch','Qayta yuborish']]],['reason','Sabab']],async o=>{await api(Q(`/tours/${id}/${o.act}`),'POST',{role:o.role,reason:o.reason});toast('Bajarildi ✓');show('tours')});
A.apps=go(async id=>{const a=await api(Q(`/tours/${id}/applications`));const m=modal(`<h3>Arizalar</h3>${a.map(x=>`<div class=card><b>${esc(x.full_name)}</b> <span class=chip>${x.kind=='driver'?'haydovchi':'amaliyotchi'}</span> <span class=chip>${x.status}</span><div class=mut>${x.phone}${x.car_model?' · '+esc(x.car_model):''}${x.rating?' · ⭐'+x.rating:''}</div>
 ${x.status=='pending'?`<div class=acts><button class="sm ok" data-a="${x.kind=='driver'?'D':'A'}${x.kind=='driver'?x.user_id:x.id}">Tasdiqlash</button><button class="sm er" data-r="${x.id}">Rad</button></div>`:''}</div>`).join('')||'<p class=mut>Ariza yo‘q</p>'}`);
 m.onclick=go(async e=>{const b=e.target;if(b==m)return m.remove();const k=b.dataset.a,r=b.dataset.r;if(!k&&!r)return;
 if(k)k[0]=='D'?await api(Q(`/tours/${id}/driver/approve`),'POST',{user_id:+k.slice(1)}):await api(Q(`/tours/${id}/applications/${k.slice(1)}/approve`),'POST');else await api(Q(`/tours/${id}/applications/${r}/reject`),'POST');m.remove();show('tours')})});
A.fine=(id,g,d)=>form('Jarima bormi?',[['user_id','Kimga','select',[[g,'Gid'],[d,'Haydovchi']]],['amount','Summa (so‘m) — bo‘sh qolsa: jarima yo‘q','number'],['reason','Sabab']],async o=>{o.amount?await api(Q(`/tours/${id}/fines`),'POST',{user_id:+o.user_id,amount:+o.amount,reason:o.reason||''}):await api(Q(`/tours/${id}/fines/skip`),'POST');show('tours')});
// ---------- gid / haydovchi ----------
let day='all';A.day=k=>{day=k;show('avail')};
const card=(t,ctx)=>`<div class=card><div style="display:flex;justify-content:space-between">${chip(t.status)}<b>${t.amount?fmt(t.amount)+' so‘m':'Tekin'}</b></div><h3>${esc(t.title)}</h3><div class=mut>📅 ${dt(t.start_at)} · 👥 ${t.pax_count}<br>📍 ${esc(t.pickup_address||'')}</div>
 <div class=mut>${t.stops.map(s=>`• ${esc(s.address)} ${s.duration_minutes?'('+s.duration_minutes+' daq)':''}`).join('<br>')}</div>${t.note?`<pre>${esc(t.note)}</pre>`:''}
 ${t.tourist_name?`<div class=mut style="margin-top:6px">🧑 ${esc(t.tourist_name)} ${esc(t.tourist_phone||'')} ${esc(t.tourist_email||'')} ${esc(t.messenger||'')}</div>`:''}<div class=acts>${ctx(t)}</div></div>`;
V.avail=async()=>{const g=me.role=='guide',lv=me.guide_level;let l=g?await api('/jobs/guide/available'):await api('/jobs/driver?state=free&day='+day),p=g&&lv==1?await api('/jobs/guide/practice-available'):[];
 html((g?'':`<div class=bar>${seg([['all','Hammasi'],['today','Bugun'],['tomorrow','Ertaga']],day,'A.day')}</div>`)+(g&&lv==1?'<div class="card mut">1-daraja: yaqin turlarga yordamchi sifatida ariza bering — admin tasdiqlaydi.</div>':'')+
 `<div class=grid>${[...l,...p].map(t=>card(t,t=>g?(lv==1?`<button class=sm onclick="A.act2('/jobs/tours/${t.id}/practice/apply')">Ariza yuborish</button>`:`<button class="sm ok" onclick="A.act2('/jobs/tours/${t.id}/guide/accept')">Qabul qilaman</button>`):(t.applied?'<span class=chip>Ariza yuborilgan</span>':`<button class="sm ok" onclick="A.act2('/jobs/tours/${t.id}/driver/apply')">Qabul qilaman</button>`))).join('')||'<div class="card mut">Hozircha mos tur yo‘q 🌴</div>'}</div>`)};
V.mine=async()=>{const g=me.role=='guide',l=await api(g?'/jobs/guide/mine':'/jobs/driver?state=mine');
 html(`<div class=grid>${l.map(t=>card(t,t=>{const done=g?t.guide_confirmed:t.driver_confirmed;return (t.status=='ready'&&!done?`<button class="sm ok" onclick="A.act2('/jobs/tours/${t.id}/complete')">Tur muvaffaqiyatli ✓</button><button class="sm ghost" onclick="A.late(${t.id})">Kechikaman</button>`:'')+
 (['open','ready'].includes(t.status)?`<button class="sm er" onclick="A.wc(${t.id})">Bekor qilish</button>`:'')+(g&&t.status=='completed'?`<button class="sm ghost" onclick="A.rate(${t.id})">⭐ Haydovchini baholash</button>`:'')})).join('')||'<div class="card mut">Hozircha ish yo‘q</div>'}</div>`)};
A.act2=go(async p=>{await api(p,'POST',{});toast('Bajarildi ✓');show(view)});
A.wc=id=>form('Bekor qilish (24 soatdan oldin mumkin)',[['reason','Sabab']],async o=>{await api(`/jobs/tours/${id}/cancel`,'POST',o);toast('Bekor qilindi');show('mine')});
A.late=id=>form('Kechikish haqida xabar',[['note','Necha daqiqa / sabab']],async o=>{await api(`/jobs/tours/${id}/late`,'POST',o);toast('Adminga yuborildi')});
A.rate=id=>form('Haydovchini baholang',[['stars','Yulduz','select',[5,4,3,2,1].map(x=>[x,'⭐'.repeat(x)])]],async o=>{await api(`/jobs/tours/${id}/rate-driver`,'POST',{stars:+o.stars});toast('Rahmat!')});
boot();
