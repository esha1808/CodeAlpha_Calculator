const display = document.getElementById("display");

let expression = "";

function appendValue(value) {

    if (expression === "Error") {
        expression = "";
    }

    expression += value;
    display.value = expression;
}

function clearDisplay() {
    expression = "";
    display.value = "0";
}

function deleteLast() {
    expression = expression.slice(0, -1);
    display.value = expression || "0";
}

function calculateResult() {

    try {

        if (expression === "") return;

        let tokens = expression.match(/(?:\d+\.?\d*|\.\d+|[+\-*/%])/g);

        if (!tokens || tokens.join("") !== expression) {
            throw new Error("Invalid");
        }

        let numbers = [];
        let operators = [];
        let i = 0;

        function getNumber() {
            let sign = 1;

            if (tokens[i] === "-") {
                sign = -1;
                i++;
            } else if (tokens[i] === "+") {
                i++;
            }

            let value = Number(tokens[i]);

            if (!Number.isFinite(value)) {
                throw new Error("Invalid");
            }

            i++;
            return sign * value;
        }

        let first = getNumber();
        numbers.push(first);

        while (i < tokens.length) {

            let op = tokens[i];

            if (!["+", "-", "*", "/", "%"].includes(op)) {
                throw new Error("Invalid");
            }

            i++;

            let num = getNumber();

            if (op === "*") {
                numbers[numbers.length - 1] *= num;
            }
            else if (op === "/") {
                if (num === 0) throw new Error("Division by zero");
                numbers[numbers.length - 1] /= num;
            }
            else if (op === "%") {
                if (num === 0) throw new Error("Division by zero");
                numbers[numbers.length - 1] %= num;
            }
            else {
                operators.push(op);
                numbers.push(num);
            }
        }

        let result = numbers[0];

        for (let j = 0; j < operators.length; j++) {
            if (operators[j] === "+") {
                result += numbers[j + 1];
            } else {
                result -= numbers[j + 1];
            }
        }

        if (!Number.isFinite(result)) {
            throw new Error("Invalid");
        }

        result = Number(result.toPrecision(12));

        expression = String(result);
        display.value = expression;

    } catch (error) {

        expression = "Error";
        display.value = "Error";

    }
}

// Keyboard support

document.addEventListener("keydown", function(event) {

    if (/^[0-9]$/.test(event.key)) {
        appendValue(event.key);
    }
    else if (["+", "-", "*", "/", "%", "."].includes(event.key)) {
        appendValue(event.key);
    }
    else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculateResult();
    }
    else if (event.key === "Backspace") {
        deleteLast();
    }
    else if (event.key === "Escape") {
        clearDisplay();
    }

});