//Inspirasjon Vemund

let game_var = 0;
//Game variables
let playerMoney = 1000;

// round variables
let deck = [];

let currentBet = 0;

let playerCount = 0;
let dealerCount = 0;

let playerNumberOfCards = 0;
let dealerNumberOfCards = 0;
let player_stand = false;
let playerCards = [];
let dealerCards = [];  

function startScreenToggle (toggle) {
    if (toggle == "display") {
        start_screen = document.querySelector("#start-screen");
        start_screen.style.display = "grid";
    } else {
        start_screen = document.querySelector("#start-screen");
        start_screen.style.display = "none";
        displayBetScreen();
    }
}

function newGame() {
    let message_display = document.querySelector("#message-display");
    message_display.style.display = "none";
    startScreenToggle("display");
}

function game () {
    playerMoney = parseInt(document.querySelector("#start-money-input").value);
    if (playerMoney > 1000 || playerMoney <= 0 || isNaN(playerMoney)) {
        playerMoney = 1000;
    }
    displayMoney(playerMoney);
    startScreenToggle("remove");
}

function addMoneyToBet (amount) {
    let bet_size_input = document.querySelector("#bet-size-input");
    currentBet = parseInt(bet_size_input.value);
    isNaN(currentBet) ? currentBet = 0 : currentBet = currentBet;
    if ((currentBet + amount) < playerMoney) {
        currentBet += amount;
    } else {
        currentBet = playerMoney;
    };
    bet_size_input.value = currentBet;
}

function bet (betSize) {
    betSize = parseInt(betSize);
    if (betSize > playerMoney || isNaN(betSize)) {
        return
    }
    playerMoney -= betSize;
    currentBet = betSize;
    displayBet(currentBet);
    displayMoney();
    removeBetScreen();
    document.querySelector("#bet-size-input").value = "";
    newRound();
}

function roundEnd () {
    document.querySelector(".player-options").style.display = "none";
    toggleNewBetButton("display");
    moneyDeal();
    checkMoney();
    game_var = 0;
}

function newRound () {
    // Set gloabal variables to 0
    game_var = 1;
    deck = [];
    playerCount = 0;
    dealerCount = 0;
    player_stand = false;
    dealerNumberOfCards = 0;
    playerNumberOfCards = 0;
    playerCards = [];
    dealerCards = [];

    document.querySelector(".player-options").style.display = "grid";

    clearBoard();
    round();
}
function clearBoard () {
    for (let i = 1; i <= 5; i++) {
        let img = document.querySelector(`#card-dealer-${i}`);
        img.src = ``;
    }
    for (let i = 1; i <= 5; i++) {
        let img = document.querySelector(`#card-player-${i}`);
        img.src = ``;
    }
}
function round () {
    deck = makeDeck(1);
    drawCard("player");
    drawCard("player");

    drawCard("dealer");
    document.querySelector("#card-dealer-2").src = "./kort/baksiden.jpg"
    checkIfNatural ();
}

function checkIfNatural() {
    if (playerCount == 21) {
        drawCard("dealer");
    } else {
        return
    }
    
    if (playerCount == 21 && dealerCount != 21) {
        playerWon(1.5, "Won with natural");
    }
    if (playerCount == 21 && dealerCount == 21) {
        gameDraw();
    }
}

function drawCard (player, ...args) {
    let card;
    if (args.length > 0) {
        card = args[0];
    } else {
        card = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
    }
    player == "player" ? playerCards.push(card) : dealerCards.push(card);
    if (player == "player") {
        playerNumberOfCards++;
        displayCard(card, player, playerNumberOfCards);
        addCardToCount(card, player)
    } else {
        dealerNumberOfCards++;
        displayCard(card, player, dealerNumberOfCards);
        addCardToCount(card, "dealer")
    }
    improveAces(player);
    return card;
}

function makeDeck (decks) {
    let cardTypes = ['h', 'k', 'r', 's'];
    for (let k = 0; k < decks; k++) {
        for (let i = 0; i < 4; i++) {
            for (let j = 2; j < 15; j++) {
                deck.push(cardTypes[i] + j);
            }
        }
    }
    
    return deck;
}

function hitCard (isPlayer) {
    if (playerNumberOfCards <= 5) {
        drawCard("player");
        checkWhoWon();
    }
}
async function stand() {
    player_stand = true;
    while (dealerCount < 17) {
        drawCard("dealer");
        checkWhoWon();
    }
}


function addCardToCount (card, player) {
    let cardValue = parseInt(card.substring(1));
    if (cardValue != 14 && cardValue >= 10) {
        cardValue = 10;
    } else if (cardValue == 14) {
         cardValue = 11;
    }
    if (player == "player") {
        playerCount += cardValue;
        displayCardCount("player");
    } else {
        dealerCount += cardValue;
        displayCardCount("dealer");
    }
}

function checkWhoWon () {
    if (playerCount > 21) {
        dealerWon();
        return 0;
    }

    if (dealerCount > 21) {
        playerWon();
        return 1;
    }

    if (playerNumberOfCards == 5) {
        playerWon();
        return 1;
    }
    if (dealerNumberOfCards == 5) {
        dealerWon();
        return 0;
    }

    if (dealerCount > playerCount && player_stand) {
        dealerWon();
        return 0;
    }

    if (dealerCount >= 17 && playerCount > dealerCount) {
        playerWon();
        return 1;
    }

    if (dealerCount == playerCount && player_stand) {
        gameDraw();
        return -1
    }
}

function playerWon (multiplier = 1, ...args) {
    playerMoney += currentBet + currentBet * multiplier;

    roundEnd();
}
function dealerWon () {
    roundEnd();
}
function gameDraw() {
    playerMoney += currentBet;
    roundEnd();
}  

function moneyDeal () {
    currentBet = 0;
    displayBet(currentBet);
    displayMoney(playerMoney);
}

function improveAces (player) {
     if (player == "player") { 
        for (let i = 0; i < playerCards.length; i++) {
            if (playerCount > 21) {
                if (playerCards[i].substring(1) == "14") {
                    playerCount -= 10;
                    displayCardCount("player");
                    playerCards[i] = playerCards[i].charAt(0) + "1";
                };
            }
        }

        return;
     }

     if (player == "dealer") { 
        for (let i = 0; i < dealerCards.length; i++) {
            if (dealerCount > 21) {
                if (dealerCards[i].substring(1) == "14") {
                    dealerCount -= 10;
                    displayCardCount("dealer");
                    dealerCards[i] = dealerCards[i].charAt(0) + "1";
                };
            }
        }

        return;
     }
}

function checkMoney () {
    if (playerMoney == 0) {
        let message_display = document.querySelector("#message-display");
        message_display.style.display = "flex";
        toggleNewBetButton("remove");
    }
}

function displayBetScreen () {
    start_screen = document.querySelector("#bet-screen");
    start_screen.style.display = "grid";
    toggleNewBetButton("remove");
}

function toggleNewBetButton(toggle) {
    if (toggle == "display") {
        let buttonn = document.querySelector("#new-bet-button").style.display = "flex";
    } else if (toggle == "remove") {
        let buttonn = document.querySelector("#new-bet-button").style.display = "none";
    }
}

function removeBetScreen() {
    start_screen = document.querySelector("#bet-screen");
    start_screen.style.display = "none";
}

function displayCard (card, player, cardNum) {
    let img = document.querySelector(`#card-${player}-${cardNum}`);
    img.src = `./kort/${card}.png`;
}

function displayMoney () {
    document.querySelectorAll("#player-money-h2").forEach( (el) => {
        el.innerHTML= `Total Money: ${playerMoney}$`;
    });
}
function displayBet (betSize) {
    player_bet = document.querySelector("#player-bet-h2");
    player_bet.innerHTML = `Bet: ${betSize}$`;
}

function displayCardCount (player) {
    if (player == "player") {
        document.querySelector('#player-card-counter').innerHTML = `Player card count: ${playerCount}`;
    } else if (player == "dealer") {
        document.querySelector('#dealer-card-counter').innerHTML = `Dealer card count: ${dealerCount}`;
    } else {
        document.querySelector('#player-card-counter').innerHTML = `Player card count: ${playerCount}`;
        document.querySelector('#dealer-card-counter').innerHTML = `Dealer card count: ${dealerCount}`;
    }
}


// event listeners
document.querySelector("#start-money-input").addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        game();
    }
});

document.querySelector("#bet-size-input").addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        bet(e.target.value);
    }
});

document.addEventListener("keypress", (e) => {
    if (game_var == 0) {return}
    if (e.key == "h") {
        hitCard();
        return;
    }

    if (e.key == "s") {
        stand();
        return
    }
});
