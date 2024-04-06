var items = [];
var obj = {};

function reload_items() {
    var tempItems = JSON.parse(localStorage.getItem("items"));
    document.querySelector("#info").innerHTML = '';
    
    for (var item of tempItems) {
        document.querySelector("#info").innerHTML+=`
            <div class="item">
                <h2>${item.itemName}</h2>
                <h3>${item.itemPrice}$</h3>
                <h3>Stock: ${item.itemStock}</h3>
            </div>
        `;
    }
}

document.querySelector("#insert").addEventListener("click", function() {
    obj = {
        itemName: document.querySelector("#itemName").value,
        itemPrice: document.querySelector("#itemPrice").value,
        itemStock: document.querySelector("#itemStock").value
    }

    items.push(obj);

    localStorage.setItem("items", JSON.stringify(items));

    reload_items();
});

