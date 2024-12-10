const displayEl = document.querySelector('.display');
const buttonEls = [...document.querySelectorAll('.button')];
const cleanBtnEl = document.querySelector('.clean-btn');

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

        const operators = ['+', '-', '*', '/'];
        const pointOperator = ['.'];
        const valueStr = button.innerText;

        if (!displayEl.value) {
            if (operators.includes(valueStr) || pointOperator.includes(valueStr)) {
                return;
            }
        }

        if (valueStr === '=') {

            const currentValue = displayEl.value;

            const operator = operators.find(op => currentValue.includes(op));

            if (operator) {
                const [firstValueStr, secondValueStr] = currentValue.split(operator);

                calc(firstValueStr, operator, secondValueStr);
            }
            return;
        }

        const currentValue = displayEl.value;

        if (operators.includes(valueStr)) {
            if (operators.some(op => currentValue.includes(op))) {
                return;
            }
        }

        displayEl.value += valueStr;
    });
});

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
