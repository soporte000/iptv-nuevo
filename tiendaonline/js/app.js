// Variable global para almacenar los productos cargados
let products = [];
let cart = [];

// Inicializar la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    cargarProductosDesdeCSV();
});

// Función para cargar productos desde el archivo CSV (Excel)
function cargarProductosDesdeCSV() {
    fetch('productos.csv')
        .then(response => response.text())
        .then(csvData => {
            // PapaParse convierte el texto CSV en un objeto JS
            Papa.parse(csvData, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                delimiter: "", // Auto-detectar delimitador (; o ,)
                complete: function(results) {
                    products = results.data;
                    renderProducts();
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar el CSV:', error);
            alert('No se pudo cargar la base de datos de productos.');
        });
}

// Renderizar productos en el DOM
function renderProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p>No hay productos disponibles.</p></div>';
        return;
    }

    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="price-tag">${parseFloat(product.price).toFixed(2)} Bs.</span>
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                            <i class="bi bi-cart-plus"></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Añadir al carrito
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        cart.push(product);
        updateCartUI();
    }
}

// Eliminar del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Actualizar la interfaz del carrito
function updateCartUI() {
    document.getElementById('cart-count').textContent = cart.length;
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    let total = 0;

    cart.forEach((item, index) => {
        total += parseFloat(item.price);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${parseFloat(item.price).toFixed(2)} Bs.</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
    });

    document.getElementById('cart-total').textContent = `${total.toFixed(2)} Bs.`;
}

// Función de Checkout (WhatsApp)
function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const phoneNumber = "+59177429763"; 
    
    let message = "Hola, me gustaría comprar los siguientes servicios:\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} (${parseFloat(item.price).toFixed(2)} Bs.)\n`;
        total += parseFloat(item.price);
    });

    message += `\n*Total a pagar: ${total.toFixed(2)} Bs.*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}