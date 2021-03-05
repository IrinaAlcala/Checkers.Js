let reds = document.querySelectorAll("tr:nth-child(-n+3) div");
let blacks = document.querySelectorAll("tr:nth-child(n+6) div");

const clicked = e => {
  e.target.classList.toggle("active");

  let color = e.target.classList.contains("red") ? "red" : "black";
  let crowned = e.target.classList.contains("crowned") ? true : false;

  //Disable or enable non active pieces
  if (color === "red") {
    for (red of reds) {
      red.classList.toggle("disabled");
    }
  } else {
    for (black of blacks) {
      black.classList.toggle("disabled");
    }
  }

  e.target.classList.remove("disabled");

  let cell = e.path[1].cellIndex;
  let row = e.path[2].rowIndex;

  let options = findOptions(color, row, cell, crowned);

  //Loop through all options, checking if each one is already displaying or not.
  //If the option is already being displayed remove it, if not then display it and then call the move function inside of the onclick.
  options.forEach(function(option) {
    if (option.position) {
      if (option.position.classList.contains("options")) {
        option.position.classList.remove(...option.position.classList);
        option.position.classList.remove(color);
      } else if (!option.position.classList.contains(color)) {
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
};

const move = (e, prevPos, otherOptions, color, eat) => {
  let crowned = e.target.classList.contains("crowned") ? true : false;
  //Display the piece in the new position by removing the options class.
  e.target.classList.remove("options");
  //Remove the previous position
  prevPos.classList.remove(...prevPos.classList);
  prevPos.removeEventListener("click", clicked);
  e.target.onclick = null;
  //Remove all other options
  otherOptions.forEach(function(otherOption) {
    if (otherOption.position) {
      if (otherOption.position.classList.contains("options")) {
        otherOption.position.classList.remove(
          ...otherOption.position.classList
        );
        otherOption.position.onclick = null;
      }
    }
  });

  if (eat.state) {
    //Remove the piece that was eaten
    eat.pos.classList.remove(...eat.pos.classList);
    eat.pos.removeEventListener("click", clicked);
    let cell = e.path[1].cellIndex;
    let row = e.path[2].rowIndex;
    //Check if there's a posibility of another jump by calling the findOptions func again
    let options = findOptions(color, row, cell, crowned);
    options.forEach(function(option) {
      if (option.eat.state && !option.position.classList.contains(color)) {
        option.position.classList.add("options");
        option.position.classList.add(color);
        e.target.classList.add("active");
        if (crowned) {
          option.position.classList.add("crowned");
        }
        option.position.onclick = function callHandler(event) {
          move(event, e.target, options, color, option.eat);
        };
      } else {
        changeTurn(color);
      }
    });
  } else {
    changeTurn(color);
  }

  if (e.path[2].rowIndex === 0 || e.path[2].rowIndex === 7) {
    crown(e.target);
  }
};

const findOptions = (color, row, cell, crowned) => {
  let option1 = {
      position: null,
      eat: { state: false, pos: null }
    },
    option2 = {
      position: null,
      eat: { state: false, pos: null }
    },
    option3 = {
      position: null,
      eat: { state: false, pos: null }
    },
    option4 = {
      position: null,
      eat: { state: false, pos: null }
    };

  if (color === "red") {
    //Declare the initial values for the first 2 options
    option1.position = document.querySelector(
      `tr:nth-of-type(${row + 2}) td:nth-of-type(${cell}) div`
    );

    option2.position = document.querySelector(
      `tr:nth-of-type(${row + 2}) td:nth-of-type(${cell + 2}) div`
    );

    if (option1.position) {
      if (option1.position.classList.contains("black")) {
        //If the option contains a black piece check the row and column, relevant for a possible jump.
        option1.position = document.querySelector(
          `tr:nth-of-type(${row + 3}) td:nth-of-type(${cell - 1}) div`
        );
        if (option1.position) {
          //Check for a possible jump.
          if (option1.position.classList.contains("black")) {
            option1.position = null;
          } else {
            option1.eat.state = true;
            option1.eat.pos = document.querySelector(
              `tr:nth-of-type(${row + 2}) td:nth-of-type(${cell}) div`
            );
          }
        }
      }
    }

    if (option2.position) {
      if (option2.position.classList.contains("black")) {
        option2.position = document.querySelector(
          `tr:nth-of-type(${row + 3}) td:nth-of-type(${cell + 3}) div`
        );
        if (option2.position) {
          if (option2.position.classList.contains("black")) {
            option2.position = null;
          } else {
            option2.eat.state = true;
            option2.eat.pos = document.querySelector(
              `tr:nth-of-type(${row + 2}) td:nth-of-type(${cell + 2}) div`
            );
          }
        }
      }
    }
    //If the piece is crowned find possible options 3 and 4.
    if (crowned) {
      option3.position = document.querySelector(
        `tr:nth-of-type(${row}) td:nth-of-type(${cell}) div`
      );

      option4.position = document.querySelector(
        `tr:nth-of-type(${row}) td:nth-of-type(${cell + 2}) div`
      );

      if (option3.position) {
        if (option3.position.classList.contains("black")) {
          option3.position = document.querySelector(
            `tr:nth-of-type(${row - 1}) td:nth-of-type(${cell - 1}) div`
          );
          if (option3.position) {
            if (option3.position.classList.contains("black")) {
              option3.position = null;
            } else {
              option3.position = document.querySelector(
                `tr:nth-of-type(${row - 1}) td:nth-of-type(${cell - 1}) div`
              );
              option3.eat.state = true;
              option3.eat.pos = document.querySelector(
                `tr:nth-of-type(${row}) td:nth-of-type(${cell}) div`
              );
            }
          }
        }
      }

      if (option4.position) {
        if (option4.position.classList.contains("black")) {
          option4.position = document.querySelector(
            `tr:nth-of-type(${row - 1}) td:nth-of-type(${cell + 3}) div`
          );
          if (option4.position) {
            if (option4.position.classList.contains("black")) {
              option4.position = null;
            } else {
              option4.eat.state = true;
              option4.eat.pos = document.querySelector(
                `tr:nth-of-type(${row}) td:nth-of-type(${cell + 2}) div`
              );
            }
          }
        }
      }
    }
  } else {
    option1.position = document.querySelector(
      `tr:nth-of-type(${row}) td:nth-of-type(${cell}) div`
    );

    option2.position = document.querySelector(
      `tr:nth-of-type(${row}) td:nth-of-type(${cell + 2}) div`
    );

    if (option1.position) {
      if (option1.position.classList.contains("red")) {
        option1.position = document.querySelector(
          `tr:nth-of-type(${row - 1}) td:nth-of-type(${cell - 1}) div`
        );
        if (option1.position) {
          if (option1.position.classList.contains("red")) {
            option1.position = null;
          } else {
            option1.eat.state = true;
            option1.eat.pos = document.querySelector(
              `tr:nth-of-type(${row}) td:nth-of-type(${cell}) div`
            );
          }
        }
      }
    }

    if (option2.position) {
      if (option2.position.classList.contains("red")) {
        option2.position = document.querySelector(
          `tr:nth-of-type(${row - 1}) td:nth-of-type(${cell + 3}) div`
        );
        if (option2.position) {
          if (option2.position.classList.contains("red")) {
            option2.position = null;
          } else {
            option2.eat.state = true;
            option2.eat.pos = document.querySelector(
              `tr:nth-of-type(${row}) td:nth-of-type(${cell + 2}) div`
            );
          }
        }
      }
    }

    if (crowned) {
      option3.position = document.querySelector(
        `tr:nth-of-type(${row + 2}) td:nth-of-type(${cell}) div`
      );

      option4.position = document.querySelector(
        `tr:nth-of-type(${row + 2}) td:nth-of-type(${cell + 2}) div`
      );

      if (option3.position) {
        if (option3.position.classList.contains("red")) {
          option3.position = document.querySelector(
            `tr:nth-of-type(${row + 3}) td:nth-of-type(${cell - 1}) div`
          );
          if (option3.position) {
            if (option3.position.classList.contains("red")) {
              option3.position = null;
            } else {
              option3.eat.state = true;
              option3.eat.pos = document.querySelector(
                `tr:nth-of-type(${row + 2}) td:nth-of-type(${cell}) div`
              );
            }
          }
        }
      }

      if (option4.position) {
        if (option4.position.classList.contains("red")) {
          option4.position = document.querySelector(
            `tr:nth-of-type(${row + 3}) td:nth-of-type(${cell + 3}) div`
          );
          if (option4.position) {
            if (option4.position.classList.contains("red")) {
              option4.position = null;
            } else {
              option4.eat.state = true;
              option4.eat.pos = document.querySelector(
                `tr:nth-of-type(${row + 2}) td:nth-of-type(${cell + 2}) div`
              );
            }
          }
        }
      }
    }
  }

  return [option1, option2, option3, option4];
};

const changeTurn = color => {
  reds = document.querySelectorAll(".red:not(.options)");

  blacks = document.querySelectorAll(".black:not(.options)");

  //Remove or add the disabled class, depending on which color just played.
  if (color === "red") {
    for (red of reds) {
      red.classList.add("disabled");
      red.addEventListener("click", clicked);
    }

    for (black of blacks) {
      black.classList.remove("disabled");
      black.addEventListener("click", clicked);
    }
  } else {
    for (red of reds) {
      red.classList.remove("disabled");
    }

    for (black of blacks) {
      black.classList.add("disabled");
    }
  }
};

const crown = piece => {
  piece.classList.add("crowned", "crowning");
  document.documentElement.style.setProperty("--shake-anim", "0.2s shake");
  setTimeout(() => {
    document.documentElement.style.setProperty("--shake-anim", "none");
    piece.classList.remove("crowning");
  }, 1000);
};

for (red of reds) {
  red.classList.add("red");
  red.addEventListener("click", clicked);
}

for (black of blacks) {
  black.classList.add("black", "disabled");
  black.addEventListener("click", clicked);
}
