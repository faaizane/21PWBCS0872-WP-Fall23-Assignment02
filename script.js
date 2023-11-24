// Fetching data fromm json file
        const jsonFilePath = 'books.json';
        function fetchBookCategories() {
            fetch(jsonFilePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const categories = new Set();

                    data.forEach(book => {
                        if (book.category) {
                            categories.add(book.category);
                        }
                    });

                    const categorySelect = document.getElementById('category-select');
                    categories.forEach(category => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('nav-item');

                        const link = document.createElement('a');
                        link.classList.add('nav-link');
                        link.href = `categories.html#${category.replace(/\s+/g, '')}`;
                        link.textContent = category;

                        listItem.appendChild(link);
                        categorySelect.appendChild(listItem);
                    });
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        }

        document.addEventListener('DOMContentLoaded', function() {
            fetchBookCategories();
        });

let cart = [];

fetch('books.json')
  .then(response => response.json())
  .then(data => {
    const bookListContainer = document.getElementById('bookList');

    data.forEach(book => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4 card-css';

      card.innerHTML = `
        <div class="card h-100">
          <img src="${book.cover_image}" class="card-img-top h-100" alt="${book.title}">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">${book.description}</p>
            <p class="card-text"><strong>Author:</strong> ${book.author}</p>
            <p class="card-text"><strong>Price:</strong> $${book.price}</p>
            <button class="btn btn-primary btn-sm" onclick="addToCart('${book.title}', '${book.author}', ${book.price})">Add to Cart</button>
            <button class="btn btn-primary" onclick="viewCart()">View Cart</button>
          </div>
        </div>
      `;

      bookListContainer.appendChild(card);
    });
  })
  .catch(error => console.error('Error fetching data:', error));

function addToCart(title, author, price) {
  const book = { title, author, price };
  cart.push(book);
  alert(`Added ${title} to the cart!`);

  updateLocalStorageCart();
}

function updateLocalStorageCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function viewCart() {
  window.location.href = 'cart.html';
}

function addBookToCart(title, price) {
  const cartItem = { title, price, quantity: 1 };
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cartItems.find(item => item.title === title);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push(cartItem);
  }

  localStorage.setItem('cart', JSON.stringify(cartItems));
  cart = cartItems;

  alert(`"${title}" added to the cart!`);
}

//JS for Cart Page
document.addEventListener('DOMContentLoaded', function () {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  displayCartItems(cartItems);
});

function displayCartItems(cartItems) {
  let totalBill = 0;
  const cartItemsContainer = $('#cartItems');
  cartItemsContainer.empty();

  cartItems.forEach(item => {
    const itemTotalPrice = item.price * item.quantity;
    totalBill += itemTotalPrice;

    const itemHTML = `
      <div class="card mb-2">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">Price: $${item.price} each</p>
          <p class="card-text">Quantity: <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(this, '${item.title}', ${item.price})"></p>
          <p class="card-text">Total: $${itemTotalPrice}</p>
          <button class="btn btn-danger" onclick="removeFromCart('${item.title}', ${item.price})">Remove</button>
        </div>
      </div>`;
    cartItemsContainer.append(itemHTML);
  });

  const totalBillHTML = `<p>Total Bill: $${totalBill}</p>`;
  $('#totalBill').html(totalBillHTML);
}

function updateQuantity(input, title, price) {
  const quantity = parseInt(input.value, 10);
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  const cartItem = cartItems.find(item => item.title === title);

  if (cartItem) {
    cartItem.quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCartItems(cartItems);
  }
}

function removeFromCart(title, price) {
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems = cartItems.filter(item => item.title !== title);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  displayCartItems(cartItems);
}

function proceedToPayment() {
  window.location.href = 'payment.html';
}

function addToCart(title, author, price) {
  const book = { title, author, price, quantity: 1 };
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cartItems.find(item => item.title === title);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push(book);
  }

  localStorage.setItem('cart', JSON.stringify(cartItems));
  displayCartItems(cartItems);

  alert(`"${title}" added to the cart!`);
}

//JS for payment page
document.addEventListener('DOMContentLoaded', function () {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  displayReceipt(cartItems);
  displayGrandTotal(cartItems);
});

function displayReceipt(cartItems) {
  const receiptContainer = $('#receipt');
  receiptContainer.empty();

  cartItems.forEach(item => {
    const itemTotalPrice = item.price * item.quantity;

    const receiptItemHTML = `
      <div class="row">
        <div class="col-6">
          <strong>Title:</strong> ${item.title}<br>
          <strong>Author:</strong> ${item.author}<br>
        </div>
        <div class="col-6">
          <strong>Price:</strong> $${item.price} each<br>
          <strong>Quantity:</strong> ${item.quantity}<br>
          <strong>Total Price:</strong> $${itemTotalPrice}<br>
        </div>
      </div>
      <hr>`;
    receiptContainer.append(receiptItemHTML);
  });
}

function displayGrandTotal(cartItems) {
  const grandTotalContainer = $('#grandTotal');
  const totalBill = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const grandTotalHTML = `<p><strong>Grand Total:</strong> $${totalBill}</p>`;
  grandTotalContainer.html(grandTotalHTML);
}