/* PENNY BLOOM — funcionalidades do template
   Edite o catálogo abaixo para personalizar os produtos da loja. */
const PRODUCTS = [
 {id:"base-velvet",name:"Base Velvet Skin",category:"rosto",categoryLabel:"Rosto",price:69.90,description:"Cobertura confortável com acabamento natural para acompanhar sua rotina.",image:"https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=900&q=85",badge:"Queridinha",featured:true},
 {id:"blush-pop",name:"Blush Pop! Terracota",category:"rosto",categoryLabel:"Rosto",price:39.90,description:"Um toque de cor fácil de construir, do leve ao mais vibrante.",image:"https://cdn.divacosmeticos.com.br/produtos/produto_61789_1_d7b769c420.jpeg",badge:"Mais vendido",featured:true},
 {id:"iluminador-glow",name:"Iluminador Glow Party",category:"rosto",categoryLabel:"Rosto",price:49.90,description:"Brilho luminoso para acender a make em qualquer ocasião.",image:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85",badge:"Novo",featured:true},
 {id:"batom-cherry",name:"Batom Cherry Bomb",category:"labios",categoryLabel:"Lábios",price:34.90,description:"Vermelho intenso com textura cremosa e personalidade de sobra.",image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85",badge:"Queridinho",featured:true},
 {id:"gloss-jelly",name:"Gloss Jelly Shine",category:"labios",categoryLabel:"Lábios",price:29.90,description:"Brilho espelhado e sensação confortável para usar sem pensar duas vezes.",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",badge:"Brilho extra",featured:true},
 {id:"lip-tint",name:"Lip Tint Framboesa",category:"labios",categoryLabel:"Lábios",price:27.90,description:"Cor suave e construível para um efeito coradinho e descomplicado.",image:"https://images.unsplash.com/photo-1591360236480-4ed861025fa1?auto=format&fit=crop&w=900&q=85",badge:"",featured:false},
 {id:"paleta-confete",name:"Paleta Confete",category:"olhos",categoryLabel:"Olhos",price:79.90,description:"Tons divertidos para misturar, combinar e inventar novas versões.",image:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85",badge:"Colorida",featured:true},
 {id:"mascara-volume",name:"Máscara Volume Uau",category:"olhos",categoryLabel:"Olhos",price:42.90,description:"Definição e volume para destacar o olhar do seu jeito.",image:"https://images.unsplash.com/photo-1631214540242-7f9b3b1f3c0c?auto=format&fit=crop&w=900&q=85",badge:"",featured:false},
 {id:"pincel-duo",name:"Duo de Pincéis",category:"acessorios",categoryLabel:"Acessórios",price:35.90,description:"Dois pincéis versáteis para espalhar, esfumar e criar sem complicação.",image:"https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=85",badge:"Prático",featured:true},
 {id:"necessaire",name:"Nécessaire Color Pop",category:"acessorios",categoryLabel:"Acessórios",price:45.90,description:"Seu kit favorito sempre por perto, com um toque extra de personalidade.",image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",badge:"",featured:false}
];

const money = value => Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let cart = readCart();
let toastTimer;

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("penny-bloom-cart") || "[]");
    return Array.isArray(saved) ? saved.filter(item => item && PRODUCTS.some(product => product.id === item.id) && Number(item.quantity) > 0) : [];
  } catch { return []; }
}
function saveCart() { localStorage.setItem("penny-bloom-cart", JSON.stringify(cart)); }
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function addToCart(id) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart(); renderCart(); showToast(`${product.name} foi adicionado ao carrinho.`);
}
function changeQuantity(id, amount) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== id);
  saveCart(); renderCart();
}
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart(); renderCart(); showToast("Produto removido do carrinho.");
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElement = $("#cart-count");
  if (countElement) countElement.textContent = count;
  const itemsElement = $("#cart-items");
  const emptyElement = $("#cart-empty");
  const footer = $("#drawer-footer");
  if (!itemsElement) return;
  const total = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(product => product.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  itemsElement.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(product => product.id === item.id);
    if (!product) return "";
    return `<article class="cart-line">
      <img src="${product.image}" alt="">
      <div class="cart-line-info"><a href="produto.html?id=${product.id}">${product.name}</a><strong>${money(product.price)}</strong>
        <div class="quantity-control"><button data-quantity="${product.id}" data-change="-1" aria-label="Diminuir quantidade">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-change="1" aria-label="Aumentar quantidade">+</button></div>
      </div><button class="remove-item" data-remove="${product.id}" aria-label="Remover ${product.name}"><i class="bx bx-trash"></i></button>
    </article>`;
  }).join("");
  if (emptyElement) emptyElement.hidden = cart.length > 0;
  if (footer) footer.hidden = cart.length === 0;
  const totalElement = $("#cart-total");
  if (totalElement) totalElement.textContent = money(total);
}
function openCart() {
  $("#cart-drawer")?.classList.add("is-open");
  $("#cart-backdrop")?.classList.add("is-visible");
  $("#cart-drawer")?.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}
function closeCart() {
  $("#cart-drawer")?.classList.remove("is-open");
  $("#cart-backdrop")?.classList.remove("is-visible");
  $("#cart-drawer")?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}
function productCard(product) {
  return `<article class="product-card">
    <a class="product-image-wrap" href="produto.html?id=${product.id}">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      <span class="quick-view">Ver detalhes <i class="bx bx-right-arrow-alt"></i></span>
    </a>
    <div class="product-info"><span class="product-category">${product.categoryLabel}</span><h3><a href="produto.html?id=${product.id}">${product.name}</a></h3><p>${product.description}</p><div class="product-card-bottom"><strong>${money(product.price)}</strong><button class="add-button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao carrinho"><i class="bx bx-plus"></i><span>Adicionar</span></button></div></div>
  </article>`;
}
function renderProducts() {
  const grid = $("#products-grid");
  if (!grid) return;
  const pageCategory = document.body.dataset.category;
  const search = ($("#catalog-search")?.value || new URLSearchParams(location.search).get("q") || "").trim().toLocaleLowerCase("pt-BR");
  const selectedCategories = $$('input[name="category"]:checked').map(input => input.value);
  const selectedPrices = $$('input[name="price"]:checked').map(input => input.value);
  let results = PRODUCTS.filter(product => {
    const matchesCategory = pageCategory ? product.category === pageCategory : (!selectedCategories.length || selectedCategories.includes(product.category));
    const matchesPrice = !selectedPrices.length || selectedPrices.some(range => {
      const [min, max] = range.split("-").map(Number);
      return product.price >= min && product.price <= max;
    });
    const matchesSearch = !search || `${product.name} ${product.description} ${product.categoryLabel}`.toLocaleLowerCase("pt-BR").includes(search);
    return matchesCategory && matchesPrice && matchesSearch;
  });
  const sort = $("#sort-select")?.value || "featured";
  if (sort === "price-asc") results.sort((a,b) => a.price-b.price);
  if (sort === "price-desc") results.sort((a,b) => b.price-a.price);
  if (sort === "name") results.sort((a,b) => a.name.localeCompare(b.name, "pt-BR"));
  if (sort === "newest") results.reverse();
  if (sort === "featured") results.sort((a,b) => Number(b.featured)-Number(a.featured));
  grid.innerHTML = results.map(productCard).join("");
  const count = $("#results-count");
  if (count) count.textContent = `${results.length} ${results.length === 1 ? "produto encontrado" : "produtos encontrados"}`;
  const empty = $("#empty-state");
  if (empty) empty.hidden = results.length > 0;
  grid.hidden = results.length === 0;
}
function setupCatalog() {
  if (!$("#products-grid")) return;
  const category = document.body.dataset.category;
  if (category) {
    const info = {
      rosto: ["Rosto", "Bases, blushes, iluminadores e tudo para criar a sua tela."],
      labios: ["Lábios", "Batom, gloss e lip tint para deixar sua marca por onde passar."],
      olhos: ["Olhos", "Sombras, máscaras e delineadores para brincar com o olhar."],
      acessorios: ["Acessórios", "Pincéis, nécessaires e pequenos aliados da sua criatividade."]
    }[category];
    if (info) {
      document.title = `${info[0]} | PENNY BLOOM`;
      if ($("#category-title")) $("#category-title").textContent = info[0];
      if ($("#category-description")) $("#category-description").textContent = info[1];
      if ($("#category-heading")) $("#category-heading").textContent = `Nossa seleção de ${info[0].toLocaleLowerCase("pt-BR")}`;
    }
  }
  $("#catalog-search")?.addEventListener("input", renderProducts);
  $("#sort-select")?.addEventListener("change", renderProducts);
  $$('input[name="category"], input[name="price"]').forEach(input => input.addEventListener("change", renderProducts));
  $("#clear-filters")?.addEventListener("click", clearFilters);
  $("#reset-empty")?.addEventListener("click", clearFilters);
  const query = new URLSearchParams(location.search).get("q");
  if (query && $("#catalog-search")) $("#catalog-search").value = query;
  renderProducts();
}
function clearFilters() {
  $$('input[type="checkbox"]').forEach(input => input.checked = false);
  if ($("#catalog-search")) $("#catalog-search").value = "";
  if ($("#sort-select")) $("#sort-select").value = "featured";
  renderProducts();
}
function setupProductPage() {
  const target = $("#product-detail");
  if (!target) return;
  const id = new URLSearchParams(location.search).get("id");
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) {
    target.innerHTML = `<div class="not-found"><span class="eyebrow">OPS, NÃO ENCONTRAMOS</span><h1>Esse encanto não está por aqui.</h1><a class="button button-primary" href="index.html">Voltar para a loja</a></div>`;
    return;
  }
  document.title = `${product.name} | PENNY BLOOM`;
  target.innerHTML = `<a class="back-link" href="${product.category}.html"><i class="bx bx-left-arrow-alt"></i> Voltar para ${product.categoryLabel.toLocaleLowerCase("pt-BR")}</a>
    <div class="product-detail-grid"><div class="detail-image"><img src="${product.image}" alt="${product.name}"></div><div class="detail-copy"><span class="eyebrow">${product.categoryLabel}</span><h1>${product.name}</h1><strong class="detail-price">${money(product.price)}</strong><p>${product.description}</p><p class="detail-note"><i class="bx bx-leaf"></i> Um pequeno detalhe para deixar seus momentos mais especiais.</p><button class="button button-primary" data-add="${product.id}">Adicionar ao carrinho <i class="bx bx-shopping-bag"></i></button><div class="detail-benefits"><span><i class="bx bx-package"></i> Informações de envio sob consulta</span><span><i class="bx bx-heart"></i> Escolhido com carinho</span></div></div></div>`;
}
function setupNavigation() {
  const here = location.pathname.split("/").pop() || "index.html";
  $$("#nav-menu a").forEach(link => link.classList.toggle("active", link.getAttribute("href") === here));
  $("#mobile-toggle")?.addEventListener("click", () => {
    const nav = $("#nav-menu");
    const isOpen = nav?.classList.toggle("is-open");
    $("#mobile-toggle")?.setAttribute("aria-expanded", String(Boolean(isOpen)));
    $("#mobile-toggle i")?.classList.toggle("bx-menu", !isOpen);
    $("#mobile-toggle i")?.classList.toggle("bx-x", Boolean(isOpen));
  });
  $("#nav-menu")?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => $("#nav-menu").classList.remove("is-open")));
  $("#search-toggle")?.addEventListener("click", () => {
    const bar = $("#search-form");
    bar?.classList.toggle("is-open");
    if (bar?.classList.contains("is-open")) $("#search-input")?.focus();
  });
  $("#search-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const query = $("#search-input")?.value.trim();
    if (query) location.href = `index.html?${new URLSearchParams({q: query}).toString()}#colecao`;
  });
  $$("[data-open-cart]").forEach(button => button.addEventListener("click", openCart));
  $("#close-cart")?.addEventListener("click", closeCart);
  $("#cart-backdrop")?.addEventListener("click", closeCart);
  $("#continue-shopping")?.addEventListener("click", closeCart);
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
}
function setupNewsletter() {
  $("#newsletter-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const message = $("#newsletter-message");
    if (message) message.textContent = "Cadastro demonstrativo realizado! Conecte um serviço de e-mail para receber inscrições.";
    $("#newsletter-email").value = "";
  });
}
document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);
  const quantity = event.target.closest("[data-quantity]");
  if (quantity) changeQuantity(quantity.dataset.quantity, Number(quantity.dataset.change));
  const remove = event.target.closest("[data-remove]");
  if (remove) removeFromCart(remove.dataset.remove);
});
$("#checkout-button")?.addEventListener("click", () => showToast("Checkout demonstrativo. Integre um meio de pagamento para receber pedidos."));
$("#current-year") && ($("#current-year").textContent = new Date().getFullYear());
setupNavigation();
setupCatalog();
setupProductPage();
setupNewsletter();
renderCart();
// Carrossel do hero com troca automática e transição em fade.
function setupHeroSlider(){
 const slides=$$(".hero-slide"),dots=$$(".hero-dots button");
 if(!slides.length)return;
 let active=0,timer;
 const show=i=>{active=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle("is-active",n===active));dots.forEach((d,n)=>d.classList.toggle("is-active",n===active));};
 const restart=()=>{clearInterval(timer);timer=setInterval(()=>show(active+1),6000);};
 $(".hero-next")?.addEventListener("click",()=>{show(active+1);restart();});
 $(".hero-prev")?.addEventListener("click",()=>{show(active-1);restart();});
 dots.forEach(d=>d.addEventListener("click",()=>{show(Number(d.dataset.goSlide));restart();}));
 restart();
}
// Fade-in dos blocos conforme entram na área visível.
function setupScrollReveal(){
 const items=$$(".section-heading,.category-card,.product-card,.story-copy,.story-image,.values-grid article,.testimonial-grid blockquote,.newsletter-section > div,.newsletter-form");
 items.forEach((el,i)=>{el.classList.add("reveal");el.style.setProperty("--reveal-delay",`${(i%4)*85}ms`);});
 if(!("IntersectionObserver" in window)){items.forEach(el=>el.classList.add("is-visible"));return;}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:"0px 0px -35px 0px"});
 items.forEach(el=>observer.observe(el));
}
setupHeroSlider();
setupScrollReveal();
