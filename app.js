let offers=[],current=null,filterType="all";
let saved=JSON.parse(localStorage.getItem("c4u_saved")||"[]");
let claimed=JSON.parse(localStorage.getItem("c4u_claimed")||"[]");

const $=id=>document.getElementById(id);
const typeLabel={restaurant:"RESTAURANT",hotel:"HOTEL",shops:"SHOP",others:"EXPERIENCE"};

function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  $(id).classList.remove("hidden");
  window.scrollTo({top:0,behavior:"instant"});
}
function home(){show("home");renderHome()}
function customerLogin(){
  if($("phone").value.replace(/\D/g,"").length===10) home();
  else alert("Enter a valid 10-digit mobile number.");
}
function initials(name){return name.split(/[\s&-]+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase()}
function palette(type){
  return type==="restaurant" ? "wine" : type==="hotel" ? "navy" : type==="shops" ? "violet" : "teal";
}
function voucherMarkup(x, index, large=false){
  const pct=x.offer.replace(" OFF","");
  const code="C4U-"+x.name.replace(/[^A-Z0-9]+/gi,"").slice(0,7).toUpperCase()+pct.replace("%","");
  const p=palette(x.type);
  const cls=large?"voucher-card large":"voucher-card";
  return `<article class="${cls} ${p}" onclick="openOffer(${index})">
    <div class="voucher-art">
      <div class="art-glow"></div><div class="art-orbit"></div>
      <div class="merchant-symbol">${initials(x.name)}</div>
      <div class="merchant-copy"><b>${x.name}</b><small>${x.tag}</small></div>
      <span class="art-corner">KOLLAM</span>
    </div>
    <div class="voucher-paper">
      <div class="perforation top"></div>
      <div class="voucher-content">
        <div class="offer-label">COUPON4U EXCLUSIVE</div>
        <div class="offer-title"><strong>${pct}% OFF</strong><span>${x.type==="hotel"?"ON ROOM BOOKING":"YOUR BILL"}</span></div>
        <div class="code-row"><span>${code}</span><button onclick="event.stopPropagation();copyCode('${code}')">▢</button></div>
        <div class="barcode"></div>
      </div>
      <div class="perforation side"></div>
    </div>
    <button class="redeem-bar" onclick="event.stopPropagation();openOffer(${index})"><span>Redeem Now</span><b>→</b></button>
    <div class="ticket-notches"><i></i><i></i><i></i><i></i><i></i></div>
  </article>`;
}
function openOffer(i){
  current=offers[i];
  $("detailVoucher").innerHTML=voucherMarkup(current,i,true);
  $("desc").textContent=`A curated ${typeLabel[current.type].toLowerCase()} pick for visitors exploring Kollam.`;
  $("address").textContent=current.type==="hotel"?"Ashtamudi / Kollam, Kerala":"Main Road, Kollam, Kerala";
  $("save").textContent=saved.includes(current.name)?"♥":"♡";
  show("detail");
}
function toggleSave(){
  if(!current)return;
  const i=saved.indexOf(current.name);
  if(i>=0)saved.splice(i,1); else saved.push(current.name);
  localStorage.setItem("c4u_saved",JSON.stringify(saved));
  $("save").textContent=saved.includes(current.name)?"♥":"♡";
  renderSaved();
}
function copyCode(code){
  navigator.clipboard?.writeText(code).catch(()=>{});
  const b=document.querySelector(".code-row button"); if(b){b.textContent="✓";setTimeout(()=>b.textContent="▢",900)}
}
function claim(){
  if(!current)return;
  const code="C4U "+Math.random().toString(36).slice(2,6).toUpperCase()+" "+Math.random().toString(36).slice(2,6).toUpperCase();
  claimed.unshift({code,name:current.name,offer:current.offer,time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})});
  localStorage.setItem("c4u_claimed",JSON.stringify(claimed));
  $("coffer").textContent=current.name;
  $("claimVoucher").innerHTML=`<div class="claim-code"><small>UNIQUE REDEMPTION ID</small><strong>${code}</strong><div class="barcode wide"></div><span>Valid Today Only · One-time Use</span></div>`;
  show("claimed");
}
function mini(x){
  const i=offers.indexOf(x);
  return `<button class="mini-card" onclick="openOffer(${i})">
    <span class="mini-symbol ${palette(x.type)}">${initials(x.name)}</span>
    <span class="mini-main"><b>${x.name}</b><small>★ ${x.rating} · ${x.reviews} reviews</small><small>${x.tag}</small></span>
    <span class="mini-off"><b>${x.offer.replace(" OFF","")}</b><small>OFF</small></span>
  </button>`;
}
function renderHome(){
  let list=filterType==="all"?offers:offers.filter(x=>x.type===filterType);
  const top=list.slice(0,6);
  $("deck").innerHTML=top.map((x,i)=>voucherMarkup(x,offers.indexOf(x))).join("");
  $("dots").innerHTML=top.map((_,i)=>`<i class="${i===0?"active":""}"></i>`).join("");
  $("mini").innerHTML=list.slice(6).map(mini).join("") || `<div class="empty">No offers found.</div>`;
}
function filter(type,b){
  filterType=type;
  document.querySelectorAll(".categories button").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); renderHome();
}
function renderSaved(){
  const list=offers.filter(x=>saved.includes(x.name));
  $("savedList").innerHTML=list.map(mini).join("")||`<div class="empty">No saved offers yet.</div>`;
}
function renderClaims(){
  $("claimedList").innerHTML=claimed.map(c=>`<div class="claimed-item"><b>${c.name}</b><strong>${c.offer}</strong><small>Redemption ID · ${c.code}</small><small>Claimed at ${c.time}</small></div>`).join("")||`<div class="empty">No claimed offers yet.</div>`;
}
function search(){
  const q=$("search").value.trim().toLowerCase();
  const list=(filterType==="all"?offers:offers.filter(x=>x.type===filterType))
    .filter(x=>(x.name+" "+x.tag+" "+x.offer).toLowerCase().includes(q));
  $("deck").innerHTML=list.slice(0,6).map(x=>voucherMarkup(x,offers.indexOf(x))).join("")||`<div class="empty">No matching offers.</div>`;
}
function setup(){
  document.querySelectorAll(".categories button").forEach(b=>b.onclick=()=>filter(b.dataset.cat,b));
  document.querySelectorAll(".bottom-nav button").forEach(b=>b.onclick=()=>{
    const p=b.dataset.page;
    if(p==="home")home();
    if(p==="saved"){show("saved");renderSaved()}
    if(p==="offers"){show("offers");renderClaims()}
    if(p==="more")show("more");
  });
  $("save").onclick=toggleSave;
  $("search").addEventListener("input",search);
  $("seeAll").onclick=()=>{filterType="all";document.querySelectorAll(".categories button").forEach((b,i)=>b.classList.toggle("active",i===0));renderHome();document.querySelector(".more-head").scrollIntoView({behavior:"smooth"})};
  $("seeAll2").onclick=()=>window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
}
fetch("offers.json").then(r=>r.json()).then(d=>{offers=d;setup();renderHome()});
