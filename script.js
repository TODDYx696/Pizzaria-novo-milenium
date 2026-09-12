const WHATSAPP = '5511962248186';
const images = [
  'https://images.unsplash.com/photo-1750680229961-db2374388b77?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=82'
];

const pizzas = [
  [1,'ABOBRINHA','Mussarela, Abobrinha e Alho',51.90,36.90,'vegetarianas'],
  [2,'ALHO','Tomate, Alho e Mussarela',null,null,'vegetarianas'],
  [3,'ALICHE COM MUSSARELA','Aliche, Rodelas de Tomate e Mussarela',51.90,36.90,'classicas'],
  [4,'ALICHE','Molho de Tomate, Aliche, Alho Frito e Parmesão',51.90,36.90,'classicas'],
  [5,'A MODA DA CASA','Frango, Champignon, Molho, Catupiry e Milho',61.90,41.90,'especiais'],
  [6,'A MODA DO CHEFE','Provolone, Presunto, Tomate e Parmesão',51.90,36.90,'especiais'],
  [7,'ATUM','Atum coberto com Cebolas',56.90,39.90,'classicas'],
  [8,'ATUM SÓLIDO ESPECIAL','Atum, Mussarela, Cebola e Tomate',61.90,41.90,'especiais'],
  [9,'BACON','Mussarela, Bacon e Cebola',51.90,36.90,'classicas'],
  [10,'BAIANA','Calabresa Moída, Pimenta, Ovos e Cebola',51.90,36.90,'especiais'],
  [11,'BATATA PALHA','Mussarela e Batata Palha',51.90,36.90,'especiais'],
  [12,'BAURU','Presunto, Mussarela e Tomate',43.90,31.90,'classicas'],
  [13,'BRÓCOLIS','Brócolis Temperado e Mussarela',51.90,36.90,'vegetarianas'],
  [14,'CAIPIRA','Frango, Mussarela e Milho',53.90,41.90,'classicas'],
  [15,'CALABRESA','Calabresa coberta com Cebola',43.90,31.90,'classicas'],
  [16,'CALZONE NOVO MILÊNIO','Lombo Canadense, Ovo, Palmito e Mussarela',51.90,36.90,'especiais'],
  [17,'CAMARÃO COM CATUPIRY','Camarão com Catupiry ou Mussarela',101.90,80.90,'especiais'],
  [18,'CARNE DE SOL','Carne de Sol, Mussarela, Cebola e Brócolis',56.90,36.90,'especiais'],
  [19,'CINCO QUEIJOS','Mussarela, Gorgonzola, Catupiry, Provolone e Parmesão',61.90,41.90,'especiais'],
  [20,'COSTELA','Molho de tomate, Mussarela, Costela desfiada e Cebola',56.90,42.90,'especiais'],
  [21,'COSTELA ESPECIAL','Molho de tomate, Mussarela, Costela desfiada, Cebola e Catupiry',61.90,46.90,'especiais'],
  [22,'ESCAROLA','Escarola temperada coberta com Mussarela',43.90,31.90,'vegetarianas'],
  [23,'FRANGO ESPECIAL','Frango e Catupiry Original',61.90,46.90,'especiais'],
  [24,'GORGONZOLA','Queijo Gorgonzola',51.90,36.90,'vegetarianas'],
  [25,'LARICA','Frango, Catupiry, Presunto, Mussarela e Calabresa',null,null,'especiais'],
  [26,'LOMBO','Lombo Canadense coberto com Catupiry ou Mussarela',51.90,36.90,'especiais'],
  [27,'MUSSARELA','Molho de Tomate e Mussarela',43.90,31.90,'vegetarianas']
].map((p,i)=>({id:p[0],name:p[1],desc:p[2],large:p[3],small:p[4],category:p[5],image:images[i%images.length]}));

let cart = [];
const money = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const menuGrid = document.querySelector('#menuGrid');
const search = document.querySelector('#search');
const emptyState = document.querySelector('#emptyState');

function renderMenu(){
  const q = search.value.trim().toLowerCase();
  const active = document.querySelector('.filter.active')?.dataset.filter || 'todos';
  const list = pizzas.filter(p => (active==='todos'||p.category===active) && (!q || `${p.name} ${p.desc}`.toLowerCase().includes(q)));
  menuGrid.innerHTML = list.map(p => `
    <article class="pizza-card">
      <div class="pizza-image" style="background-image:url('${p.image}')" role="img" aria-label="Foto ilustrativa de pizza"></div>
      <div class="pizza-info">
        <span class="pizza-number">${String(p.id).padStart(2,'0')}</span>
        <h3 class="pizza-title">${p.name}</h3>
        <p class="pizza-desc">${p.desc}</p>
        ${p.large && p.small ? `<div class="price-row">
          <button class="size-option" data-id="${p.id}" data-size="Grande" type="button"><strong>Grande</strong><small>${money(p.large)}</small></button>
          <button class="size-option" data-id="${p.id}" data-size="Broto" type="button"><strong>Broto</strong><small>${money(p.small)}</small></button>
        </div>` : `<div class="price-row"><div class="size-option unavailable"><strong>Preço</strong><small>A confirmar</small></div></div>`}
      </div>
    </article>`).join('');
  emptyState.hidden = list.length !== 0;
}

function addToCart(id,size){
  const p=pizzas.find(x=>x.id===id); const price=size==='Grande'?p.large:p.small;
  const key=`${id}-${size}`; const item=cart.find(x=>x.key===key);
  if(item)item.qty++; else cart.push({key,id,name:p.name,size,price,qty:1});
  updateCart(); openCart(); toast(`${p.name} · ${size} adicionada à sacola`);
}

function updateCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0), total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  document.querySelector('#cartCount').textContent=count; document.querySelector('#floatingCount').textContent=count; document.querySelector('#cartTotal').textContent=money(total);
  const body=document.querySelector('#cartBody');
  body.innerHTML=cart.length?cart.map(x=>`<div class="cart-item"><div><h3>${x.name}</h3><p>${x.size} · ${money(x.price)} cada</p></div><div class="qty"><button data-action="minus" data-key="${x.key}" type="button">−</button><strong>${x.qty}</strong><button data-action="plus" data-key="${x.key}" type="button">+</button></div></div>`).join(''):`<div class="cart-empty">Sua sacola está vazia.<br>Escolha uma pizza no cardápio para começar.</div>`;
}

menuGrid.addEventListener('click',e=>{const b=e.target.closest('.size-option');if(!b||b.disabled)return;addToCart(Number(b.dataset.id),b.dataset.size)});
search.addEventListener('input',renderMenu);
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.filter.active').classList.remove('active');b.classList.add('active');renderMenu()}));

document.querySelector('#cartBody').addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b)return;const item=cart.find(x=>x.key===b.dataset.key);if(!item)return;if(b.dataset.action==='plus')item.qty++;else item.qty--;if(item.qty<=0)cart=cart.filter(x=>x.key!==item.key);updateCart()});

const drawer=document.querySelector('#cartDrawer'), overlay=document.querySelector('#overlay');
function openCart(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');overlay.classList.add('show');document.body.classList.add('lock')}
function closeCart(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');overlay.classList.remove('show');document.body.classList.remove('lock')}
document.querySelector('#openCart').onclick=openCart;document.querySelector('#floatingCart').onclick=openCart;document.querySelector('#closeCart').onclick=closeCart;overlay.onclick=closeCart;

document.querySelector('#orderType').addEventListener('change',e=>{document.querySelector('#addressField').style.display=e.target.value==='delivery'?'grid':'none'});

document.querySelector('#sendOrder').addEventListener('click',()=>{
  if(!cart.length){toast('Adicione pelo menos uma pizza à sacola.');return}
  const name=document.querySelector('#customerName').value.trim(); const phone=document.querySelector('#customerPhone').value.trim(); const type=document.querySelector('#orderType').value; const address=document.querySelector('#customerAddress').value.trim(); const notes=document.querySelector('#notes').value.trim();
  if(!name||!phone||(type==='delivery'&&!address)){toast('Preencha nome, telefone e endereço para entrega.');return}
  const lines=cart.map(x=>`• ${x.qty}x ${x.name} — ${x.size} — ${money(x.price*x.qty)}`).join('\n');
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const msg=`Olá! Quero fazer um pedido na Pizzaria Novo Milênio.\n\n${lines}\n\nTotal dos itens: ${money(total)}\n\nCliente: ${name}\nTelefone: ${phone}\nPedido: ${type==='delivery'?'Entrega':'Retirada'}${type==='delivery'?`\nEndereço: ${address}`:''}${notes?`\nObservações: ${notes}`:''}\n\nPode confirmar meu pedido, por favor?`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
});

function toast(text){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=text;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
document.querySelector('#year').textContent=new Date().getFullYear();
renderMenu();updateCart();
