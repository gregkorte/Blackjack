var game = new Game();

function Game(){
  this.deckID = '';
  this.card = 0;
  this.playerHand = [];
  this.dealerHand = [];
  this.playerTotal = 0;
  this.dealerTotal = 0;
}
//When I click the New Game button I want to deal four cards
  //>>>>>create new instance of game<<<<<//
	//>>>>>Initial JSON call to shuffle cards<<<<//
	//>>>>>Second JSON call to deal cards<<<<//
$('.new_game').on('click', function(){
  Game();
  getJSON('http://deckofcardsapi.com/api/shuffle/?deck_count=6', function (newDeck) {
    game.deckID = newDeck.deck_id;
    dealCards(game.deckID);
	})
})
//Two cards go to the Player
//Two cards go to the Dealer
	//The last Dealer card should be face down
function dealCards(deckID){
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
    showDealerCards(game.dealerHand);
    pTotal(game.playerHand);
    dTotal(game.dealerHand);
  })
}

//Shows player cards
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


//Shows dealer cards
function showDealerCards(dealer){
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

//Totals player hand
function pTotal(playerHand){
  game.playerTotal = 0;
  for(var i = 0; i < playerHand.length; i++){
    game.card = playerHand[i].value;
    faceCheck(game.card);
    game.playerTotal = Number(game.card) + game.playerTotal;
    totalCheck(game.playerTotal);
  }
}

//Totals dealer hand
function dTotal(dealerHand){
  for(var i = 0; i < dealerHand.length; i++){
    var card = dealerHand[i].value;
    faceCheck(card);
    game.dealerTotal = Number(card) + game.dealerTotal;
    totalCheck(game.dealerTotal)
  }
}

//Checks total
function totalCheck(total){
  if (total > 21){
      alert('Bust! House wins...');
    } else {
      console.log(game.playerTotal);
    }
}


//Checks for face cards & applies number value
function faceCheck(card){
  if (game.dealerTotal){
    var total = dealerTotal;
  } else {
    total = playerTotal;
  }
  if (card === "KING" || card === "QUEEN" || card === "JACK"){
      game.card = "10";
    } else if (card === "ACE" && total < 11){
      game.card = "11";
    } else if (card === "ACE" && total >= 10){
      game.card = "1";
    } else {
      card = game.card;
    }
    return Number(game.card);
}
//IF>>>>
	//Player presses the Stay button
		//Score will be totaled
		//Dealer will take turn
$('.stay').on('click', function(){
  console.log('Stay clicked')
  dealerCheck(game.dealerTotal);
})
//ELSE IF>>>
	//Player presses the Hit button
		//Score will be totaled
$('.hit').on('click', function(){
  getJSON('http://deckofcardsapi.com/api/draw/' + game.deckID + '/?count=1', function (hit) {
    game.playerHand.push(hit.cards[0]);
    showPlayerCards(game.playerHand);
    pTotal(game.playerHand);
  })
})
			//IF>>>>
				//Score is over 21
					//Alert "Sorry you busted", House wins!
			//ELSE IF>>>>
				//Score is under 21
					//Add card value to total
						//Wait for next input
//When Player turn is over:
	//Check the value of the cards in the Dealer's hand
function dealerCheck(total){
  if (total < 16){
    dealerDraw();
  } else if (total >= 17){
    compareScores();
  }
}
    //IF>>>>
			//Total is 17 or over
				//Compute Dealer hand vs Player hand
					//Declare winner.
						//Redeal
		//ELSE IF>>>>
			//Total is under 17
				//Add card to Dealer's hand
					//Compute Dealer hand ::REPEAT AS NECCESSARY

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