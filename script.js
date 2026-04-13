// ---------- KORTŲ KALADĖ ----------
const SUITS = ['S', 'C', 'D', 'H'];      // Spades, Clubs, Diamonds, Hearts
const VALUES = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

let deck = [];          // kortų objektų masyvas
let playerCards = [];
let compCards = [];
let gameActive = false;

// DOM elementai
const playerCardsDiv = document.getElementById('playerCards');
const compCardsDiv = document.getElementById('compCards');
const playerPointsSpan = document.getElementById('playerPoints');
const compPointsSpan = document.getElementById('compPoints');
const cardsLeftSpan = document.getElementById('cardsLeft');
const messageDiv = document.getElementById('message');
const controlsDiv = document.getElementById('controls');

// ---------- Pagalbinės funkcijos ----------
function getCardValue(card) {
  if (card.value === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card.value)) return 10;
  return parseInt(card.value);
}

// Sukuria kaladę (52 kortos, sumaišo)
function createDeck() {
  const newDeck = [];
  for (let suit of SUITS) {
    for (let val of VALUES) {
      newDeck.push({
        value: val,
        suit: suit,
        img: `assets/img/cards/${val}${suit}.png`   // kelias pagal tavo kortų failus
      });
    }
  }
  // Fisher-Yates maišymas
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

// Apskaičiuoja rankos taškus (su tūzo logika)
function calculatePoints(hand) {
  let sum = 0;
  let aces = 0;
  for (let card of hand) {
    let val = getCardValue(card);
    sum += val;
    if (card.value === 'A') aces++;
  }
  while (sum > 21 && aces > 0) {
    sum -= 10;   // tūzas nuo 11 virsta 1
    aces--;
  }
  return sum;
}

// Atvaizduoja kortas HTML
function renderCards() {
  // Žaidėjas
  playerCardsDiv.innerHTML = '';
  playerCards.forEach(card => {
    const img = document.createElement('img');
    img.src = card.img;
    img.alt = `${card.value}${card.suit}`;
    playerCardsDiv.appendChild(img);
  });

  // Kompiuteris (jei žaidimas aktyvus – rodom tik pirmą kortą, kitas užverstas)
  compCardsDiv.innerHTML = '';
  compCards.forEach((card, idx) => {
    const img = document.createElement('img');
    if (gameActive && idx === 0) {
      img.src = card.img;
    } else if (!gameActive) {
      img.src = card.img;
    } else {
      img.src = 'assets/img/cards/back.png';   // užversta korta
    }
    img.alt = `${card.value}${card.suit}`;
    compCardsDiv.appendChild(img);
  });

  playerPointsSpan.textContent = calculatePoints(playerCards);
  if (!gameActive) {
    compPointsSpan.textContent = calculatePoints(compCards);
  } else {
    // žaidimo metu rodome tik pirmos kortos taškus (apytikriai)
    if (compCards.length > 0) {
      const firstCardVal = getCardValue(compCards[0]);
      compPointsSpan.textContent = `${firstCardVal} + ?`;
    } else {
      compPointsSpan.textContent = '0';
    }
  }
  cardsLeftSpan.textContent = deck.length;
}

// Žaidimo pabaiga
function endGame(message) {
  gameActive = false;
  messageDiv.textContent = message;
  renderCards();  // parodome visas kompiuterio kortas
  compPointsSpan.textContent = calculatePoints(compCards);
  // Pridedame mygtuką "Naujas žaidimas"
  controlsDiv.innerHTML = '<button id="newGameBtn">🎲 Naujas žaidimas</button>';
  document.getElementById('newGameBtn').addEventListener('click', () => location.reload());
}

// Kompiuterio ėjimas
function computerTurn() {
  let compSum = calculatePoints(compCards);
  while (compSum < 17 && deck.length > 0) {
    const newCard = deck.pop();
    compCards.push(newCard);
    compSum = calculatePoints(compCards);
  }
  renderCards();

  const playerSum = calculatePoints(playerCards);
  if (compSum > 21) endGame('🎉 Kompiuteris pralaimėjo! Tu laimėjai! 🎉');
  else if (compSum > playerSum) endGame('🤖 Kompiuteris laimėjo...');
  else if (compSum === playerSum) endGame('😲 Lygiosios!');
  else endGame('🎉 Tu laimėjai! 🎉');
}

// Žaidėjas pasiima dar vieną kortą
function playerHit() {
  if (!gameActive) return;
  if (deck.length === 0) {
    endGame('🍂 Kortų nebėra – lygiosios.');
    return;
  }
  const newCard = deck.pop();
  playerCards.push(newCard);
  renderCards();

  const playerSum = calculatePoints(playerCards);
  if (playerSum > 21) {
    endGame('💀 BUST! Pralaimėjai...');
  } else if (playerSum === 21) {
    endGame('🎉 BLACKJACK! Tu laimėjai! 🎉');
  }
}

// Žaidėjas sustoja
function playerStand() {
  if (!gameActive) return;
  gameActive = false;
  renderCards();
  computerTurn();
}

// Pradeda naują partiją
function startNewGame() {
  deck = createDeck();
  playerCards = [];
  compCards = [];
  gameActive = true;

  // Pradinis dalijimas
  playerCards.push(deck.pop());
  compCards.push(deck.pop());
  playerCards.push(deck.pop());
  compCards.push(deck.pop());

  renderCards();
  messageDiv.textContent = 'Tavo eilė – imk kortą arba sustok.';

  // Sukuriame mygtukus
  controlsDiv.innerHTML = `
    <button id="hitBtn">🃏 Imti kortą</button>
    <button id="standBtn">✋ Sustoti</button>
  `;
  document.getElementById('hitBtn').addEventListener('click', playerHit);
  document.getElementById('standBtn').addEventListener('click', playerStand);

  // Patikriname, ar iškart blackjack
  const playerSum = calculatePoints(playerCards);
  if (playerSum === 21) {
    endGame('🎉 BLACKJACK! Tu laimėjai! 🎉');
  }
}

// Paleidžiame žaidimą
document.getElementById('startBtn').addEventListener('click', () => {
  startNewGame();
});
