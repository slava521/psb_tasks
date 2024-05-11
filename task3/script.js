const form = document.querySelector('#form')
const n = document.querySelector('#n') //Кол-во котиков
const b = document.querySelector('#b') //Кол-во корма на котика
const m = document.querySelector('#m') //Вместительность миски
const t = document.querySelector('#t') //Сколько секунд ест котик
const r = document.querySelector('#r') //Сколько секунд бабушка пополняет корм
const submitButton = document.querySelector('#submitButton')

const status = document.querySelector('#status')

const fullCats = document.querySelector('#fullCats')
const waitingCats = document.querySelector('#waitingCats')
const foodImg = document.querySelector('#foodImg')
const catFaceImg = document.querySelector('#catFaceImg')
const fullBowlImg = document.querySelector('#fullBowlImg')
const emptyBowlImg = document.querySelector('#emptyBowlImg')

const wait = time => new Promise(r => setTimeout(r, time * 1000))

const WAITING_CAT_IMG = '<img src="./images/waitingCat.svg" alt="Кошка">'
const FULL_CAT_IMG = '<img src="./images/fullCat.svg" alt="Кошка">'

const simulation = async () => {
    let currentCat = 1;
    let foodCount = Number(m.value);
    let catAte = 0;
    const MAX_FOOD_COUNT = Number(m.value);
    const CAT_MUST_EAT = Number(b.value);
    const EAT_TIME = Number(t.value);
    const REFILL_FOOD_TIME = Number(r.value);
    const CAT_COUNT = Number(n.value)


    const waitArray = []
    for (let i = 0; i < CAT_COUNT - 1; i++) {
        waitArray.push(WAITING_CAT_IMG)
    }
    waitingCats.innerHTML = waitArray.join('')
    fullCats.innerHTML = ''

    const catGone = async (num, allTime) => {
        status.innerHTML = `Котик ${num} уходит от миски🐈`
        const randomTime = Math.floor(Math.random() * 2) + 1
        await wait(randomTime)
        return allTime + randomTime
    }
    const catCame = async (num, allTime) => {
        status.innerHTML = `Котик ${num} подходит к миске😼`
        const randomTime = Math.floor(Math.random() * 2) + 1
        await wait(randomTime)
        return allTime + randomTime
    }

    let allTime = 0;
    while (currentCat <= CAT_COUNT) {
        if (foodCount > 0) {
            if (currentCat !== 1) {
                waitArray.pop();
                waitingCats.innerHTML = waitArray.join('')
                allTime = await catCame(currentCat, allTime)
            }
            catFaceImg.classList.remove('hide')
            status.innerHTML = `Котик ${currentCat} кушает🥹`
            if (foodCount - (CAT_MUST_EAT - catAte) >= 0) {
                await wait(EAT_TIME)
                allTime += EAT_TIME
                catFaceImg.classList.add('hide')
                if (currentCat + 1 <= CAT_COUNT) {
                    allTime = await catGone(currentCat, allTime)
                }
                fullCats.innerHTML += FULL_CAT_IMG
                currentCat++
                foodCount -= (CAT_MUST_EAT - catAte)
                catAte = 0
            } else {
                await wait(foodCount * EAT_TIME / CAT_MUST_EAT)
                allTime += foodCount * EAT_TIME / CAT_MUST_EAT
                catAte = foodCount
                foodCount = 0
                catFaceImg.classList.add('hide')
                allTime = await catGone(currentCat, allTime)
                waitArray.push(WAITING_CAT_IMG)
                waitingCats.innerHTML = waitArray.join('')
            }
        } else {
            fullBowlImg.classList.add('hide')
            emptyBowlImg.classList.remove('hide')
            foodImg.classList.remove('hide')
            status.innerHTML = `Бабушка пополняет миску😐`
            await wait(REFILL_FOOD_TIME)
            emptyBowlImg.classList.add('hide')
            foodImg.classList.add('hide')
            fullBowlImg.classList.remove('hide')
            allTime += REFILL_FOOD_TIME
            foodCount = MAX_FOOD_COUNT
        }
    }
    status.innerHTML = `Все покушали за ${allTime.toFixed(1)} секунд😊`
}

let disabled = false;

form.onsubmit = async (event) => {
    event.preventDefault();
    status.className = ''
    if (Number(m.value) < Number(b.value)) {
        status.className = 'status__screen--error'
        status.innerHTML = `Вместительность меньше чем ест котик😡`
    } else if (!disabled) {
        disabled = true;
        submitButton.disabled = true;
        await simulation();
        disabled = false;
        submitButton.disabled = false;
    }
}
