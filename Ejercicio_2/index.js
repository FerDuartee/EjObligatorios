const path = require('path');
const ProductManager = require('./ProductManager')


const projectProduct = async () => {
    console.log("INICIANDO EL MANEJADOR DE PRODUCTOS");
    try {
        const pathBase = path.join(`${__dirname}/db.json`);
        const manager = new ProductManager(pathBase);

        //Crear nuevo con los datos completos
        const addProduct = {
            title: "Prueba",
            description: "Prueba",
            price: 2,
            thumbnail: "Sin Imagen",
            code: "INS-XXX",
            stock: 1
        };
        const newProduct = await manager.createProduct(addProduct);
        console.log("🚀 ~ file: index.js:21 ~ projectProduct ~ newProduct:", newProduct)

        //Traer productos con el producto nuevo
        product = await manager.getProducts();
        console.log("🚀 ~ file: index.js:25 ~ projectProduct ~ product:", product)

        //Traer producto por ID
        busqueda = await manager.getProductsbyId(1);
        console.log("🚀 ~ file: index.js:29 ~ projectProduct ~ busqueda:", busqueda)

        //Traer producto por ID incorrecto
        busqueda = await manager.getProductsbyId(100);
        console.log("🚀 ~ file: index.js:33 ~ projectProduct ~ busqueda:", busqueda)

        //Actualizar producto por ID, se cambia el precio de 100 a 2500
        actualización = await manager.updateProduct(3,
            { price: 2500 }
        );

        //Permite comprobar la actualización
        product = await manager.getProducts();
        console.log("🚀 ~ file: index.js:42 ~ projectProduct ~ product:", product)

        //Eliminar producto por ID (se elimina el recién creado. Se puede probar con otro ID)
        eliminación = await manager.deleteProduct(4);
        console.log("🚀 ~ file: index.js:46 ~ projectProduct ~ eliminación:", eliminación)

        //Eliminar producto por ID que no existe
        eliminación = await manager.deleteProduct(100);
        console.log("🚀 ~ file: index.js:50 ~ projectProduct ~ eliminación:", eliminación)

        //Traer productos
        product = await manager.getProducts();
        console.log("🚀 ~ file: index.js:54 ~ projectProduct ~ product:", product)



    } catch (error) {
    console.log("🚀 ~ file: index.js:59 ~ projectProduct ~ error:", error)
    }
}
projectProduct();