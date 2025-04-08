import React from 'react';

const PlayedCard = ({ player, card }) => {
  return (
    <div className="played-card">
      <h3>{player}'s Played Card</h3>
      {card ? (
        <img src={card.image} alt={card.code} width={80} />
      ) : (
        <p>No card played yet</p>
      )}
    </div>
  );
};

export default PlayedCard;
