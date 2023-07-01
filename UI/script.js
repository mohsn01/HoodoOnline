document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', handleProductFormSubmit);
  
    fetchProducts();
  });
  
  function fetchProducts() {
    fetch('/api/products')
      .then(response => response.json())
      .then(products => {
        displayProducts(products);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  
  function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
  
    products.forEach(product => {
      const listItem = document.createElement('li');
      listItem.textContent = `${product.name} - $${product.price}`;
      productList.appendChild(listItem);
    });
  }
  
  function handleProductFormSubmit(event) {
    event.preventDefault();
  
    const nameInput = document.getElementById('name-input');
    const priceInput = document.getElementById('price-input');
    const categoryInput = document.getElementById('category-input');
  
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const category = categoryInput.value;
  
    if (!name || !price || !category) {
      // Display error message if any of the fields are empty
      alert('Please fill in all the fields');
      return;
    }
  
    const productData = {
      name,
      price,
      category
    };
  
    createProduct(productData);
  }
  
  function createProduct(productData) {
    fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Product created:', data);
        resetProductForm();
        fetchProducts();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  function fetchCartItems() {
    fetch('/api/cart')
      .then(response => response.json())
      .then(cartItems => {
        displayCartItems(cartItems);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  function addToCart(productId) {
    fetch(`/api/cart/${productId}`, {
      method: 'POST'
    })
      .then(response => response.json())
      .then(cartItem => {
        console.log('Product added to cart:', cartItem);
        fetchCartItems();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  function updateCartItemQuantity(cartItemId, quantity) {
    fetch(`/api/cart/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
    })
      .then(response => response.json())
      .then(updatedCartItem => {
        console.log('Cart item quantity updated:', updatedCartItem);
        fetchCartItems();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  function placeOrder(orderData) {
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
      .then(response => response.json())
      .then(order => {
        console.log('Order placed:', order);
        clearCart();
        // Display success message or navigate to the order confirmation page
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  
  function resetProductForm() {
    document.getElementById('name-input').value = '';
    document.getElementById('price-input').value = '';
    document.getElementById('category-input').value = '';
  }
  
  // Additional form validation examples
  
  function validateEmail() {
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
  
    if (!email) {
      // Display error message if email field is empty
      alert('Please enter your email');
      return false;
    }
  
    // Perform additional email validation logic
    // ...
    return true;
  }
  
  function validatePassword() {
    const passwordInput = document.getElementById('password-input');
    const password = passwordInput.value.trim();
  
    if (!password || password.length < 8) {
      // Display error message if password is empty or less than 8 characters
      alert('Please enter a password of at least 8 characters');
      return false;
    }
  
    // Perform additional password validation logic
    // ...
    return true;
  }
  