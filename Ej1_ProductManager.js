class ProductManager {
    constructor() {
        this.products = [];
    }

    //Agrega producto, con id único y autoincrementable y campos obligatorios.
    addProduct(title,
        description, 
        price, 
        thumbnail, 
        stock,
        code
        ){
        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            console.log("Error: El producto '" + existingProduct.title + "' ya existe con la clave " + existingProduct.code);
            return;
        }

        const product = {
            title,
            description,
            price,
            thumbnail,
            stock,
            code,
        }

        if (this.products.length === 0) {
            product.id = 1;
        } else {
            product.id = this.products[this.products.length - 1].id + 1;
        }

        if (title.trim() && description.trim() && price > 0 && thumbnail.trim() && stock > 0 && code.trim()) {
            this.products.push(product);
        } else {
            console.table("Error: Faltan datos obligatorios del producto con id " + product.id);
        }
    };

    //Devuelve el array de productos
    getProducts() {
        return this.products;
    }

    //Busca productos por id
    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (product) {
            console.log("Producto encontrado");
            console.log(product);
            return product;
        } else {
            console.log("Not found");
        }
    }
}


//PRUEBAS
//Instancia de la clase con un array vacío
const ProductManagerEmpty = new ProductManager();
console.log(ProductManagerEmpty.getProducts());


//Instancia de la clase y se agregan productos
const ProductManagerAdd = new ProductManager();
ProductManagerAdd.addProduct("Piano 1/4 - Kawai", "Elegante piano de alta calidad.", 2000, "Sin Imagen", 5, "INS-101");
ProductManagerAdd.addProduct("Trompeta Tenor - Yamaha", "Potente trompeta con un brillante tono", 500, "Sin Imagen", 15, "INS-201");
ProductManagerAdd.addProduct("Tambor 14' - Memphis", "Tambor versátil y resistente", 100, "Sin Imagen", 10, "INS-301");
ProductManagerAdd.addProduct("Saxofón Alto - Yamaha", "Elegante saxofón con un tono suave y expresivo", 600, "Sin Imagen", 15, "INS-202");
//Productos repetidos
ProductManagerAdd.addProduct("Piano 1/4 - Kawai", "Elegante piano de alta calidad.", 2000, "Sin Imagen", 5, "INS-101");
ProductManagerAdd.addProduct("Saxofón Alto - Yamaha", "Elegante saxofón con un tono suave y expresivo", 600, "Sin Imagen", 15, "INS-202");
//Este producto no se carga por faltar algún campo
ProductManagerAdd.addProduct("              ", "Cello magnífico con tono profundo y resonante,", 750, "Sin Imagen", 3, "INS-103");


//Instancia de la clase con un array de productos
console.table(ProductManagerAdd.getProducts());

//Búsqueda de productos existentes
ProductManagerAdd.getProductById(2);
ProductManagerAdd.getProductById(3);

//Búsqueda de productos no existentes
ProductManagerAdd.getProductById(10);
ProductManagerAdd.getProductById(15);
