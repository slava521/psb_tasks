const form = document.querySelector('#form')
const n = document.querySelector('#n')
const b = document.querySelector('#b')
const m = document.querySelector('#m')
const t = document.querySelector('#t')
const r = document.querySelector('#r')
const submitButton = document.querySelector('#submitButton')

const status = document.querySelector('#status')

const wait = time => new Promise(r => setTimeout(r, time * 1000))

const simulation = async () => {
    let currentCat = 1;
    let foodCount = Number(m.value);
    let catAte = 0;
    const MAX_FOOD_COUNT = Number(m.value);
    const CAT_MUST_EAT = Number(b.value);
    const EAT_TIME = Number(t.value);
    const REFILL_FOOD_TIME = Number(r.value);
    const CAT_COUNT = Number(n.value)

    const catGone = async (num, allTime) => {
        status.innerHTML = `Котик ${num} ушел🐈`
        const randomTime = Math.floor(Math.random() * 2) + 1
        await wait(randomTime)
        return allTime + randomTime
    }
    const catCame = async (num, allTime) => {
        status.innerHTML = `Котик ${num} пришел😼`
        const randomTime = Math.floor(Math.random() * 2) + 1
        await wait(randomTime)
        return allTime + randomTime
    }

    let allTime = 0;
    while (currentCat <= CAT_COUNT) {
        if (foodCount > 0) {
            if (currentCat !== 1) {
                allTime = await catCame(currentCat, allTime)
            }
            status.innerHTML = `Котик ${currentCat} кушает🥹`
            if (foodCount - (CAT_MUST_EAT - catAte) >= 0) {
                await wait(EAT_TIME)
                allTime+=EAT_TIME
                if (currentCat + 1 <= CAT_COUNT) {
                    allTime = await catGone(currentCat, allTime)
                }
                currentCat += 1
                foodCount -= (CAT_MUST_EAT - catAte)
                catAte = 0
            } else {
                await wait(foodCount * EAT_TIME / CAT_MUST_EAT)
                allTime+=foodCount * EAT_TIME / CAT_MUST_EAT
                catAte = foodCount
                foodCount=0
                allTime = await catGone(currentCat, allTime)
            }
        }
        else {
            status.innerHTML = `Бабушка пополняет миску😐`
            await wait(REFILL_FOOD_TIME)
            allTime+=REFILL_FOOD_TIME
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
    }
    else if (!disabled) {
        disabled = true;
        submitButton.disabled = true;
        await simulation();
        disabled = false;
        submitButton.disabled = false;
    }
}
