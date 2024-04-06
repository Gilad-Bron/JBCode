var arr = ["One", "Two", "Three"];

// זו טעות! לא ניתן לשמור מערך בצורה הזו בלוקאלסטורג
// localStorage.setItem("myNumbers", arr);

// בדרך זו אנחנו נוכל לשמור טיפוס נתונים מורכב
localStorage.setItem("myNumbers", JSON.stringify(arr) );

var myNumbers = localStorage.getItem("myNumbers");
console.log( JSON.parse(myNumbers) );

// localStorage.setItem("myNumbers", arr);

// function save() {
//     var itemName = document.querySelector("#itemName");
//     var itemPrice = document.querySelector("#itemPrice");
//     var itemStock = document.querySelector("#itemStock");

//     localStorage.setItem("itemName", itemName.value);
//     localStorage.setItem("itemPrice", itemPrice.value);
//     localStorage.setItem("itemStock", itemStock.value);

//     show();
// }

// function show() {
//     document.querySelector("#info").innerHTML = `
//     <p>Item Name: ${localStorage.getItem("itemName")}</p>
//     <p>Item Price: ${localStorage.getItem("itemPrice")}</p>
//     <p>Item Stock: ${localStorage.getItem("itemStock")}</p>
//     `
// }

// show();


// ONLY IF SCRIPT IS IN HEAD TAG
// document.addEventListener("DOMContentLoaded", function() {
//     var itemName = document.querySelector("#itemName");
//     console.log( itemName );
// });