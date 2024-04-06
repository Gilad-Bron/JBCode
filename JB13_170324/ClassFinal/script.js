// מאחסן מידע לשימוש מאוחר יותר
localStorage.setItem("item", "Some Value");
localStorage.setItem("price", "Some Value");
localStorage.setItem("stock", "Some Value");

// איחזור מידע
var myItem = localStorage.getItem("item");

console.log(myItem);