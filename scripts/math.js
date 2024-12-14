const displayEl = document.querySelector('.display');
const buttonEls = [...document.querySelectorAll('.button')];
const cleanBtnEl = document.querySelector('.clean-btn');
const operators = ['+', '-', '*', '/',];

displayEl.addEventListener('keydown', (e) => {
    const allowedKeys = [
        'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab',
        '+', '-', '*', '/', '.',
    ];

    if (!allowedKeys.includes(e.key) && !(e.key >= '0' && e.key <= '9')) {
        e.preventDefault();
    }

});

buttonEls.forEach(button => {
    button.addEventListener('click', () => {

        if (displayEl.value === 'Error') {
            return;
        }

        const valueStr = button.innerText;

        // blockFirstOperation function
        if (!displayEl.value) {
            blockFirstOperator(valueStr);
            if (!blockFirstOperator(valueStr)) {
                return;
            }
        }

        // calc function
        if (valueStr === '=') {
            const currentValue = displayEl.value;

            const operator = operators.find(op => currentValue.includes(op));

            if (operator) {
                const [firstValueStr, secondValueStr] = currentValue.split(operator);
                calc(firstValueStr, operator, secondValueStr);
            }
            return;
        }

        // blockSpamOperators function
        if (operators.includes(valueStr)) {
            blockSpamOperators();
            if (!blockSpamOperators()) {
                return;
            }
        }

        // limitPoints function
        if (button.innerText === '.') {
            limitPoints(button.innerText);
            if (!limitPoints(valueStr)) {
                return;
            }
        }

        // Output value to display
        displayEl.value += valueStr;
    });
});

const blockFirstOperator = (valueStr) => {
    if (operators.includes(valueStr) || valueStr === '.') {
        return false;
    }
    return true;
};

const blockSpamOperators = () => {
    const currentValue = displayEl.value;

    if (operators.some(op => currentValue.includes(op))) {
        return false;
    }
    return true;
};

const limitPoints = (point) => {
    const lastOperator = operators.find(op => displayEl.value.includes(op));

    const currentOperator = lastOperator ? displayEl.value.split(lastOperator).pop() : displayEl.value;

    if (currentOperator.includes(point)) {
        return false;
    }
    return true;
};

const calc = (firstValueStr, operator, secondValueStr) => {

    const firstValue = parseFloat(firstValueStr);
    const secondValue = parseFloat(secondValueStr);

    let result;

    if (isNaN(secondValue)) {
        return;
    }

    switch (operator) {
        case '+':
            result = firstValue + secondValue;
            break;
        case '-':
            result = firstValue - secondValue;
            break;
        case '*':
            result = firstValue * secondValue;
            break;
        case '/':
            if (secondValue === 0) {
                displayEl.value = 'Error';
                return;
            }
            result = firstValue / secondValue;
            break;
        default:
            displayEl.value = 'Error';

    }

    displayEl.value = result;
};

cleanBtnEl.addEventListener('click', () => {
    displayEl.value = '';
});
