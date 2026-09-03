let offers=[],current=null,filterType="all";
let saved=JSON.parse(localStorage.getItem("c4u_saved")||"[]");
let claimed=JSON.parse(localStorage.getItem("c4u_claimed")||"[]");
let pass=null;
let passTimer=null;

const $=id=>document.getElementById(id);
const typeLabel={restaurant:"RESTAURANT",hotel:"HOTEL",shops:"SHOP",others:"EXPERIENCE"};

function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  $(id).classList.remove("hidden");
  window.scrollTo({top:0,behavior:"instant"});
}
function home(){show("home");renderHome();updatePassUI()}
function normalizePhone(value){return value.replace(/\D/g,"").slice(-10)}
function hashString(str){
  let h=2166136261;
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
  return (h>>>0).toString(36).toUpperCase().padStart(7,"0");
}
function generatePassCode(mobile){
  const day=Math.floor(Date.now()/86400000);
  const hash=hashString(`${mobile}:${day}:coupon4u`);
  return `C4U-${hash.slice(0,4)}-${hash.slice(4,8)}`;
}
function ensurePass(mobile){
  const now=Date.now();
  const stored=JSON.parse(localStorage.getItem("c4u_pass")||"null");
  if(stored && stored.mobile===mobile && stored.expiresAt>now){
    pass=stored;
  }else{
    pass={mobile,code:generatePassCode(mobile),createdAt:now,expiresAt:now+24*60*60*1000};
    localStorage.setItem("c4u_pass",JSON.stringify(pass));
  }
  updatePassUI();
  return pass;
}
function formatRemaining(ms){
  const total=Math.max(0,Math.floor(ms/1000));
  const h=Math.floor(total/3600).toString().padStart(2,"0");
  const m=Math.floor((total%3600)/60).toString().padStart(2,"0");
  const s=(total%60).toString().padStart(2,"0");
  return `${h}:${m}:${s}`;
}
function updatePassUI(){
  const timer=$("passTimer");
  if(!timer)return;
  if(!pass){timer.classList.add("hidden");return}
  const remaining=pass.expiresAt-Date.now();
  if(remaining<=0){timer.textContent="PASS EXPIRED";timer.classList.add("expired");return}
  timer.classList.remove("hidden","expired");
  timer.innerHTML=`<span>♧</span> ${formatRemaining(remaining)}`;
  if(!passTimer) passTimer=setInterval(updatePassUI,1000);
}
function customerLogin(){
  const mobile=normalizePhone($("phone").value);
  if(mobile.length===10){ensurePass(mobile);home()}
  else alert("Enter a valid 10-digit mobile number.");
}
function initials(name){return name.split(/[\s&-]+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase()}
function palette(type){return type==="restaurant" ? "wine" : type==="hotel" ? "navy" : type==="shops" ? "violet" : "teal"}
function fallbackImage(type){return type==="restaurant" ? "assets/restaurant.svg" : type==="hotel" ? "assets/hotel.svg" : type==="shops" ? "assets/fashion.svg" : "assets/adventure.svg"}
function imageMarkup(x, cls="merchant-image"){
  const src=x.image||fallbackImage(x.type);
  const fallback=fallbackImage(x.type);
  return `<img class="${cls}" src="${src}" alt="${x.name}" onerror="if(this.dataset.fallback!=='1'){this.dataset.fallback='1';this.src='${fallback}';}else{this.style.display='none';this.parentElement.classList.add('no-image')}" />`;
}
function voucherMarkup(x,index,large=false,detail=false){
  const pct=x.offer.replace(" OFF","").replace("%","");
  const p=palette(x.type);
  const cls=large?"voucher-card large":"voucher-card";
  return `<article class="${cls} ${p}" onclick="openOffer(${index})">
    <div class="voucher-art">
      ${imageMarkup(x)}
      <div class="art-glow"></div><div class="art-orbit"></div>
      <div class="merchant-symbol">${initials(x.name)}</div>
      <div class="merchant-copy"><b>${x.name}</b><small>${x.tag}</small></div>
      <span class="art-corner">KOLLAM</span>
      <span class="rating-badge">★ ${x.rating}</span>
    </div>
    <div class="voucher-paper">
      <div class="perforation top"></div>
      <div class="voucher-content">
        <div class="offer-label">COUPON4U EXCLUSIVE</div>
        <div class="offer-title"><strong>${pct}% OFF</strong><span>${x.type==="hotel"?"ON ROOM BOOKING":"YOUR BILL"}</span></div>
      </div>
      <div class="perforation side"></div>
    </div>
    <button class="redeem-bar" onclick="event.stopPropagation();${detail?'claim()':`openOffer(${index})`}"><span>Redeem Now</span><b>→</b></button>
    <div class="ticket-notches"><i></i><i></i><i></i><i></i><i></i></div>
  </article>`;
}
function openOffer(i){
  current=offers[i];
  $("detailVoucher").innerHTML=voucherMarkup(current,i,true,true);
  $("desc").textContent=`A curated ${typeLabel[current.type].toLowerCase()} pick for visitors exploring Kollam.`;
  $("address").textContent=current.type==="hotel"?"Ashtamudi / Kollam, Kerala":"Main Road, Kollam, Kerala";
  $("save").textContent=saved.includes(current.name)?"♥":"♡";
  show("detail");
}
function toggleSave(){
  if(!current)return;
  const i=saved.indexOf(current.name);
  if(i>=0)saved.splice(i,1);else saved.push(current.name);
  localStorage.setItem("c4u_saved",JSON.stringify(saved));
  $("save").textContent=saved.includes(current.name)?"♥":"♡";
  renderSaved();
}
function claim(){
  if(!current)return;
  if(!pass){alert("Please log in with your mobile number first.");return}
  if(pass.expiresAt<=Date.now()){
    ensurePass(pass.mobile);
  }
  const redemption={name:current.name,offer:current.offer,time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),redeemedAt:Date.now()};
  claimed.unshift(redemption);
  localStorage.setItem("c4u_claimed",JSON.stringify(claimed));
  $("coffer").textContent=current.name;
  $("claimCode").textContent=pass.code;
  $("claimExpiry").textContent=formatRemaining(pass.expiresAt-Date.now());
  const qr=$("qrCode");
  qr.innerHTML="";
  if(window.QRCode){
    new QRCode(qr,{text:pass.code,width:176,height:176,colorDark:"#111111",colorLight:"#f8f5ec",correctLevel:QRCode.CorrectLevel.M});
  }else{
    qr.textContent="QR unavailable";
  }
  updateClaimExpiry();
  show("claimed");
}
let claimTimer=null;
function updateClaimExpiry(){
  if(claimTimer)clearInterval(claimTimer);
  claimTimer=setInterval(()=>{
    if(!pass)return;
    const remaining=pass.expiresAt-Date.now();
    const el=$("claimExpiry");
    if(!el)return;
    if(remaining<=0){el.textContent="EXPIRED";clearInterval(claimTimer);return}
    el.textContent=formatRemaining(remaining);
  },1000);
}
function mini(x){
  const i=offers.indexOf(x);
  return `<button class="mini-card" onclick="openOffer(${i})"><span class="mini-symbol ${palette(x.type)}">${initials(x.name)}</span><span class="mini-main"><b>${x.name}</b><small>★ ${x.rating} · ${x.reviews} reviews</small><small>${x.tag}</small></span><span class="mini-off"><b>${x.offer.replace(" OFF","")}</b><small>OFF</small></span></button>`;
}
function moreCard(x){
  const i=offers.indexOf(x);
  const pct=x.offer.replace(" OFF","").replace("%","");
  return `<button class="offer-mini-card ${palette(x.type)}" onclick="openOffer(${i})">
    <div class="mini-voucher-art">${imageMarkup(x,"merchant-image")}<div class="mini-image-shade"></div><span class="mini-rating">★ ${x.rating}</span><div class="mini-merchant"><b>${x.name}</b><small>${x.tag}</small></div></div>
    <div class="mini-paper"><div class="mini-perforation"></div><div class="mini-offer-label">COUPON4U EXCLUSIVE</div><strong>${pct}% OFF</strong><span>${x.type==="hotel"?"ON ROOM BOOKING":"YOUR BILL"}</span></div>
    <div class="mini-redeem"><span>Redeem Now</span><b>→</b></div><div class="mini-notches"><i></i><i></i><i></i></div>
  </button>`;
}
function renderHome(){
  let list=filterType==="all"?offers:offers.filter(x=>x.type===filterType);
  const top=list.slice(0,6);
  $("deck").innerHTML=top.map(x=>voucherMarkup(x,offers.indexOf(x))).join("");
  $("dots").innerHTML=top.map((_,i)=>`<button class="${i===0?"active":""}" aria-label="Go to offer ${i+1}" onclick="event.stopPropagation();goToTopPick(${i})"></button>`).join("");
  $("mini").innerHTML=list.slice(6).map(moreCard).join("")||`<div class="empty">No offers found.</div>`;
  updatePassUI();
}
function goToTopPick(i){const cards=[...$("deck").querySelectorAll(".voucher-card")];if(cards[i])$("deck").scrollTo({left:cards[i].offsetLeft-24,behavior:"smooth"})}
function filter(type,b){filterType=type;document.querySelectorAll(".categories button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderHome()}
function renderSaved(){const list=offers.filter(x=>saved.includes(x.name));$("savedList").innerHTML=list.map(mini).join("")||`<div class="empty">No saved offers yet.</div>`}
function renderClaims(){$("claimedList").innerHTML=claimed.map(c=>`<div class="claimed-item"><b>${c.name}</b><strong>${c.offer}</strong><small>Redeemed at ${c.time}</small></div>`).join("")||`<div class="empty">No redeemed offers yet.</div>`}
function search(){const q=$("search").value.trim().toLowerCase();const list=(filterType==="all"?offers:offers.filter(x=>x.type===filterType)).filter(x=>(x.name+" "+x.tag+" "+x.offer).toLowerCase().includes(q));$("deck").innerHTML=list.slice(0,6).map(x=>voucherMarkup(x,offers.indexOf(x))).join("")||`<div class="empty">No matching offers.</div>`}
function setup(){
  document.querySelectorAll(".categories button").forEach(b=>b.onclick=()=>filter(b.dataset.cat,b));
  document.querySelectorAll(".bottom-nav button").forEach(b=>b.onclick=()=>{const p=b.dataset.page;if(p==="home")home();if(p==="saved"){show("saved");renderSaved()}if(p==="offers"){show("offers");renderClaims()}if(p==="more")show("more")});
  $("save").onclick=toggleSave;
  $("search").addEventListener("input",search);
  let deckTicking=false;
  $("deck").addEventListener("scroll",()=>{if(deckTicking)return;deckTicking=true;requestAnimationFrame(()=>{const cards=[...$("deck").querySelectorAll(".voucher-card")];if(cards.length){const center=$("deck").scrollLeft+$("deck").clientWidth/2;let active=0,best=Infinity;cards.forEach((card,i)=>{const d=Math.abs((card.offsetLeft+card.offsetWidth/2)-center);if(d<best){best=d;active=i}});[...$("dots").children].forEach((dot,i)=>dot.classList.toggle("active",i===active))}deckTicking=false})},{passive:true});
  $("seeAll").onclick=()=>{filterType="all";document.querySelectorAll(".categories button").forEach((b,i)=>b.classList.toggle("active",i===0));renderHome();document.querySelector(".more-head").scrollIntoView({behavior:"smooth"})};
  $("seeAll2").onclick=()=>window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
}
fetch("offers.json").then(r=>r.json()).then(d=>{offers=d;setup();renderHome()});
