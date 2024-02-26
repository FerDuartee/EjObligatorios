const FormResolvente = async (a, b, c) => {
    return new Promise((resolve, reject) => {
        if (typeof a !== "number" || typeof b !== "number" || typeof c !== "number") {
            reject("The parameters should be numbers");
        }
        if (a === 0) {
            reject("a no puede ser 0") //si "a" no está elevada al cuadrado no es una función cuadrática
        }
        else{
            const radicando = b**2 - 4 * a * c;
        }

        if (radicando < 0 ) {
            reject("Error en raiz cuadrada con número negativo")
        }
        else {

        }
    })
};

