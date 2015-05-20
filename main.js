var game = new Game();

function Game(){
  this.deckID = '';
  this.card = 0;
  this.turn = 1;
  this.playerHand = [];
  this.dealerHand = [];
  this.playerTotal = 0;
  this.dealerTotal = 0;
  this.save = [
    {
      hands: 0,
      handswon: 0,
      handslost: 0,
      handspushed: 0,
      moneywon: 0,
      moneylost: 0
    }
  ];
}

function gameReset(){
  game.deckID = '';
  game.card = 0;
  game.turn = 1;
  game.playerHand = [];
  game.dealerHand = [];
  game.playerTotal = 0;
  game.dealerTotal = 0;
  game.save = {
    hands: 0,
    handswon: 0,
    handslost: 0,
    handspushed: 0,
    moneywon: 0,
    moneylost: 0
  };
}

function handReset(){
  game.card = 0;
  game.turn = 1;
  game.playerHand = [];
  game.dealerHand = [];
  game.playerTotal = 0;
  game.dealerTotal = 0;
}

function swipeCards() {
  $('.dealer').empty();
  $('.player').empty();
}

$('.new_game').on('click', function(){
  gameReset();
  Game();
  getJSON('http://deckofcardsapi.com/api/shuffle/?deck_count=6', function (newDeck) {
    game.deckID = newDeck.deck_id;
    dealCards(game.deckID);
	})
})

$('.quit_game').on('click', function(){
  console.log(game.save);
  swipeCards();
})

function dealCards(deckID){
  handReset();
  getJSON('http://deckofcardsapi.com/api/draw/' + deckID + '/?count=4', function (newDeal){
    for (var i = 1; i < 5; i++){
      var card = newDeal.cards[i - 1];
      if (i % 2 != 0){
        game.playerHand.push(card);
      } else {
        game.dealerHand.push(card);
      }
    }
    showPlayerCards(game.playerHand);
    initDealerCards(game.dealerHand);
    pTotal(game.playerHand);
  })
}

function showPlayerCards(player){
  $('.player').empty();
  for(var i = 0; i < player.length; i++){
    var li = document.createElement('li');
    var img = document.createElement('IMG');
    var ul = document.querySelector('.player');
    img.setAttribute("class", "img_pCard");
    img.src = player[i].image;
    ul.appendChild(li);
    li.appendChild(img);
  };
}

function pTotal(playerHand){
  game.playerTotal = 0;
  for(var i = 0; i < playerHand.length; i++){
    game.card = playerHand[i].value;
    faceCheck(game.card);
    game.playerTotal = Number(game.card) + game.playerTotal;
    setTimeout(function () {totalCheck(game.playerTotal)}, 500);
  }
}

function totalCheck(total){
  if (game.playerHand.length === 2 && total === 21){
      alert('21!');
      game.turn = 0;
      var img = document.querySelector('.img_dCardDown');
      img.src = game.dealerHand[1].image;
      dTotal(game.dealerHand);
  } else if (total > 21) {
      alert('Bust! House wins...');
      handsLost();
  } else {
      return;
  }
}

function initDealerCards(dealer){
  console.log(dealer)
  $('.dealer').empty();
  for(var i = 0; i < dealer.length; i++){
    var li = document.createElement('li');
    var img = document.createElement('IMG');
    var ul = document.querySelector('.dealer');
    if (i === 0){
      img.setAttribute("class", "img_dCard");
      img.src = dealer[i].image;
    } else {
      img.setAttribute("class", "img_dCardDown");
      img.src = 'img/deck.png';
    }
    ul.appendChild(li);
    li.appendChild(img);
  };
}

function showDealerCards(dealer){
  console.log(dealer)
  $('.dealer').empty();
  for(var i = 0; i < dealer.length; i++){
    var li = document.createElement('li');
    var img = document.createElement('IMG');
    var ul = document.querySelector('.dealer');
    img.setAttribute("class", "img_dCard");
    img.src = dealer[i].image;
    ul.appendChild(li);
    li.appendChild(img);
  };
}

function dTotal(dealerHand){
  game.dealerTotal = 0;
  for(var i = 0; i < dealerHand.length; i++){
    game.card = dealerHand[i].value;
    faceCheck(game.card);
    game.dealerTotal = Number(game.card) + game.dealerTotal;
  }
  setTimeout(function () {dealerCheck(game.dealerTotal)}, 500);
}

function faceCheck(card){
  if (game.turn){
    var total = game.playerTotal;
  } else {
    total = game.dealerTotal;
  }
  if (card === "KING" || card === "QUEEN" || card === "JACK"){
      game.card = "10";
      console.log(game.card)
    } else if (card === "ACE" && total < 11){
      game.card = "11";
      console.log(game.card)
    } else if (card === "ACE" && total >= 10){
      game.card = "1";
      console.log(game.card)
    } else {
      card = game.card;
    }
    return Number(game.card);
}

function dealerDraw() {
  getJSON('http://deckofcardsapi.com/api/draw/' + game.deckID + '/?count=1', function (draw) {
    game.dealerHand.push(draw.cards[0]);
    showDealerCards(game.dealerHand);
    dTotal(game.dealerHand);
  })
}

function dealerCheck(total){
  if (total < 17){
    dealerDraw();
  } else if (total > 21) {
      alert('House busts! You win...');
      handsWon();
  } else if (total >= 17){
    compareHands(game.playerTotal, game.dealerTotal);
  }
}

function compareHands(player, dealer){
  if (player > dealer){
    alert('You win! House pays...');
    handsWon();
  } else if (player === dealer) {
      alert('Push');
      game.save.handspushed += 1;
      game.save.hands += 1;
      swipeCards();
      dealCards(game.deckID);
  } else {
      alert('House wins! You pay...');
      handsLost();
  }
}

function handsWon(){
  game.save.handswon += 1;
  game.save.hands += 1;
  swipeCards();
  dealCards(game.deckID);
}

function handsLost(){
  game.save.handslost += 1;
  game.save.hands += 1;
  swipeCards();
  dealCards(game.deckID);
}

$('.stay').on('click', function(){
  game.turn = 0;
  var img = document.querySelector('.img_dCardDown');
  img.src = game.dealerHand[1].image;
  dTotal(game.dealerHand);
})

$('.hit').on('click', function(){
  getJSON('http://deckofcardsapi.com/api/draw/' + game.deckID + '/?count=1', function (hit) {
    game.playerHand.push(hit.cards[0]);
    showPlayerCards(game.playerHand);
    pTotal(game.playerHand);
  })
})

function getJSON(url, cb) {
  JSONP_PROXY = 'https://jsonp.afeld.me/?url='
  // THIS WILL ADD THE CROSS ORIGIN HEADERS

  var request = new XMLHttpRequest();
  request.open('GET', JSONP_PROXY + url);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      cb(JSON.parse(request.responseText));
    }
  };

	request.send();
}