import React from 'react';

const Hand = ({ player, hand, setHand, setPlayedCard, hasPlayed, setHasPlayed }) => {
  const playCard = () => {
    if (hand.length === 0 || hasPlayed) return;

    const [cardToPlay, ...rest] = hand;
    setHand(rest);
    setPlayedCard(cardToPlay);
    setHasPlayed(true);
  };

  return (
    <div className="hand">
      <h2>{player}</h2>
      <button onClick={playCard} disabled={hasPlayed}>Play Top Card</button>
      <div className="hand-cards">
        {hand.map((card, i) => (
          <img
            key={i}
            src="https://deckofcardsapi.com/static/img/back.png"
            alt="Card back"
            width={60}
          />
        ))}
      </div>
    </div>
  );
};

export default Hand;
