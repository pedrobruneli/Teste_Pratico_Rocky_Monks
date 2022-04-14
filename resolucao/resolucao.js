
// EXPORT JSON CORRIGIDO
exportJSON("broken-database.json");
// PRINTA OS NOMES DOS PRODUTOS EM ORDEM DE CATEGORIA E ID
console.log("\n\nIMPRIMINDO NOMES DOS PRODUTOS POR CATEGORIA E ID...\n\n");
printProducts("saida.json");
console.log("\n\nIMPRIMINDO PRECO TOTAL DE CADA CATEGORIA...\n\n");
// PRINTA O PRECO TOTAL DE TODAS AS CATEGORIAS 
printPricesByCategory("saida.json");

// FIX AND EXPORT JSON

function readFile(jsonFile) {
    const fs = require('fs');
    return fs.readFileSync(jsonFile);
}

function changeJSONNames(json) {
    for (let jsonOBJ in json) {
        let objName = json[jsonOBJ].name;
        let newName = objName.replaceAll(/æ/g, "a").replaceAll(/¢/g, "c").replaceAll(/ø/g, "o").replaceAll(/ß/g, "b");
        json[jsonOBJ].name = newName;
    }
    jsonFile = json;
}

function changeJSONPrices(json) {
    for (const jsonOBJ in json) {
        let objPrice = json[jsonOBJ].price;
        let newPrice = parseFloat(objPrice);
        json[jsonOBJ].price = newPrice;
    }
    jsonFile = json;
}

function changeJSONQtd(json) {
    for (const jsonOBJ in json) {
        if (json[jsonOBJ].quantity == null) {
            json[jsonOBJ].quantity = 0;
        }
    }
    jsonFile = json;
}

function exportJSON(jsonFile) {
    let jsonNEW = JSON.parse(readFile(jsonFile));
    changeJSONNames(jsonNEW);
    changeJSONPrices(jsonNEW);
    changeJSONQtd(jsonNEW);
    const fs = require('fs');
    fs.writeFileSync("saida.json", JSON.stringify(jsonNEW, null, 2), (err, result) => {
        if (err) console.log(err);
    });
}

function orderJSON(jsonFile) {
    let json = JSON.parse(readFile(jsonFile));
    // sort by category
    let jsonOrdenado = json.sort((a, b) => {
        if ((a.category == b.category) && (a.id > b.id)) return 1;
        if ((a.category == b.category) && (a.id < b.id)) return -1;
        return 0
    });
    return jsonOrdenado;
}

function printProducts(jsonFile) {
    let jsonOrdenado = orderJSON(jsonFile);
    for (produtos in jsonOrdenado) {
        console.log(jsonOrdenado[produtos].name);
    }
}

function printPricesByCategory(jsonFile) {
    const jsonOrdenado = orderJSON(jsonFile);
    let categoriaPassado = "";
    let totalPrice = 0;
    let categorias = {};
    for (produtos in jsonOrdenado) {
        let categoria = jsonOrdenado[produtos].category;
        if (categorias[categoria] == null) {
            categorias[categoria] = {
                total: (jsonOrdenado[produtos].price) * jsonOrdenado[produtos].quantity
            }
        } else {
            categorias[categoria].total += (jsonOrdenado[produtos].price) * jsonOrdenado[produtos].quantity;
        }
        totalPrice += (jsonOrdenado[produtos].price) * jsonOrdenado[produtos].quantity;
        categoriaPassado = categoria;
    }
    for (categoria of Object.entries(categorias)) {
        console.log(categoria[0] + ": R$ " + categoria[1].total);
    }

    /* if(categoriaPassado != "" && categoriaPassado != categoria) {
    if(produtos == (Object.keys(jsonOrdenado).length-1)) {
        console.log(categoriaPassado + ": R$ " + totalPrice);
        console.log(categoria + ": R$ " + (jsonOrdenado[produtos].price)*jsonOrdenado[produtos].quantity);
    } else {
        console.log(categoriaPassado + ": R$ " + totalPrice);
        totalPrice = 0;
    }
} */
}