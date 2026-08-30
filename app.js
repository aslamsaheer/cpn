const offers=[
/* restaurants */
{name:"Supreme Uppercrust",type:"restaurant",rating:"4.4",reviews:"2,026",offer:"10% OFF",tag:"FINE DINING",visual:"restaurant"},
{name:"SULAIMANI LAND'S END",type:"restaurant",rating:"4.6",reviews:"658",offer:"5% OFF",tag:"SEA VIEW DINING",visual:"sea"},
{name:"Le Delice",type:"restaurant",rating:"4.2",reviews:"1,556",offer:"10% OFF",tag:"LOCAL FAVOURITE",visual:"restaurant"},
{name:"Meen by Chef Pillai",type:"restaurant",rating:"4.2",reviews:"1,155",offer:"5% OFF",tag:"KERALA CUISINE",visual:"kerala"},
{name:"Ramees Restaurant",type:"restaurant",rating:"4.2",reviews:"11,575",offer:"10% OFF",tag:"SOUTH INDIAN",visual:"restaurant"},
/* hotels */
{name:"The Leela Ashtamudi",type:"hotel",rating:"4.4",reviews:"7,500",offer:"10% OFF",tag:"BACKWATER LUXURY",visual:"hotel"},
{name:"The Quilon Beach Hotel",type:"hotel",rating:"4.2",reviews:"5,719",offer:"5% OFF",tag:"BEACHSIDE STAY",visual:"beach"},
{name:"Dfort Hotel Kollam",type:"hotel",rating:"4.4",reviews:"2,678",offer:"10% OFF",tag:"CITY STAY",visual:"hotel"},
{name:"Club Mahindra Ashtamudi",type:"hotel",rating:"4.3",reviews:"6,578",offer:"5% OFF",tag:"LAKE RESORT",visual:"lake"},
{name:"Samiira on Ashtamudi Lake",type:"hotel",rating:"4.3",reviews:"327",offer:"10% OFF",tag:"LAKESIDE ESCAPE",visual:"lake"},
/* shops */
{name:"Jolly Silks - Kollam",type:"shops",rating:"4.7",reviews:"14,663",offer:"15% OFF",tag:"FASHION",visual:"fashion"},
{name:"Pulimoottil Silks",type:"shops",rating:"4.5",reviews:"10,536",offer:"15% OFF",tag:"SILKS & ETHNIC WEAR",visual:"fashion"},
{name:"Style Union - Kollam",type:"shops",rating:"4.8",reviews:"8,448",offer:"15% OFF",tag:"FASHION",visual:"fashion"},
{name:"Fashion Factory",type:"shops",rating:"4.6",reviews:"1,786",offer:"15% OFF",tag:"FAMILY FASHION",visual:"fashion"},
{name:"Blossom Exclusive Store Kollam",type:"shops",rating:"4.9",reviews:"1,160",offer:"15% OFF",tag:"WOMEN'S FASHION",visual:"fashion"},
/* others */
{name:"Syzygy Ecosports",type:"others",rating:"4.8",reviews:"470",offer:"10% OFF",tag:"KAYAKING",visual:"kayak"},
{name:"Kayabay Adventure",type:"others",rating:"4.9",reviews:"346",offer:"10% OFF",tag:"KAYAKING",visual:"kayak"},
{name:"Mangrove Dreams Adventure Water Sports",type:"others",rating:"4.9",reviews:"2,235",offer:"10% OFF",tag:"WATER SPORTS",visual:"kayak"},
{name:"Mangrove Wonders Kayaking",type:"others",rating:"4.9",reviews:"1,283",offer:"10% OFF",tag:"KAYAKING",visual:"kayak"},
{name:"Kollam Dream House Boat",type:"others",rating:"4.9",reviews:"999",offer:"10% OFF",tag:"HOUSEBOAT",visual:"boat"},
{name:"Dream Cruise Houseboats",type:"others",rating:"4.9",reviews:"147",offer:"10% OFF",tag:"HOUSEBOAT",visual:"boat"},
{name:"Kollam Houseboats Ashtamudi Lake Tours",type:"others",rating:"4.6",reviews:"327",offer:"10% OFF",tag:"BOAT TOUR",visual:"boat"},
{name:"Boat Jetty Kollam",type:"others",rating:"4.2",reviews:"110",offer:"10% OFF",tag:"BOAT TOUR",visual:"boat"},
{name:"Adventure Park, Kollam",type:"others",rating:"4.1",reviews:"7,851",offer:"10% OFF",tag:"ADVENTURE",visual:"water"}
];

const visual={
 restaurant:"linear-gradient(135deg,#56351d,#17110d)",
 sea:"linear-gradient(135deg,#224c5a,#101b20)",
 kerala:"linear-gradient(135deg,#244c3d,#0d1813)",
 hotel:"linear-gradient(135deg,#51423b,#171514)",
 beach:"linear-gradient(135deg,#c18e65,#243039)",
 lake:"linear-gradient(135deg,#315a55,#111c1c)",
 fashion:"linear-gradient(135deg,#4d314d,#151015)",
 kayak:"linear-gradient(135deg,#276a70,#0b292d)",
 boat:"linear-gradient(135deg,#244e56,#101b20)",
 water:"linear-gradient(135deg,#365d79,#101a23)"
};
let current=null;

function cardVisual(x){
return `<div class="card-img" style="background-image:${visual[x.visual]}"></div>`;
}
function render(list=offers){
const deck=document.getElementById("deck");
const top=list.slice(0,6);
deck.innerHTML=top.map((x,i)=>`<article class="card" onclick="openOffer(${offers.indexOf(x)})">${cardVisual(x)}<div class="card-content"><div class="tag">${x.tag}</div><div class="verified"><span>✓</span> coupon4u verified</div><h4>${x.name}</h4><div class="meta">★ ${x.rating} · ${x.reviews} Google reviews · Kollam</div><div class="offer-pill"><strong>${x.offer}</strong><span>CLAIM →</span></div></div></article>`).join("");
document.getElementById("dots").innerHTML=top.map((_,i)=>`<i class="${i===0?"active":""}"></i>`).join("");
const mini=list.slice(6,12);
document.getElementById("mini").innerHTML=mini.map(x=>`<div class="mini" onclick="openOffer(${offers.indexOf(x)})"><div class="mini-img" style="background-image:${visual[x.visual]}"></div><div class="mini-main"><b>${x.name}</b><small>★ ${x.rating} · ${x.reviews} reviews</small><small>${x.tag}</small></div><div class="mini-off"><strong>${x.offer.replace(" OFF","")}</strong><small>OFF</small></div></div>`).join("");
}
function filter(type,btn){
document.querySelectorAll(".cats button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
const list=type==="all"?offers:offers.filter(x=>x.type===type);render(list);
}
function hide(){document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"))}
function customerLogin(){if(document.getElementById("phone").value.replace(/\D/g,"").length>=10)home()}
function home(){hide();document.getElementById("home").classList.remove("hidden");render()}
function loginScreen(){hide();document.getElementById("login").classList.remove("hidden")}
function showAgent(){hide();document.getElementById("agent").classList.remove("hidden")}
function openOffer(i){
current=offers[i];
document.getElementById("detailName").textContent=current.name;
document.getElementById("detailRating").innerHTML=`★ ${current.rating} <span>· ${current.reviews} Google reviews · Kollam</span>`;
document.getElementById("detailOffer").textContent=current.offer;
document.getElementById("detailDesc").textContent=`${current.tag.toLowerCase()} — a curated coupon4u pick for visitors exploring Kollam.`;
document.getElementById("detailImage").style.backgroundImage=visual[current.visual];
hide();document.getElementById("detail").classList.remove("hidden");
}
function claimOffer(){
document.getElementById("claimedOffer").textContent=current.offer;
document.getElementById("code").textContent="RED-"+Math.random().toString(36).slice(2,8).toUpperCase();
hide();document.getElementById("claimed").classList.remove("hidden");
}
render();