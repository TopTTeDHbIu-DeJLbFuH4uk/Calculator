const displayEl = document.querySelector('.display');
const buttonEls = [...document.querySelectorAll('.button')];
const cleanBtnEl = document.querySelector('.clean-btn');
const operators = ['+', '-', '*', '/'];

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
        '+', '-', '*', '/', '.'
    ];

    if (e.key === ' ') {
        e.preventDefault();
    }

    if (!allowedKeys.includes(e.key) && !(e.key >= 0 && e.key <= 9)) {
        e.preventDefault();
    }

    const valueStr = e.key.toLowerCase();

    if (displayEl.value.includes('Fuck')) {
        displayEl.value = '';
    }
    if (displayEl.value.includes('e')) {
        displayEl.value = '';
    }
    if (displayEl.value === 'Error') {
        displayEl.value = '';
    }

    if (!displayEl.value) {
        blockFirstPoint(valueStr);
        if (!blockFirstPoint(valueStr)) {
            e.preventDefault();
        }
    }

    if (!checkPointBeforeAndAfterOperator(valueStr)) {
        e.preventDefault();
    }

    if (valueStr === '.') {
        limitPoints(valueStr);
        if (!limitPoints(valueStr)) {
            e.preventDefault();
        }
    }

    if (!displayEl.value) {
        blockFirstOperator(valueStr);
        if (!blockFirstOperator(valueStr)) {
            e.preventDefault();
        }
    }

    if (operators.includes(valueStr)) {
        blockSpamOperators();
        if (!blockSpamOperators()) {
            e.preventDefault();
        }
    }

    if (!replaceAndLimitZero(valueStr)) {
        e.preventDefault();
    }

    switch (valueStr) {
        case 'delete':
            clear();
            break;
        case 'enter':
        case '=':
            calc();
            break;
        default:
            return null;
    }
});

buttonEls.forEach(button => {
    button.addEventListener('click', () => {

        focusInput();

        if (displayEl.value.includes('Fuck')) {
            displayEl.value = '';
        }
        if (displayEl.value.includes('e')) {
            displayEl.value = '';
        }
        if (displayEl.value === 'Error') {
            displayEl.value = '';
        }

        const valueStr = button.innerText;

        if (!displayEl.value) {
            blockFirstPoint(valueStr);
            if (!blockFirstPoint(valueStr)) {
                return;
            }
        }

        if (!displayEl.value) {
            blockFirstOperator(valueStr);
            if (!blockFirstOperator(valueStr)) {
                return;
            }
        }

        if (!replaceAndLimitZero(valueStr)) {
            return;
        }

        if (valueStr === '=') {
            calc();
            if (!calc()) {
                return;
            }
        }

        if (operators.includes(valueStr)) {
            blockSpamOperators();
            if (!blockSpamOperators()) {
                return;
            }
        }

        if (!checkPointBeforeAndAfterOperator(valueStr)) {
            return;
        }

        if (button.innerText === '.') {
            limitPoints(button.innerText);
            if (!limitPoints(valueStr)) {
                return;
            }
        }

        displayEl.value += valueStr;
    });
});

const blockFirstPoint = (valueStr) => {
    if (valueStr === '.') {
        return false;
    }
    return true
};

const blockFirstOperator = (valueStr) => {
    if (operators.includes(valueStr)) {
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

    const lastOperatorIndex = Math.max(...operators.map(op => currentValue.lastIndexOf(op)));

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

const blockSpamOperators = () => {
    const currentValue = displayEl.value;
    const lastChair = currentValue[currentValue.length - 1];

    if (operators.includes(lastChair)) {
        displayEl.value = currentValue.slice(0, -1);
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

const calc = () => {

    const currentValue = displayEl.value;
    const lastChar = displayEl.value[currentValue.length - 1];

    if (lastChar === '.') {
        return false;
    }

    const operator = operators.find(op => currentValue.includes(op));
    const [firstValueStr, secondValueStr] = currentValue.split(operator);

    const firstNumber = parseFloat(firstValueStr);
    const secondNumber = parseFloat(secondValueStr);

    let result;

    if (isNaN(secondNumber)) {
        return;
    }

    switch (operator) {
        case '+':
            result = firstNumber + secondNumber;
            break;
        case '-':
            result = firstNumber - secondNumber;
            if (0 > result) {
                displayEl.value = 'Fuck';
                return;
            }
            break;
        case '*':
            result = firstNumber * secondNumber;
            break;
        case '/':
            if (secondNumber === 0) {
                displayEl.value = 'Error';
                return;
            }
            result = firstNumber / secondNumber;
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

cleanBtnEl.addEventListener('mousedown', (e) => {
    deleteLastCharacter();
    let clearIntervalId;

    const clearTimeoutId = setTimeout(() => {
        clearIntervalId = setInterval(() => {
            deleteLastCharacter();
        }, 50);
    }, 500);

    const clearTime = () => {
        clearTimeout(clearTimeoutId);
        clearInterval(clearIntervalId);
    };

    cleanBtnEl.addEventListener('mouseup', clearTime);
});

const deleteLastCharacter = () => {
    const currentValue = displayEl.value;
    const cursorPosition = displayEl.selectionStart;

    if (cursorPosition === 0) {
        return;
    } else {
        displayEl.value = currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition);
    }
    displayEl.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
}

const clear = () => {
    displayEl.value = '';
}