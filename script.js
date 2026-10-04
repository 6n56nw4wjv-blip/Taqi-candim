const products=[
{id:1,name:"کرم مرطوب‌کننده بانوان",cat:"skincare",price:450,emoji:"🧴",desc:"مراقبت و نرمی پوست"},
{id:2,name:"شامپو مراقبت مو",cat:"haircare",price:520,emoji:"🫧",desc:"مناسب استفاده روزانه"},
{id:3,name:"محصول بهداشت بانوان",cat:"hygiene",price:380,emoji:"🌸",desc:"بهداشت و مراقبت شخصی"},
{id:4,name:"ماسک مراقبت پوست",cat:"skincare",price:300,emoji:"🧖‍♀️",desc:"مراقبت ویژه از پوست"},
{id:5,name:"روغن مراقبت مو",cat:"haircare",price:650,emoji:"✨",desc:"برای لطافت و درخشندگی"},
{id:6,name:"لوسیون بدن",cat:"skincare",price:490,emoji:"🌷",desc:"پوست نرم و خوش‌بو"},
{id:7,name:"محصول مراقبت شخصی",cat:"hygiene",price:420,emoji:"🎀",desc:"انتخابی برای بانوان"},
{id:8,name:"ست زیبایی بانوان",cat:"beauty",price:890,emoji:"💄",desc:"ست کاربردی و شیک"}
];
let cart=JSON.parse(localStorage.getItem("taqiCart")||"[]"), activeCat="all";

const grid=document.getElementById("productsGrid"), search=document.getElementById("search");
function money(n){return n.toLocaleString("fa-AF")+" افغانی"}
function renderProducts(){
 const q=search.value.trim().toLowerCase();
 const list=products.filter(p=>(activeCat==="all"||p.cat===activeCat)&&(!q||p.name.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)));
 grid.innerHTML=list.length?list.map(p=>`<article class="product"><div class="product-img">${p.emoji}</div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart(${p.id})">افزودن +</button></div></article>`).join(""):`<p>محصولی پیدا نشد.</p>`;
}
function addToCart(id){const x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});save();toast("محصول به سبد خرید اضافه شد 🌷")}
function save(){localStorage.setItem("taqiCart",JSON.stringify(cart));renderCart();document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0)}
function renderCart(){
 const el=document.getElementById("cartItems");
 if(!cart.length){el.innerHTML='<div style="text-align:center;color:#766b71;padding:50px 10px">سبد خرید خالی است 🛒</div>';document.getElementById("cartTotal").textContent="0 افغانی";return}
 el.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-row"><div class="emoji">${p.emoji}</div><div class="grow"><b>${p.name}</b><br><small>${money(p.price)}</small></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> ${i.qty} <button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join("");
 document.getElementById("cartTotal").textContent=money(cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0));
}
function changeQty(id,d){const x=cart.find(i=>i.id===id);x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save()}
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2200)}

document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
search.oninput=renderProducts;
document.querySelectorAll("#categories button").forEach(b=>b.onclick=()=>{document.querySelectorAll("#categories button").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeCat=b.dataset.cat;renderProducts()});
document.getElementById("checkoutBtn").onclick=()=>{
 if(!cart.length){toast("سبد خرید خالی است");return}
 document.getElementById("checkoutModal").classList.add("show");
};
document.getElementById("closeModal").onclick=()=>document.getElementById("checkoutModal").classList.remove("show");
document.getElementById("orderForm").onsubmit=e=>{
 e.preventDefault();
 const data=new FormData(e.target);
 const order=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `${p.name} × ${i.qty} = ${money(p.price*i.qty)}`}).join("\n");
 const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
 alert(`سفارش شما ثبت شد!\n\nنام: ${data.get("name")}\nشماره: ${data.get("phone")}\nآدرس: ${data.get("address")}\n\n${order}\n\nمجموع: ${money(total)}\n\nدر نسخه نهایی می‌توان این بخش را به واتساپ، دیتابیس یا پنل مدیریت وصل کرد.`);
 cart=[];save();e.target.reset();document.getElementById("checkoutModal").classList.remove("show");closeCart();
};
renderProducts();save();
