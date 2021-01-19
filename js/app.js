const menu = document.getElementById('menu'),
    app = document.getElementById('app');

let cards = {
        opponent: {
            name: '',
            cards: [],
            points: 0
        },
        mine: {
            name: '',
            cards: [],
            points: 0
        }
    },
    setRounds = 7;
timeout = false;

fadeIn = (el) => {
    el.classList.add('fade');
    setTimeout(() => {
        el.classList.remove('fade');
    }, 1500)
}

random = (min, max) => {
    return Math.floor((Math.random() * max) + min)
}

newGame = () => {
    randomCards('mine');
    randomCards('opponent');

    createTable();

    showCards('mine');

    chooseCard();
}

showSettings = () => {
    let div = document.createElement('div');
    div.className = 'settings';
    div.innerHTML = `
    <div class="settings" id="settings-box">
        <div class="settings__box">
            <h2 class="text text--sm">Ustawienia</h2>
            <button class="btn--circle" id="btn-close"></button>
        </div>
    </div>`;
    app.appendChild(div);
    fadeIn(div);
    
    document.getElementById('btn-close').addEventListener('click', () => {
       document.querySelector('.settings').remove();
    })
}

createTable = () => {
    let main = document.createElement('main');
    main.className = 'main';
    main.innerHTML = `
        <section class="cards cards__active" id="active">
            <p class="cards__result">
                <span>Opponent</span>
                <span class="text text--lg" id="opponent-result">0</span>
            </p>
            <div class="cards__tile" id="opponent-card"></div>
            <div class="cards__tile" id="mine-card"></div>
            <p class="cards__result">
                <span>Trxior</span>
                <span class="text text--lg" id="mine-result">0</span>
            </p>
        </section>
        <section class="cards cards__mine" id="mine"></section>`;
    app.appendChild(main);
    fadeIn(main);
}

randomCards = (player) => {
    rounds = setRounds;
    cards[player].cards.length = 0;
    cards[player].points = 0;

    for (let i = 0; i < rounds; i++) {
        cards[player].cards.push(i + 1);
    }
}

createCard = (el, num, back) => {
    let item = document.createElement('div');
    item.classList.add('cards__item');
    if (back) {
        item.innerHTML = null;
    } else {
        item.innerHTML = num;
    }
    el.appendChild(item);
    fadeIn(item);
}

showCards = (player) => {
    let x = document.getElementById(player),
        z = false;
    x.innerHTML = null;

    if (player === 'opponent') {
        z = true;
    }

    for (let i = 0; i < cards[player].cards.length; i++) {
        createCard(x, cards[player].cards[i], z);
    }
}

removeCard = (el, speed = 750) => {
    let seconds = speed / 1500;
    el.style.transition = `all ${seconds/2}s ease`;
    el.style.opacity = 0;
    setTimeout(() => {
        el.style.width = 0;
        el.style.height = 0;
        el.style.margin = 0;
        el.addEventListener('transitionend', () => {
            el.remove();
        });
    }, speed);
}

chooseCard = () => {
    document.querySelectorAll('#mine .cards__item').forEach((e, n) => {
        e.addEventListener('click', () => {

            if (timeout === false) {
                timeout = true;
                const mineCard = cards.mine.cards[n],
                    randomNum = random(0, cards.opponent.cards.length),
                    opponentCard = cards.opponent.cards[randomNum],
                    points = mineCard + opponentCard,
                    firstCard = document.getElementById('opponent-card'),
                    secondCard = document.getElementById('mine-card');

                displayPoints(mineCard, opponentCard, points);

                rounds--;
                cards.opponent.cards.splice(randomNum, 1);

                removeCard(e);
                createCard(secondCard, mineCard);
                createCard(firstCard, opponentCard);

                setTimeout(() => {
                    removeCard(secondCard.childNodes[0]);
                    removeCard(firstCard.childNodes[0]);
                    setTimeout(() => {
                        timeout = false;
                    }, 1000);
                    checkResults();
                }, 2000);
            } else {
                console.log('Wait a moment!');
            }

        })
    })
}

displayPoints = (a, b, pts) => {
    if (a > b) {
        cards.mine.points += pts;
    } else if (b > a) {
        cards.opponent.points += pts;
    } else {
        cards.mine.points += a;
        cards.opponent.points += b;
    }

    document.getElementById('mine-result').innerHTML = cards.mine.points;
    document.getElementById('opponent-result').innerHTML = cards.opponent.points;
}

checkResults = () => {
    if (rounds === 0) {
        if (cards.mine.points > cards.opponent.points) {
            mine.innerHTML = `<span class="text">You won!</span>`;
        } else if (cards.opponent.points > cards.mine.points) {
            mine.innerHTML = `<span class="text">Opponent won!</span>`;
        } else {
            mine.innerHTML = `<span class="text">Draw!</span>`;
        }
        fadeIn(mine);
        mine.appendChild(menu);
        fadeIn(menu);
    }
}

start = () => {
    document.getElementById('new-game').addEventListener('click', () => {
        menu.classList.add('menu--absolute');
        app.innerHTML = null;
        return newGame();
    })
    
    document.getElementById('settings').addEventListener('click', () => {
        return showSettings();
    })
}

start();
