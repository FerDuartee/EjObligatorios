const socket = io();

const addProductRow = (product) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.code}</td>
        <td>${product.price}</td>
        <td>${product.status}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>${product.thumbnail}</td>
    `;
    return row;
};

const clarTableProducts = () => {
    const tablaProductos = document.getElementById('tabla-productos');
    const tbody = tablaProductos.querySelector('tbody');
    tbody.innerHTML = '';
};

const addRowTable = (row) => {
    const tablaProductos = document.getElementById('tabla-productos');
    const tbody = tablaProductos.querySelector('tbody');
    tbody.appendChild(row);
};

socket.on('getProducts_ev', (products) => {
    console.log('Productos cargados:', products);
    clarTableProducts();
    products.forEach(product => {
        const row = addProductRow(product);
        addRowTable(row);
    });
});

socket.on('deletedProduct_ev', (data) => {
    console.log('Producto eliminado', data);
});

socket.on('newProduct_ev', (data) => {
    console.log('Producto agregado:', data);
    const newProduct = data.product;
    const newProductRow = addProductRow(newProduct);
    addRowTable(newProductRow);
});

var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', { user: 'User', message: input.value });
    input.value = '';
  }
});

socket.on('chat message', function(data) {
  var item = document.createElement('li');
  item.textContent = data.user + ': ' + data.message;
  document.getElementById('messages').appendChild(item);
});