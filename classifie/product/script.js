const productForm = document.getElementById('productForm');
const productContainer = document.getElementById('productContainer');
const categoryFilter = document.getElementById('categoryFilter');

let products = JSON.parse(localStorage.getItem('products')) || [];

// Function to add product
function addProduct(name, description, price, category, imageSrc, rating) {
    const product = {
        name,
        description,
        price,
        category,
        imageSrc,
        rating,
    };

    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
}

// Function to display products
function displayProducts(filterCategory = 'all') {
    productContainer.innerHTML = '';

    products
        .filter(product => filterCategory === 'all' || product.category === filterCategory)
        .forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            // Add product details
            productCard.innerHTML = `
                <img src="${product.imageSrc}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
                <div class="rating">Rating: ${'★'.repeat(product.rating)}</div>
            `;

            productContainer.appendChild(productCard);
        });
}

// Event listener for the form submission
productForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const productCategory = document.getElementById('productCategory').value;
    const productRating = document.getElementById('productRating').value;
    const productImage = document.getElementById('productImage').files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
        const imageSrc = event.target.result;
        addProduct(productName, productDescription, productPrice, productCategory, imageSrc, productRating);
    };

    reader.readAsDataURL(productImage);
    productForm.reset();
});

// Event listener for category filter
categoryFilter.addEventListener('change', function () {
    displayProducts(categoryFilter.value);
});

// Display products on page load
window.onload = function () {
    displayProducts();
};
