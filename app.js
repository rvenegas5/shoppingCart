document.addEventListener('DOMContentLoaded', () => {
  const cards = document.getElementById('cards');
  const items = document.getElementById('items');
  const footer = document.getElementById('footer');
  const templateCard = document.getElementById('template-card').content;
  const templateFooter = document.getElementById('template-footer').content;
  const templateCart = document.getElementById('template-cart').content;

  const fragment = document.createDocumentFragment();
  let shoppingCart = {}

  const fetchData = async() => {
    try {
      const res = await fetch('./resources/api.json');
      const data = await res.json();
      showCards(data);
    } catch (error) {
      console.log(error);
    }
  };

  const showCards = data => {
    data.forEach(product => {
      templateCard.querySelector('h5').textContent = product.title;
      templateCard.querySelector('p').textContent = product.precio;
      templateCard.querySelector('img').setAttribute('src', product.thumbnailUrl);
      templateCard.querySelector('.btn-dark').dataset.id = product.id;
      const clone = templateCard.cloneNode(true);
      fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
  };
  
  cards.addEventListener('click', event =>{
    addToCart(event);
  });

  const addToCart = event => {
    if (event.target.classList.contains('btn-dark')){
      setCart(event.target.parentElement);
    };
    event.stopPropagation();
  }

  const setCart = cart => {
    const product = {
      id: cart.querySelector('.btn-dark').dataset.id,
      title: cart.querySelector('h5').textContent,
      price: parseFloat(cart.querySelector('p').textContent), 
      amount: 1
    };
    if(shoppingCart.hasOwnProperty(product.id)){
      product.amount = shoppingCart[product.id].amount + 1;
    }

    shoppingCart[product.id] = {...product};
    showCart();
  };

  const showCart = () => {
    items.innerHTML = '';
    Object.values(shoppingCart).forEach(product => {
      templateCart.querySelector('th').textContent = product.id;
      templateCart.querySelectorAll('td')[0].textContent = product.title;
      templateCart.querySelectorAll('td')[1].textContent = product.amount;
      templateCart.querySelector('.btn-info').dataset.id = product.id;
      templateCart.querySelector('.btn-danger').dataset.id = product.id;
      templateCart.querySelector('span').textContent = product.amount * product.price;
      const clone = templateCart.cloneNode(true);
      fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    showFooter();
  };

  const showFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(shoppingCart).length === 0){
      footer.innerHTML = ' <th scope="row" colspan="5">Empty cart - Start Shopping!</th>';
    }
    const nQuantity = Object.values(shoppingCart).reduce((count, {amount}) =>
      count + amount, 0);

    const nPrice = Object.values(shoppingCart).reduce((count, {amount, price}) =>
      count + amount * price, 0);
    console.log(nQuantity, nPrice);
    templateFooter.querySelectorAll('td')[0].textContent = nQuantity;
    templateFooter.querySelector('span').textContent = nPrice;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);
  };
  fetchData();
});