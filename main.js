const products = document.querySelector('.products');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartTotalPay = document.getElementById('cart-total-pay');
let cartItemID = 1;

eventListeners();

function eventListeners() {
  window.addEventListener('DOMContentLoaded', () => {
    loadJSON();
    loadCart();
  });

  products.addEventListener('click', purchaseProduct);
  cartList.addEventListener('click', deleteProduct);
}

function updateCartInfo() {
  let cartInfo = findCartInfo();
  cartTotalValue.textContent = cartInfo.total;
  cartTotalPay.textContent = cartInfo.total;
}

updateCartInfo();

function loadJSON() {
  fetch('shop.json')
    .then((response) => response.json())
    .then((data) => {
      let html = '';
      data.forEach((product) => {
        html += `
            <div class="card">
                <div class="card-img">
                    <img
                        src=${product.imgURL}
                        alt=""
                    />
                </div>
                <div class="title-price">
                <h3 class="product-name">${product.name}</h3>
                <h3 class="product-price">BDT ${product.price}</h3>
                </div>
            </div>
        `;
      });
      products.innerHTML = html;
    })
    .catch((err) => {
      alert('Use Live Server or Local Server');
    });
}

function purchaseProduct(e) {
  if (e.target.parentElement.parentElement.classList.contains('card')) {
    let product = e.target.parentElement.parentElement;
    getProductInfo(product);
  }
}

function getProductInfo(product) {
  let productInfo = {
    id: cartItemID,
    imgSrc: product.querySelector('.card-img img').src,
    name: product.querySelector('.product-name').textContent,
    price: product.querySelector('.product-price').textContent,
  };
  cartItemID++;
  addToCartList(productInfo);
  saveProductInStorage(productInfo);
}

function addToCartList(product) {
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');
  cartItem.setAttribute('data-id', `${product.id}`);
  cartItem.innerHTML = `
      <table>
      <tr>
        <td class="image">
          <img src=${product.imgSrc} alt="" />
        </td>
        <td class="name">${product.name}</td>
        <td class="price">${product.price}</td>
        <td class="delete"><i class="fas fa-trash"></i></td>
      </tr>
    </table>
  `;
  cartList.appendChild(cartItem);
}

function saveProductInStorage(item) {
  let products = getProductFromStorage();
  products.push(item);
  localStorage.setItem('products', JSON.stringify(products));
  updateCartInfo();
}

function getProductFromStorage() {
  return localStorage.getItem('products')
    ? JSON.parse(localStorage.getItem('products'))
    : [];
}

function loadCart() {
  let products = getProductFromStorage();
  products.forEach((product) => addToCartList(product));
}

function findCartInfo() {
  let products = getProductFromStorage();
  let total = products.reduce((acc, product) => {
    let price = parseFloat(product.price.substr(3));
    return (acc += price);
  }, 0);

  return {
    total: total.toFixed(2),
    productCount: products.length,
  };
}

function deleteProduct(e) {
  let cartItem;
  const id = Number(e.target.closest('.cart-item').getAttribute('data-id'));

  if (e.target.className === 'delete') {
    cartItem = e.target.parentElement;
    cartItem.remove();
  } else if (e.target.tagName === 'I') {
    cartItem = e.target.parentElement.parentElement;
    cartItem.remove();
  }

  let products = getProductFromStorage();
  let updatedProducts = products.filter((product) => {
    return product.id !== id;
  });

  localStorage.setItem('products', JSON.stringify(updatedProducts));

  updateCartInfo();
}
