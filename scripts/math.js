const displayEl = document.querySelector('.display');
const buttonEls = [...document.querySelectorAll('.button')];
const cleanBtnEl = document.querySelector('.clean-btn');
const operators = ['+', '-', '*', '/',];

const focusInput = () => {
    displayEl.focus();
};
focusInput();

window.addEventListener('click', () => {
    focusInput();
});

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

        focusInput();

        if (displayEl.value.includes('e')) {
            displayEl.value = '';
        }
        if (displayEl.value === 'Error') {
            displayEl.value = '';
        }

        const valueStr = button.innerText;

        // blockFirstOperation function
        if (!displayEl.value) {
            blockFirstOperator(valueStr);
            if (!blockFirstOperator(valueStr)) {
                return;
            }
        }

        // replaceAndLimitZero function
        if (!replaceAndLimitZero(valueStr)) {
            return;
        }

        // calc function
        if (valueStr === '=') {
            const currentValue = displayEl.value;
            const lastChar = displayEl.value[currentValue.length - 1];

            if (lastChar === '.') {
                return;
            }

            const operator = operators.find(op => currentValue.includes(op));

            if (operator) {
                const [firstValueStr, secondValueStr] = currentValue.split(operator);
                calc(firstValueStr, operator, secondValueStr);
            }
            return;
        }

        // blockSpamOperators function
        if (operators.includes(valueStr)) {
            blockSpamOperators(valueStr);
            if (!blockSpamOperators(valueStr)) {
                return;
            }
        }

        // checkPointBeforeAndAfterOperator function
        if (!checkPointBeforeAndAfterOperator(valueStr)) {
            return;
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

const replaceAndLimitZero = (valueStr) => {
    const currentValue = displayEl.value;
    const arrayNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    if (currentValue === '0' && valueStr === '0') {
        return false;
    } else if (currentValue === '0' && arrayNumbers.includes(valueStr)) {
        displayEl.value = '';
        return true;
    }

    const lastOperatorIndex = Math.max(
        ...operators.map(op => currentValue.lastIndexOf(op))
    );

    const afterLastOperator = currentValue.slice(lastOperatorIndex + 1);

    if (lastOperatorIndex !== -1) {
        if (afterLastOperator === '0' && valueStr === '0') {
            return false;
        } else if (afterLastOperator === '0' && arrayNumbers.includes(valueStr)) {
            displayEl.value = currentValue.slice(0, -1);
        }
    }
    return true;
};

const blockSpamOperators = (valueStr) => {
    const currentValue = displayEl.value;
    const lastChair = currentValue[currentValue.length - 1];

    if (operators.includes(lastChair)) {
        displayEl.value = currentValue.slice(0, -1) + valueStr;
    }

    if (operators.some(op => currentValue.includes(op))) {
        return false;
    }
    return true;
};

const checkPointBeforeAndAfterOperator = (valueStr) => {
    const currentValue = displayEl.value;
    const lastChar = displayEl.value[currentValue.length - 1];

    if (operators.includes(lastChar)) {
        if (valueStr === '.') {
            return false;
        }
        return true;
    }
    if (lastChar === '.' && operators.includes(valueStr)) {
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

    const res = result.toString();
    if (res.includes('e')) {
        displayEl.value = result;
        return;
    }
    displayEl.value = result;
};

cleanBtnEl.addEventListener('click', () => {
    displayEl.value = '';
    focusInput();
});
