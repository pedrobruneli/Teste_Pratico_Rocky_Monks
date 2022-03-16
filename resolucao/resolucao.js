
// EXPORT JSON CORRIGIDO
exportJSON("broken-database.json");
// PRINTA OS NOMES DOS PRODUTOS EM ORDEM DE CATEGORIA E ID
console.log("\n\nIMPRIMINDO NOMES DOS PRODUTOS POR CATEGORIA E ID...\n\n");
printProducts("saida.json");
console.log("\n\nIMPRIMINDO PRECO TOTAL DE CADA CATEGORIA...\n\n");
// PRINTA O PRECO TOTAL DE TODAS AS CATEGORIAS 
printPricesByCategory("saida.json");

// FIX AND EXPORT JSON
function changeJSONNames(json) {
    for(var jsonOBJ in json){
        var objName = json[jsonOBJ].name;
        var newName = objName.replaceAll(/æ/g,"a").replaceAll(/¢/g,"c").replaceAll(/ø/g,"o").replaceAll(/ß/g,"b");
        json[jsonOBJ].name = newName;
    }
    jsonFile = json;
}

function changeJSONPrices(json) {
    for(var jsonOBJ in json){
        var objPrice = json[jsonOBJ].price;
        var newPrice = parseFloat(objPrice);
        json[jsonOBJ].price = newPrice;
    }
    jsonFile = json;
}

function changeJSONQtd(json) {
    for(var jsonOBJ in json){
        if(json[jsonOBJ].quantity == null) {
            json[jsonOBJ].quantity = 0;
        }
    }
    jsonFile = json;
}

function exportJSON(jsonFile) {
    var jsonNEW = JSON.parse(readJSONFile(jsonFile));
    changeJSONNames(jsonNEW);
    changeJSONPrices(jsonNEW);
    changeJSONQtd(jsonNEW);
    const fs = require('fs');
    fs.writeFileSync("saida.json",JSON.stringify(jsonNEW,null,2), (err, result) => {
        if(err) console.log(err);
    });
}

function readJSONFile(jsonFile) {
    const fs = require('fs');
    return fs.readFileSync(jsonFile);
}

function orderJSON(jsonFile) {
    var json = JSON.parse(readJSONFile(jsonFile));
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
    for(produtos in jsonOrdenado) {
        var categoria = jsonOrdenado[produtos].category;
        if(categoriaPassado != "" && categoriaPassado != categoria) {
            if(produtos == (Object.keys(jsonOrdenado).length-1)) {
                console.log(categoriaPassado + ": R$ " + totalPrice);
                console.log(categoria + ": R$ " + (jsonOrdenado[produtos].price)*jsonOrdenado[produtos].quantity);
            } else {
                console.log(categoriaPassado + ": R$ " + totalPrice);
                totalPrice = 0;
            }
        }
        totalPrice += (jsonOrdenado[produtos].price)*jsonOrdenado[produtos].quantity;
        categoriaPassado = categoria;
    }
}