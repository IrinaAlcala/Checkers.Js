let reds = document.querySelectorAll("tr:nth-child(-n+3)div");
let blacks = document.querySelectorAll("tr:nth-child(n+6)div");

const clicked = e => {
   e.target.classList.toggle("active");
    let color = e.target.classList.contains("red") ? "red" : "black";
     let crowned = e.target.classList.contains("crowned") ? true : false;
}

//Disable or enable non active pieces

if (color === "red") {
    for (red of reds) {
        red.classList.toggle("disabled");


    }
} else {
    for (black of blacks)
    {
        black.classList.toggle("disabled");
    }
}


e.target.classList.remove("disabled");

let cell = e.path[1].cellIndex;
let row = e.path[2].rowIndex;

let options = findOptions(color, row, cell, crowned);

//Loop through all the option checking if each on eis alredy displaying or not.

options.forEach(function(option) {
    if (option.position)
    {
        if (option.position.classList.contains("options")) {

            option.position.classList.remove(...option.position.classList);

            option.position.classList.remove(color);
        } else if 
        (!option.position.classList.contains(color)) {
            option.position.classList.add("options");
            option.position.classList.add(color);

            if (crowned) {
                option.position.classList.add("crowned");
            }

            option.position.onclick = function callHandler(event) {
                move(event, e.target, options, color, option.eat);
            };
        }
    }
});
}

const move = 