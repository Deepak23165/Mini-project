const display = document.getElementById("display");

function append(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function del() {
  display.value = display.value.substring(0, display.value.length - 1);
}

function calculate() {
  try {
    let result = evaluate(display.value);
    display.value = result;
  } catch (err) {
    console.error(err);
    display.value = "Error";
  }
}

function evaluate(expr) {
  const tokens = expr.match(/(\d+(\.\d+)?|[+\-*/])/g);

  if (!tokens) throw new Error("Invalid Expression");

  let values = [];
  let operators = [];

  const precedence = {
    "+": 1,
    "-": 1,
 "*": 2,
    "/": 2,
  };

  function applyOperator() {
    let b = values.pop();
    let a = values.pop();
    let operator = operators.pop();
    let result;

    switch (operator) {
      case "+":
        result = a + b;
        break;
      case "-":
        result = a - b;
        break;
      case "/":
        result = a / b;
        break;
      case "*":
        result = a * b;
        break;
    }
    values.push(result);
  }

  for (let token of tokens) {
    if (!isNaN(token)) {
      values.push(parseFloat(token));
    } else {
      while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
        applyOperator();
      }
      operators.push(token);
  }
  }

  while (operators.length) {
    applyOperator();
  }

  return values[0];
}

document.addEventListener("keydown", (event) => {
  let key = event.key;
  let others = ["-", "+", "*", "/", "."];

  if (!isNaN(key) || others.includes(key)) {
    append(key);
  } else if (key == "Enter") {
    calculate();
  } else if (key == "Backspace") {
    del();
  } else if (key == "Escape") {
    clearDisplay();
  }
});