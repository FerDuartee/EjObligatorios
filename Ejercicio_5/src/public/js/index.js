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

let user;
let chatBox = document.getElementById("chat-box");

Swal.fire({
  title: "Identificate para ingresar",
  input: "text",
  text: "¡Ingresa tu nombre para identificarte en el chat!",
  inputValidator: (value) => {
    return !value && "¡Necesitas escribir un nombre de usuario para continuar!";
  },
  allowOutsideClick: false
}).then((result) => {
  user = result.value
  socket.emit("user-login", user)
});

chatBox.addEventListener("keyup", (e) => {
  if(e.key === "Enter") {
    if(chatBox.value.trim().length) {
      socket.emit("message", { user, message: chatBox.value })
      chatBox.value = "";
    }
  }
})

// SOCKET
socket.on("messageLogs", (data) => {
  const log = document.getElementById("message-logs");
  let messages = "";
  data.forEach(msg => {
    messages += `<p>${msg.user} dice: ${msg.message}</p>`
  })

  log.innerHTML = messages;
})

socket.on("new-user", (data) => {
  if(!user) return
  Swal.fire({
    text: `¡${data} se a conectado al chat!`,
    toast: true,
    position: "top-right"
  })
})
