const displayEl = document.querySelector('.display');
const buttonEls = [...document.querySelectorAll('.button')];
const cleanBtnEl = document.querySelector('.clean-btn');
const operators = ['+', '-', '*', '/'];

const focusInput = () => displayEl.focus();
focusInput();

window.addEventListener('click', () => focusInput());

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'F5':
        case 'F12':
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'Backspace':
            return;
        default:
            e.preventDefault();
            inputHandler(e);
    }
});

buttonEls.forEach(button => {
    button.addEventListener('click', e => {
        inputHandler(e);
    });
});

const inputHandler = (e) => {
    const valueStr = getInputValue(e);

    if (displayEl.value === 'Error' || displayEl.value.includes('e')) displayEl.value = '';

    if (valueStr === null) return;

    if (!displayEl.value) {
        if (!blockFirstPoint(valueStr)) return;
    }

    if (!checkPointBeforeAndAfterOperator(valueStr)) return;

    if (valueStr === '.') {
        if (!limitPoints(valueStr)) return;
    }

    if (!displayEl.value) {
        if (!blockFirstOperator(valueStr)) return;
    }

    if (operators.includes(valueStr)) {
        if (!blockSpamOperators(valueStr)) return;
    }

    if (!replaceAndLimitZero(valueStr)) return;

    if (valueStr === 'delete') {
        if(!clear()) return;
    }

    if (valueStr === '=') {
        if(!calc()) return;
    }

    displayEl.value += valueStr;
}

const getInputValue = e => {
    if (e.type === 'click') return e.target.innerText;
    const key = e.key.toLowerCase();
    switch (key) {
        case 'enter':
        case '=':
            return '=';
        case ',':
        case 'б':
        case 'ю':
            return '.';
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '+':
        case '-':
        case '*':
        case '/':
        case '.':
        case 'delete':
            return key;
        default:
            return null;
    }
};

const blockFirstPoint = (valueStr) => {
    if (valueStr === '.') return false;
    return true;
};

const blockFirstOperator = (valueStr) => {

    if (operators.includes(valueStr)) return false;
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

const blockSpamOperators = (valueStr) => {
    const currentValue = displayEl.value;
    const lastChair = currentValue[currentValue.length - 1];

    if (operators.includes(lastChair)) displayEl.value = currentValue.slice(0, -1) + valueStr;

    if (operators.some(op => currentValue.includes(op))) return false;
    return true;
};

const checkPointBeforeAndAfterOperator = (valueStr) => {
    const currentValue = displayEl.value;
    let lastChar = displayEl.value[currentValue.length - 1];

    if (operators.includes(lastChar)) {
        if (valueStr === '.') return false;
        return true;
    }
    if (lastChar === '.' && operators.includes(valueStr)) return false;
    return true;
};

const limitPoints = (point) => {
    const lastOperator = operators.find(op => displayEl.value.includes(op));
    const currentOperator = lastOperator ? displayEl.value.split(lastOperator).pop() : displayEl.value;

    if (currentOperator.includes(point)) return false;
    return true;
};

const calc = () => {

    const currentValue = displayEl.value;
    const lastChar = displayEl.value[currentValue.length - 1];

    if (lastChar === '.') return false;

    const operator = operators.find(op => currentValue.includes(op));
    const [firstValueStr, secondValueStr] = currentValue.split(operator);

    const firstNumber = parseFloat(firstValueStr);
    const secondNumber = parseFloat(secondValueStr);

    let result;

    if (isNaN(secondNumber)) return;

    switch (operator) {
        case '+':
            result = firstNumber + secondNumber;
            break;
        case '-':
            result = firstNumber - secondNumber;
            if (0 > result) {
                displayEl.value = 'Error';
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
    displayEl.value = Math.round(result * 100_000_000) / 100_000_000;
};

cleanBtnEl.addEventListener('pointerdown', () => {
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

    cleanBtnEl.addEventListener('pointerup', clearTime);
    window.addEventListener('pointerup', clearTime);
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
};

const clear = () => {
    displayEl.value = '';
    if (!displayEl.value) return false;
    return true;
}