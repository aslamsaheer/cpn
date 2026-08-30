let offers=[],current=null,filterType="all";
function imgUrl(x){return x.imageUrl||("assets/"+x.img)}
function safeImg(x){return imgUrl(x).replace(/&/g,"&amp;").replace(/"/g,"&quot;")}
function fallbackImg(el){el.onerror=null;el.src="assets/"+(el.dataset.fallback||"restaurant.svg")}
let saved=JSON.parse(localStorage.getItem("c4u_saved")||"[]");
let claimed=JSON.parse(localStorage.getItem("c4u_claimed")||"[]");

const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));$(id).classList.remove("hidden");window.scrollTo(0,0)}
function home(){show("home");renderHome()}
function customerLogin(){let p=$("phone").value.replace(/\D/g,"");if(p.length===10)home();else $("phone").focus()}
function openOffer(i){current=offers[i];$("detailName").textContent=current.name;$("detailRating").innerHTML=`★ ${current.rating} <span>· ${current.reviews} Google reviews · Kollam</span>`;$("detailOffer").textContent=current.offer;$("detailDesc").textContent=`${current.tag.toLowerCase()} — a curated coupon4u pick for visitors exploring Kollam.`;$("detailImage").style.backgroundImage=`url("${imgUrl(current)}")`;$("saveDetail").textContent=saved.includes(current.name)?"♥ Saved":"♡ Save";show("detail")}
function toggleSave(){if(!current)return;let i=saved.indexOf(current.name);if(i>=0)saved.splice(i,1);else saved.push(current.name);localStorage.setItem("c4u_saved",JSON.stringify(saved));$("saveDetail").textContent=saved.includes(current.name)?"♥ Saved":"♡ Save";renderSaved()}
function claimOffer(){if(!current)return;let code="RED-"+Math.random().toString(36).slice(2,8).toUpperCase();claimed.unshift({code,name:current.name,offer:current.offer,rating:current.rating,img:current.img,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});localStorage.setItem("c4u_claimed",JSON.stringify(claimed));$("claimedOffer").textContent=current.offer;$("code").textContent=code;show("claimed")}
function renderHome(){
let list=filterType==="all"?offers:offers.filter(x=>x.type===filterType);
let top=list.slice(0,6),mini=list.slice(6);
$("deck").innerHTML=top.map((x,i)=>`<article class="card" onclick="openOffer(${offers.indexOf(x)})"><div class="card-img" style="background-image:url('${imgUrl(x)}')"></div><div class="card-content"><div class="tag">${x.tag}</div><div class="verified">✓ coupon4u verified</div><h4>${x.name}</h4><div class="meta">★ ${x.rating} · ${x.reviews} Google reviews · Kollam</div><div class="offer-pill"><strong>${x.offer}</strong><span>CLAIM →</span></div></div></article>`).join("")||`<div class="empty">No offers found.</div>`;
$("dots").innerHTML=top.map((_,i)=>`<i class="${i===0?"active":""}"></i>`).join("");
$("mini").innerHTML=mini.map(x=>`<div class="mini" onclick="openOffer(${offers.indexOf(x)})"><div class="mini-img" style="background-image:url('${imgUrl(x)}')"></div><div class="mini-main"><b>${x.name}</b><small>★ ${x.rating} · ${x.reviews} reviews</small><small>${x.tag}</small></div><div class="mini-off"><strong>${x.offer.replace(" OFF","")}</strong><small>OFF</small></div></div>`).join("")||`<div class="empty">More offers will appear here.</div>`;
}
function filter(type,btn){filterType=type;document.querySelectorAll(".cats button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");$("sectionTitle").textContent=type==="all"?"Exclusive offers":type==="shops"?"15% fashion offers":type==="others"?"10% activity offers":`${type[0].toUpperCase()+type.slice(1)} offers`;renderHome()}
function renderSaved(){let list=offers.filter(x=>saved.includes(x.name));$("savedList").innerHTML=list.length?list.map(x=>`<div class="saved-card" onclick="openOffer(${offers.indexOf(x)})"><img src="assets/${x.img}"><div><b>${x.name}</b><small>★ ${x.rating} · ${x.reviews} reviews</small><small>${x.tag}</small></div><div class="offer">${x.offer}</div></div>`).join(""):`<div class="empty">No saved offers yet.<br>Tap ♡ Save on an offer.</div>`}
function renderClaims(){ $("claimedList").innerHTML=claimed.length?claimed.map(c=>`<div class="saved-card"><img src="assets/${offers.find(x=>x.name===c.name)?.img||"restaurant.svg"}"><div><b>${c.name}</b><small>${c.offer} · ${c.time}</small><small>Redemption ID: ${c.code}</small></div></div>`).join(""):`<div class="empty">You haven't claimed an offer yet.</div>`}
function setup(){
document.querySelectorAll(".cats button").forEach(b=>b.onclick=()=>filter(b.dataset.cat,b));
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{let p=b.dataset.page;if(p==="home")home();if(p==="saved"){show("saved");renderSaved()}if(p==="offers"){show("offers");renderClaims()}if(p==="more")show("more")});
$("saveDetail").onclick=toggleSave;
$("search").addEventListener("input",e=>{let q=e.target.value.toLowerCase();let old=filterType;let list=(old==="all"?offers:offers.filter(x=>x.type===old)).filter(x=>(x.name+" "+x.tag).toLowerCase().includes(q));$("deck").innerHTML=list.map(x=>`<article class="card" onclick="openOffer(${offers.indexOf(x)})"><div class="card-img" style="background-image:url('${imgUrl(x)}')"></div><div class="card-content"><div class="tag">${x.tag}</div><div class="verified">✓ coupon4u verified</div><h4>${x.name}</h4><div class="meta">★ ${x.rating} · ${x.reviews} Google reviews · Kollam</div><div class="offer-pill"><strong>${x.offer}</strong><span>CLAIM →</span></div></div></article>`).join("")||`<div class="empty">No matching offers.</div>`});
}
fetch("offers.json").then(r=>r.json()).then(d=>{offers=d;setup();renderHome()}).catch(()=>{offers=[];setup()});