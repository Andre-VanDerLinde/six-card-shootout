# Six Card Shootout
#### By Andre Van Der Linde
- **How it works:**
	- Each hand starts with 6 cards pulled from a deck of 52 cards.
	- Each player gets to place one card per turn. 
	- When a player clicks their hand it places a card from the top of their hand onto table. 
	- Once the round is over the played cards are discarded into the junk pile. 
- **Winning Conditions:**
	- Highest value card wins. 
	- Loser has to pick a card from deck, winner does not. 
	- If its a draw both players pick a card from the deck.
	- Objective is to have no cards left or the person with the least cards when the deck is empty wins.
- **Technical Details:**
	- API Link: https://deckofcardsapi.com/
	- Table:
		- app.jsx
	- Table holds deck, 2 hands (could add more),  2 played cards, and a junk pile. 
		- Deck.jsx
			- APIURL: https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
			- Response Example: 
			![[Pasted image 20250403173001.png]]
		- Hand.jsx (player1) AND Hand.jsx (player2)
			- Start Game by drawing 6 cards:
				- APIURL: https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=6
				- Response Example:				
                ![[Pasted image 20250403173141.png]]
			- Add drawn cards to hand (do this in a forEach loop or map):
				- APIURL: https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=AS,2S
				- Response Example:
				![[Pasted image 20250403174724.png]]
			- When hand clicked pass state of pile to PlayedCard and proceed
		- PlayedCard.jsx (player1) AND  PlayedCard.jsx (player2)
			- Draw from player hand pile"
				- APIURL: https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/draw/?count=2
				- Response Example:
                ![[Pasted image 20250403180834.png]]
			- Add played cards to new pile for comparison:
				- APIURL: https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=AS
				- Response Example:
				![[Pasted image 20250403174724.png]]
		- Junk.jsx
			- Once Round Over take all cards from PlayedCard Piles and add them to this junk pile
			-  APIURL: https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=AS
			- Response Example:
			![[Pasted image 20250403174724.png]]
