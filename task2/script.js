const field = document.getElementById('field');
const toWrite = document.getElementsByClassName('toWrite');
const equals = document.querySelector('#equals');
const clear = document.querySelector('#clear');
const backspace = document.querySelector('#backspace');
const error = document.querySelector('#error');
const copy = document.querySelector('#copy');

const isNumber = (string) => !isNaN(Number(string))

const OPERANDS = ['+', '-', '*', '/']
const BRACKETS = ['(', ')']
const ALLOWED_SYMBOLS = [...OPERANDS, ...BRACKETS, '.', 'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

field.onkeydown = (event) => {
    if (!isNumber(event.key) && ALLOWED_SYMBOLS.indexOf(event.key) === -1) {
        event.preventDefault()
    } else error.innerHTML = ''
}

for (let i = 0; i < toWrite.length; i++) {
    toWrite[i].onclick = () => {
        field.value += toWrite[i].value
        error.innerHTML = ''
    }
}

const countCheck = () => {
    const expression = field.value
    const length = field.value.length
    let i = 0
    const localExpression = (inBrackets) => {
        let currentNum = ''
        let currentOperand = ''
        let isBracketsClosed = false
        while (i < length) {
            if (isNumber(expression[i]) || expression[i] === '.') {
                currentNum += expression[i]
                if (!isNumber(currentNum)) {
                    throw 'Неправильное число на позиции ' + (i + 1)
                }
            } else {
                if (expression[i] === '(') {
                    if (i === 0 || OPERANDS.indexOf(expression[i - 1]) !== -1) {
                        i++
                        currentNum = localExpression(true)
                    } else {
                        throw 'Нет операнда перед скобками на позиции ' + (i + 1)
                    }
                } else if (expression[i] === ')') {
                    if (!inBrackets) {
                        throw 'Неправильные скобки на позиции ' + (i + 1)
                    } else {
                        if (currentNum === '') {
                            throw 'Пустое число в скобках на позиции ' + (i + 1)
                        }
                        isBracketsClosed = true
                    }
                } else if (OPERANDS.indexOf(expression[i]) !== -1) {
                    if (currentNum === '' && expression[i] !== '-') {
                        throw 'Пустое число перед операндом на позиции ' + (i + 1)
                    }
                    currentNum = ''
                    currentOperand = expression[i]
                }
            }
            i++
        }
        if (!currentNum && !!currentOperand) {
            throw 'Пустое число после операнда на позиции ' + i
        }
        if (inBrackets && !isBracketsClosed) {
            throw 'Скобки не закрыты на позиции ' + i
        }
        return currentNum
    }

    localExpression(false)
}

equals.onclick = () => {
    try {
        countCheck()
        const result = eval(field.value)
        if (result.toString() !== 'NaN' && result.toString() !== 'Infinity' && result.toString() !== '-Infinity') {
            field.value = result
        } else {
            throw `Получился нечисловой ответ "${result.toString() === 'NaN'
                ? 'Несуществующее число'
                : result.toString()[0] === '-'  
                    ? 'Отрицательная бесконечность'
                    : 'Бесконечность'
            }"`
        }
    } catch (e) {
        error.innerHTML = typeof e === 'string' ? e : 'Неправильное выражение, ищи сам'
    }
}

clear.onclick = () => {
    field.value = ''
    error.innerHTML = ''
}
backspace.onclick = () => {
    field.value = field.value ? field.value.slice(0, field.value.length - 1) : ''
    error.innerHTML = ''
}

copy.onclick = () => {
    navigator.clipboard.writeText(field.value).then(() => {
        alert('Текст успешно скопирован');
    }, () => {
        alert('Ошибка');
    });
}
