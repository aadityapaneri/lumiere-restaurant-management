const DEFAULT_MENU = [
  {id:1,name:"Margherita Pizza",price:1000,category:"signature",tag:"Chef Selection",description:"San Marzano tomatoes, buffalo mozzarella, Genovese basil and Sicilian olive oil.",image:""},
  {id:2,name:"Classic Burger",price:120,category:"main",tag:"Guest Favorite",description:"Dry-aged beef blend, Gruyère, sweet onion compote, truffle aioli and artisan brioche.",image:""},
  {id:3,name:"Alfredo Pasta",price:180,category:"main",tag:"Fresh Pasta",description:"Bronze-die tagliatelle, aged Reggiano emulsion, cultured butter and crushed pepper.",image:""},
  {id:4,name:"Caesar Salad",price:250,category:"main",tag:"Farm-to-Table",description:"Charred baby gem lettuce, anchovy dressing, sourdough croutons and Grana Padano.",image:""},
  {id:5,name:"Tiramisu",price:400,category:"dessert",tag:"Pastry Chef",description:"Espresso-soaked ladyfingers, Lombardy mascarpone cream and Valrhona cocoa.",image:""},
  {id:6,name:"Mojito",price:80,category:"drink",tag:"Mixology",description:"Fresh spearmint, key lime, demerara syrup, club soda, crushed ice and citrus zest.",image:""},
  {id:7,name:"French Fries",price:420,category:"signature",tag:"Lumière Classic",description:"Golden crisp potatoes finished with sea salt and our signature house seasoning.",image:""},
  {id:8,name:"Truffle Pasta",price:385,category:"signature",tag:"Signature",description:"Rich, creamy pasta finished with shaved truffle and aged parmesan.",image:""},
  {id:9,name:"Chocolate Lava Cake",price:150,category:"dessert",tag:"Warm Dessert",description:"Warm chocolate centre served with a refined vanilla finish.",image:""}
];

const DEFAULT_RESERVATIONS = [
  {id:101,name:"Rahul Mehta",date:"2026-11-17",time:"19:00",guests:2,table:"T-04",status:"confirmed"},
  {id:102,name:"Sarah Patel",date:"2026-11-17",time:"19:30",guests:4,table:"T-08",status:"seated"},
  {id:103,name:"Arjun Shah",date:"2026-11-17",time:"20:00",guests:3,table:"T-12",status:"confirmed"},
  {id:104,name:"Neha Desai",date:"2026-11-17",time:"20:30",guests:2,table:"T-03",status:"pending"},
  {id:105,name:"Vikram Joshi",date:"2026-11-17",time:"21:00",guests:6,table:"T-16",status:"confirmed"}
];

let menuData = DEFAULT_MENU.map(item => ({...item}));
let reservations = DEFAULT_RESERVATIONS.map(item => ({...item}));
let adminLoggedIn = false;

function toast(message){
  const el=document.getElementById("toast");
  if(!el)return;
  el.textContent=message;
  el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>el.classList.remove("show"),2200);
}

function initLogin(){
  const form=document.getElementById("loginForm");
  if(!form)return;
  // Static frontend mode: login state exists only while this page is open.
  document.getElementById("togglePassword").addEventListener("click",()=>{
    const input=document.getElementById("password");
    const button=document.getElementById("togglePassword");
    input.type=input.type==="password"?"text":"password";
    button.textContent=input.type==="password"?"SHOW":"HIDE";
  });
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const email=document.getElementById("email").value.trim();
    const password=document.getElementById("password").value;
    if(email==="admin@lumiere.com" && password==="admin123"){
      location.href="admin.html";
    }else{
      document.getElementById("loginError").textContent="Invalid login. Use the demo credentials shown in the fields.";
    }
  });
}

function initAdmin(){
  if(!document.querySelector(".admin-page"))return;
  // No backend, database, localStorage or sessionStorage is used.
  // admin.html can be opened directly as a static frontend.
  const date=new Date();
  document.getElementById("todayDate").textContent=date.toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"}).toUpperCase();
  setupNavigation();
  renderMenu();
  renderReservations();
  renderRecentReservations();
  renderTables();
  renderServiceList();
  renderGuestChart();
  setupModals();
  setupActions();
}

function setupNavigation(){
  const buttons=document.querySelectorAll(".nav-item");
  const views=document.querySelectorAll(".page-view");
  function openView(name){
    buttons.forEach(b=>b.classList.toggle("active",b.dataset.view===name));
    views.forEach(v=>v.classList.toggle("active",v.id===name+"View"));
    const titles={dashboard:"Overview",menu:"Seasonal Menu",service:"Today's Service",guests:"Guest Insights",reservations:"Reservations",settings:"Settings"};
    const kickers={dashboard:"OPERATIONS",menu:"CULINARY",service:"DINING ROOM",guests:"CRM · ANALYTICS",reservations:"GUEST BOOKING",settings:"ADMINISTRATION"};
    document.getElementById("pageTitle").textContent=titles[name];
    document.getElementById("pageKicker").textContent=kickers[name];
    closeMobileSidebar();
    location.hash=name;
  }
  buttons.forEach(b=>b.addEventListener("click",()=>openView(b.dataset.view)));
  document.querySelectorAll("[data-view-link]").forEach(b=>b.addEventListener("click",()=>openView(b.dataset.viewLink)));
  const hash=location.hash.replace("#","");
  if(titlesafe(hash))openView(hash);
}
function titlesafe(hash){return ["dashboard","menu","service","guests","reservations","settings"].includes(hash)}

function setupActions(){
  document.getElementById("logoutButton").addEventListener("click",()=>{
    location.href="login.html";
  });
  document.getElementById("openSidebar").addEventListener("click",openMobileSidebar);
  document.getElementById("closeSidebar").addEventListener("click",closeMobileSidebar);
  document.getElementById("mobileOverlay").addEventListener("click",closeMobileSidebar);

  document.querySelectorAll(".filter").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      renderMenu(btn.dataset.filter);
    });
  });

  document.getElementById("toggleServiceButton").addEventListener("click",e=>{
    const open=e.target.textContent.includes("PAUSE");
    e.target.textContent=open?"RESUME SERVICE":"PAUSE SERVICE";
    document.getElementById("serviceState").textContent=open?"PAUSED":"OPEN";
    toast(open?"Service paused":"Service resumed");
  });

  document.getElementById("addMenuButton").addEventListener("click",()=>openDishModal());
  document.getElementById("addReservationButton").addEventListener("click",()=>openReservationModal());
  document.getElementById("reservationSearch").addEventListener("input",renderReservations);
  document.getElementById("reservationFilter").addEventListener("change",renderReservations);
  document.getElementById("saveSettings").addEventListener("click",()=>{
    document.getElementById("settingsSaved").textContent="Changes saved successfully.";
    toast("Settings saved");
  });
  document.querySelectorAll("[data-close-modal]").forEach(btn=>btn.addEventListener("click",()=>closeModal(btn.dataset.closeModal)));
  document.getElementById("dishForm").addEventListener("submit",saveDish);
  document.getElementById("reservationForm").addEventListener("submit",saveReservation);
}

function setupModals(){
  document.querySelectorAll(".modal").forEach(modal=>{
    modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});
  });
}

function openMobileSidebar(){document.getElementById("sidebar").classList.add("open");document.getElementById("mobileOverlay").classList.add("show")}
function closeMobileSidebar(){document.getElementById("sidebar").classList.remove("open");document.getElementById("mobileOverlay").classList.remove("show")}

function categoryLabel(cat){return ({signature:"SIGNATURE",main:"MAIN COURSE",dessert:"DESSERT",drink:"DRINKS"})[cat]||cat.toUpperCase()}
function renderMenu(filter="all"){
  const grid=document.getElementById("menuAdminGrid");
  if(!grid)return;
  const items=menuData.filter(item=>filter==="all"||item.category===filter);
  grid.innerHTML=items.map(item=>`
    <article class="menu-admin-card">
      <div class="menu-image">${item.image?`<img src="${escapeHtml(item.image)}" alt="">`:"✦"}</div>
      <div class="menu-info">
        <div class="menu-info-top"><div><h3>${escapeHtml(item.name)}</h3><span class="tag">${categoryLabel(item.category)} · ${escapeHtml(item.tag)}</span></div><span class="price">₹${Number(item.price).toLocaleString("en-IN")}</span></div>
        <p class="menu-desc">${escapeHtml(item.description)}</p>
        <div class="menu-actions"><button class="small-button edit" onclick="openDishModal(${item.id})">EDIT</button><button class="small-button delete" onclick="deleteDish(${item.id})">DELETE</button></div>
      </div>
    </article>`).join("");
}
function openDishModal(id=null){
  const modal=document.getElementById("dishModal");
  document.getElementById("dishForm").reset();
  document.getElementById("dishId").value="";
  document.getElementById("dishModalTitle").textContent=id?"Edit Dish":"Add Dish";
  if(id){
    const item=menuData.find(x=>x.id===id);
    if(!item)return;
    document.getElementById("dishId").value=item.id;
    document.getElementById("dishName").value=item.name;
    document.getElementById("dishPrice").value=item.price;
    document.getElementById("dishCategory").value=item.category;
    document.getElementById("dishTag").value=item.tag;
    document.getElementById("dishDescription").value=item.description;
    document.getElementById("dishImage").value=item.image;
  }
  modal.classList.add("open");
}
function saveDish(e){
  e.preventDefault();
  const id=Number(document.getElementById("dishId").value);
  const item={
    id:id||Date.now(),
    name:document.getElementById("dishName").value.trim(),
    price:Number(document.getElementById("dishPrice").value),
    category:document.getElementById("dishCategory").value,
    tag:document.getElementById("dishTag").value.trim()||"Lumière Selection",
    description:document.getElementById("dishDescription").value.trim(),
    image:document.getElementById("dishImage").value.trim()
  };
  if(id)menuData=menuData.map(x=>x.id===id?item:x);else menuData.push(item);
  closeModal("dishModal");renderMenu();toast(id?"Dish updated":"Dish added");
}
function deleteDish(id){
  if(!confirm("Delete this dish from the admin menu?"))return;
  menuData=menuData.filter(x=>x.id!==id);renderMenu();toast("Dish deleted");
}

function renderReservations(){
  const tbody=document.getElementById("reservationTable");
  if(!tbody)return;
  const search=(document.getElementById("reservationSearch")?.value||"").toLowerCase();
  const filter=document.getElementById("reservationFilter")?.value||"all";
  const rows=reservations.filter(r=>(filter==="all"||r.status===filter)&&r.name.toLowerCase().includes(search));
  tbody.innerHTML=rows.map(r=>`
    <tr><td>${escapeHtml(r.name)}</td><td>${formatDate(r.date)}</td><td>${r.time}</td><td>${r.guests}</td><td>${escapeHtml(r.table)}</td><td><span class="status ${r.status}">${r.status.toUpperCase()}</span></td><td><button class="row-action" onclick="deleteReservation(${r.id})">REMOVE</button></td></tr>`).join("")||`<tr><td colspan="7">No reservations found.</td></tr>`;
  const metric=document.getElementById("reservationMetric");if(metric)metric.textContent=reservations.length;
}
function renderRecentReservations(){
  const tbody=document.getElementById("recentReservations");if(!tbody)return;
  tbody.innerHTML=reservations.slice(0,5).map(r=>`<tr><td>${escapeHtml(r.name)}</td><td>${r.time}</td><td>${r.guests}</td><td>${escapeHtml(r.table)}</td><td><span class="status ${r.status}">${r.status.toUpperCase()}</span></td></tr>`).join("");
}
function openReservationModal(){
  document.getElementById("reservationForm").reset();
  document.getElementById("guestDate").value=new Date().toISOString().slice(0,10);
  document.getElementById("reservationModal").classList.add("open");
}
function saveReservation(e){
  e.preventDefault();
  reservations.push({
    id:Date.now(),
    name:document.getElementById("guestName").value.trim(),
    date:document.getElementById("guestDate").value,
    time:document.getElementById("guestTime").value,
    guests:Number(document.getElementById("guestCount").value),
    table:document.getElementById("guestTable").value.trim(),
    status:document.getElementById("guestStatus").value
  });
  closeModal("reservationModal");renderReservations();renderRecentReservations();toast("Reservation created");
}
function deleteReservation(id){
  if(!confirm("Remove this reservation?"))return;
  reservations=reservations.filter(x=>x.id!==id);renderReservations();renderRecentReservations();toast("Reservation removed");
}

function renderTables(){
  const grid=document.getElementById("tablesGrid");if(!grid)return;
  const states=["occupied","occupied","available","reserved","occupied","available","occupied","occupied","available","occupied","reserved","available","occupied","occupied","available","occupied"];
  grid.innerHTML=states.map((state,i)=>`<div class="table-tile ${state}"><strong>T-${String(i+1).padStart(2,"0")}</strong><span>${state==="occupied"?"Guests dining":state==="reserved"?"Reserved":"Available"}</span><span class="table-status">${state.toUpperCase()}</span></div>`).join("");
}
function renderServiceList(){
  const el=document.getElementById("serviceList");if(!el)return;
  const data=[["19:00","Rahul Mehta","2 guests · T-04","CONFIRMED"],["19:30","Sarah Patel","4 guests · T-08","SEATED"],["20:00","Arjun Shah","3 guests · T-12","CONFIRMED"],["20:30","Neha Desai","2 guests · T-03","PENDING"],["21:00","Vikram Joshi","6 guests · T-16","CONFIRMED"]];
  el.innerHTML=data.map(x=>`<div class="service-item"><span class="service-time">${x[0]}</span><div><strong>${x[1]}</strong><small>${x[2]}</small></div><b>${x[3]}</b></div>`).join("");
}
function renderGuestChart(){
  const el=document.getElementById("guestChart");if(!el)return;
  const vals=[82,85,88,87,91,90,94,93,95,94,97,94.8];
  const months=["DEC","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV"];
  el.innerHTML=vals.map((v,i)=>`<div class="bar" style="height:${Math.max(12,(v-70)*5)}px"><span>${v}</span><small>${months[i]}</small></div>`).join("");
}
function closeModal(id){document.getElementById(id)?.classList.remove("open")}
function formatDate(value){const d=new Date(value+"T00:00:00");return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}

document.addEventListener("DOMContentLoaded",()=>{initLogin();initAdmin()});
