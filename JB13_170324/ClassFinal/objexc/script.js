var someCar = {}

document.querySelector("#add").addEventListener("click", function() {
    someCar[document.querySelector("#one").value] = document.querySelector("#first").value;
    console.log(someCar);
});



// var anotherCar = {
//     manufacturer: prompt("Please type manufacturer")
// }

// console.log(anotherCar);

// var car = {
//     manufacturer: "Mazda",
//     model: "C3",
//     color: "Black"
// }

console.log( car.manufacturer );
console.log( car.model );
console.log( car.color );

// console.log( car["manufacturer"] );
// console.log( car["model"] );
// console.log( car["color"] );

// for (var key in car) {
//     console.log(`${key}: ${car[key]}`);
// }