// create registrations on landing page
const registrationContainer = document.createElement('div');
registrationContainer.classList.add('container', 'form-signin', 'bg-light');

// create registration elements: email and pw
const registrationText = document.createElement('h2');
registrationText.innerText = 'Registration Form';

const regEmailDiv = document.createElement('div');
regEmailDiv.classList.add('form-floating');
const regEmail = document.createElement('input');
regEmail.placeholder = 'Input Email';

const regPasswordDiv = document.createElement('div');
regPasswordDiv.classList.add('form-floating');
const regPassword = document.createElement('input');
regPassword.placeholder = 'Input Password';

const registrationBtn = document.createElement('button');
registrationBtn.innerText = 'Register';

regEmailDiv.appendChild(regEmail);
regPasswordDiv.appendChild(regPassword);
registrationContainer.appendChild(registrationText);
registrationContainer.appendChild(regEmailDiv);
registrationContainer.appendChild(regPasswordDiv);
registrationContainer.appendChild(registrationBtn);
document.body.appendChild(registrationContainer);

// ************** create login on landing page **************//
const loginContainer = document.createElement('div');
loginContainer.classList.add('container', 'form-signin', 'bg-light');

// create login elements: email and pw
const loginText = document.createElement('h2');
loginText.innerText = 'Login Form';

const emailDiv = document.createElement('div');
emailDiv.classList.add('form-floating');
const email = document.createElement('input');
email.placeholder = 'Input Email';

const passwordDiv = document.createElement('div');
passwordDiv.classList.add('form-floating');
const password = document.createElement('input');
password.placeholder = 'Input Password';

const loginBtn = document.createElement('button');
loginBtn.innerText = 'Login';

emailDiv.appendChild(email);
passwordDiv.appendChild(password);
loginContainer.appendChild(loginText);
loginContainer.appendChild(emailDiv);
loginContainer.appendChild(passwordDiv);
loginContainer.appendChild(loginBtn);
document.body.appendChild(loginContainer);

// create game btn
const createGameBtn = document.createElement('button');

registrationBtn.addEventListener('click', () => {
  const registerData = {
    email: regEmail.value,
    password: regPassword.value,
  };
  console.log(registerData);
  axios
    .post('/register', registerData)
    .then((response) => {
      console.log('hellloow>>>>>>', response.data);
      if (!response.data.error)
      {
        document.body.removeChild(registrationContainer);
        registrationContainer.innerHTML = '';
      }
    });
});

loginBtn.addEventListener('click', () => {
  const loginData = {
    email: email.value,
    password: password.value,
  };
  console.log(loginData);
  axios
    .post('/login', loginData)
    .then((response) => {
      console.log('hellloow>>>>>>', response.data);
      if (!response.data.error)
      {
        document.body.appendChild(createGameBtn);
        loginContainer.innerHTML = '';
        document.body.removeChild(loginContainer);
        document.body.removeChild(registrationContainer);
      }
    });
});
// ************** card container **************//
const cardContainer = document.createElement('div');
cardContainer.classList.add('container', 'form-signin', 'bg-light');

// ************** create player 1 elements **************//
const p1Hand = document.createElement('h5');
p1Hand.innerText = 'Player 1 Card';

const p1Card = document.createElement('h6');
p1Card.classList.add('form-floating');

// ************** create player 2 elements **************
const p2Hand = document.createElement('h5');
p2Hand.innerText = 'Player 2 Card';

const p2Card = document.createElement('h6');
p2Card.classList.add('form-floating');

const result = document.createElement('h5');
result.innerText = 'Result';

const winner = document.createElement('h6');
winner.classList.add('form-floating');

cardContainer.appendChild(p1Hand);
cardContainer.appendChild(p1Card);
cardContainer.appendChild(p2Hand);
cardContainer.appendChild(p2Card);
cardContainer.appendChild(result);
cardContainer.appendChild(winner);

// global value that holds info about the current hand.
let currentGame = null;

// DOM manipulation function that displays the player's current hand.
const runGame = function ({
  player1Hand, player2Hand, result, player1Score, player2Score,
}) {
  // manipulate DOM
  const gameContainer = document.querySelector('#game-container');

  p1Card.innerHTML = `
    Player1 Hand:
    ====
    ${player1Hand.name}
    of
    ${player1Hand.suit}
    ====
  `;
  p2Card.innerHTML = `
      Player2 Hand:
    ====
    ${player2Hand.name}
    of
    ${player2Hand.suit}
    ====
  `;
  winner.innerHTML = `
    ${result}
    <br>
    Player1 Score: ${player1Score}
     <br>
    Player2 Score: ${player2Score}
  `;
  gameContainer.appendChild(cardContainer);
  console.log('player1Hand :>> ', player1Hand);
  console.log('player2Hand :>> ', player2Hand);
};

// make a request to the server
// to change the deck. set 2 new cards into the player hand.
const dealCards = function () {
  axios.put(`/games/${currentGame.id}/deal`)
    .then((response) => {
      // get the updated hand value
      currentGame = response.data;

      // display it to the user
      runGame(currentGame);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

const refresh = function () {
  const gameId = {
    id: currentGame.id,
  };
  axios
    .post('/refresh', gameId)
    .then((response) => {
      p1Card.innerHTML = '';
      p2Card.innerHTML = '';
      winner.innerHTML = '';
      console.log(response.data);
      p1Card.innerHTML = `
        Player1 Hand:
        ====
        ${response.data.player1Hand.name}
        of
        ${response.data.player1Hand.suit}
        ====
      `;
      p2Card.innerHTML = `
          Player2 Hand:
        ====
        ${response.data.player2Hand.name}
        of
        ${response.data.player2Hand.suit}
        ====
      `;
      winner.innerHTML = `
        ${response.data.result}
        <br>
        Player1 Score: ${response.data.player1Score}
         <br>
        Player2 Score: ${response.data.player2Score}
      `;
    });
};
const createGame = function () {
  document.body.removeChild(createGameBtn);
  // Make a request to create a new game
  axios.post('/games')
    .then((response) => {
      // set the global value to the new game.
      currentGame = response.data;

      console.log(currentGame);

      // display it out to the user
      runGame(currentGame);

      // for this current game, create a button that will allow the user to
      // manipulate the deck that is on the DB.
      // Create a button for it.
      const dealBtn = document.createElement('button');
      dealBtn.addEventListener('click', dealCards);
      const refreshBtn = document.createElement('button');
      refreshBtn.addEventListener('click', refresh);
      // display the button
      dealBtn.innerText = 'Deal';
      document.body.appendChild(dealBtn);
      refreshBtn.innerText = 'Refresh';
      document.body.appendChild(refreshBtn);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

// manipulate DOM, set up create game button
createGameBtn.addEventListener('click', createGame);
createGameBtn.innerText = 'Create Game';
// document.body.appendChild(createGameBtn);
