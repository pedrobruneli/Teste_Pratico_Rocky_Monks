
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

function changeJSONNames(jsonOBJ) {
        var objName = jsonOBJ.name;
        var newName = objName.replace(/æ/g,"a").replace(/¢/g,"c").replace(/ø/g,"o").replace(/ß/g,"b");
        jsonOBJ.name = newName;
}

function changeJSONPrices(jsonOBJ) {
        var objPrice = jsonOBJ.price;
        var newPrice = parseFloat(objPrice);
        jsonOBJ.price = newPrice;
}

function changeJSONQtd(jsonOBJ) {
        if(jsonOBJ.quantity == null) {
            jsonOBJ.quantity = 0;
        }
}

function exportJSON(jsonFile) {
    var jsonNEW = JSON.parse(readFile(jsonFile));
    for(var jsonOBJ of jsonNEW) {
      changeJSONNames(jsonOBJ);
      changeJSONPrices(jsonOBJ);
      changeJSONQtd(jsonOBJ);
    }
    const fs = require('fs');
    fs.writeFileSync("saida.json",JSON.stringify(jsonNEW,null,2), (err, result) => {
        if(err) console.log(err);
    });
}

function orderJSON(jsonFile) {
    var json = JSON.parse(readFile(jsonFile));
    // sort by category
    var jsonOrdenado = json.sort((a,b) => {
        if((a.category == b.category) && (a.id > b.id)) return 1;
        if((a.category == b.category) && (a.id < b.id)) return -1;
        return 0
    });
    return jsonOrdenado;
}

function printProducts(jsonFile) {
    var jsonOrdenado = orderJSON(jsonFile);
    for(produtos in jsonOrdenado) {
        console.log(jsonOrdenado[produtos].name);
    }
}

function printPricesByCategory(jsonFile) {
    var jsonOrdenado = orderJSON(jsonFile);
    var categoriaPassado = "";
    var totalPrice = 0;
    for(const [index,produtos] of jsonOrdenado.entries()) {
        var categoria = produtos.category;
        if(categoriaPassado != "" && categoriaPassado != categoria) {
            if(index == (Object.keys(jsonOrdenado).length-1)) {
                console.log(categoriaPassado + ": R$ " + totalPrice);
                console.log(categoria + ": R$ " + (produtos.price)*produtos.quantity);
            } else {
                console.log(categoriaPassado + ": R$ " + totalPrice);
                totalPrice = 0;
            }
        }
        totalPrice += (produtos.price)*produtos.quantity;
        categoriaPassado = categoria;
    }
}
