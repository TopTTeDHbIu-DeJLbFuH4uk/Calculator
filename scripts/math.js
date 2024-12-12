const displayEl = document.querySelector('.display');
const buttonEls = [...document.querySelectorAll('.button')];
const cleanBtnEl = document.querySelector('.clean-btn');
const operators = ['+', '-', '*', '/',];
const point = ['.'];


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

        // Blocked first operator
        if (!displayEl.value) {
            if (operators.includes(valueStr) || point.includes(valueStr)) {
                return;
            }
        }

        // Result
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

        // Blocked spam operator
        if (operators.includes(valueStr)) {
            if (operators.some(op => currentValue.includes(op))) {
                return;
            }
        }

        // const newValueString = displayEl.value + valueStr;
        // let lastOperator;
        // if (operators.includes(button.innerText)) {
        //     lastOperator = button.innerText;
        // }
        // if (lastOperator) {
        //     const valuesBeforeOperator = newValueString.split(lastOperator);
        //     const valuesAfterOperator = valuesBeforeOperator[2];
        //     console.log(valuesAfterOperator);
        //     console.log(valuesBeforeOperator);
        // }
        let lastOperator;
        if (operators.includes(button.innerText)) {
            lastOperator = button.innerText;
        }

        if (button.innerText === '.') {
            const numbers = displayEl.value.split(lastOperator);
            const lastNumber = numbers[numbers.length - 1];
            if (lastNumber.contains('.')) return;
        }

        // Output value to display
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
