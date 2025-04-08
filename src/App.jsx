import React, { useEffect, useState } from 'react';
import Hand from './Hand';
import PlayedCard from './PlayedCard';

const App = () => {
  const [deckId, setDeckId] = useState('');
  const [hasPlayed, setHasPlayed] = useState({ p1: false, p2: false });
  const [player1Hand, setPlayer1Hand] = useState([]);
  const [player2Hand, setPlayer2Hand] = useState([]);
  const [playedCards, setPlayedCards] = useState({ p1: null, p2: null });
  const [roundResult, setRoundResult] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [remaining, setRemaining] = useState(52); // track how many cards left in deck


  // Fetch deck on mount
  useEffect(() => {
    const initGame = async () => {
      const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const data = await res.json();
      setDeckId(data.deck_id);

      // Draw 12 cards (6 each)
      const drawRes = await fetch(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=12`);
      const drawData = await drawRes.json();

      setPlayer1Hand(drawData.cards.slice(0, 6));
      setPlayer2Hand(drawData.cards.slice(6, 12));
    };

    initGame();
  }, []);

  const drawCardToPlayer = async (playerKey) => {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await res.json();
  
    setRemaining(data.remaining); // Track deck count
  
    if (data.success && data.cards.length > 0) {
      const card = data.cards[0];
      if (playerKey === 'p1') {
        setPlayer1Hand((prev) => [...prev, card]);
      } else {
        setPlayer2Hand((prev) => [...prev, card]);
      }
    }
  };
  

  useEffect(() => {
    const resolveRound = async () => {
      if (!playedCards.p1 || !playedCards.p2 || gameOver) return;
  
      const getValue = (val) => {
        const face = { JACK: 11, QUEEN: 12, KING: 13, ACE: 14 };
        return face[val] || parseInt(val);
      };
  
      const val1 = getValue(playedCards.p1.value);
      const val2 = getValue(playedCards.p2.value);
  
      let result = '';
      if (val1 > val2) {
        result = 'p1';
        setRoundResult('🟦 Player 1 Wins the Round!');
        await drawCardToPlayer('p2');
      } else if (val2 > val1) {
        result = 'p2';
        setRoundResult('🟥 Player 2 Wins the Round!');
        await drawCardToPlayer('p1');
      } else {
        result = 'tie';
        setRoundResult('🤝 It\'s a Draw!');
        await Promise.all([drawCardToPlayer('p1'), drawCardToPlayer('p2')]);
      }
  
      // Check for game over
      const p1Empty = player1Hand.length === 0;
      const p2Empty = player2Hand.length === 0;
      const deckEmpty = remaining === 0;
  
      if (p1Empty || p2Empty || deckEmpty) {
        setGameOver(true);
  
        if (p1Empty && !p2Empty) {
          setRoundResult('🎉 Player 1 wins the game!');
        } else if (p2Empty && !p1Empty) {
          setRoundResult('🎉 Player 2 wins the game!');
        } else {
          const p1Count = player1Hand.length;
          const p2Count = player2Hand.length;
          if (p1Count < p2Count) {
            setRoundResult('🏁 Deck is empty — Player 1 has fewer cards and wins!');
          } else if (p2Count < p1Count) {
            setRoundResult('🏁 Deck is empty — Player 2 has fewer cards and wins!');
          } else {
            setRoundResult('🏁 Deck is empty — It\'s a draw!');
          }
        }
  
        return;
      }
  
      // Reset round after delay
      setTimeout(() => {
        setPlayedCards({ p1: null, p2: null });
        setHasPlayed({ p1: false, p2: false });
      }, 1500);
    };
  
    resolveRound();
  }, [playedCards]);
  
  const restartGame = async () => {
    setGameOver(false);
    setRoundResult('');
    setPlayedCards({ p1: null, p2: null });
    setHasPlayed({ p1: false, p2: false });
  
    // Get a new shuffled deck
    const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await res.json();
    setDeckId(data.deck_id);
    setRemaining(52);
  
    // Draw 12 cards (6 each)
    const drawRes = await fetch(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=12`);
    const drawData = await drawRes.json();
  
    setPlayer1Hand(drawData.cards.slice(0, 6));
    setPlayer2Hand(drawData.cards.slice(6, 12));
  };  

  return (
    <div className="game-container">
      <h1>Six Card Shootout 🤠</h1>
      <div className="hands">
        <Hand
          player="Player 1"
          hand={player1Hand}
          setHand={setPlayer1Hand}
          setPlayedCard={(card) =>
            setPlayedCards((prev) => ({ ...prev, p1: card }))
          }
          hasPlayed={hasPlayed.p1}
          setHasPlayed={(val) =>
            setHasPlayed((prev) => ({ ...prev, p1: val }))
          }
        />

        <Hand
          player="Player 2"
          hand={player2Hand}
          setHand={setPlayer2Hand}
          setPlayedCard={(card) =>
            setPlayedCards((prev) => ({ ...prev, p2: card }))
          }
          hasPlayed={hasPlayed.p2}
          setHasPlayed={(val) =>
            setHasPlayed((prev) => ({ ...prev, p2: val }))
          }
        />
      </div>

      <div className="played-cards">
        <PlayedCard player="Player 1" card={playedCards.p1} />
        <PlayedCard player="Player 2" card={playedCards.p2} />
      </div>

      {roundResult && (
        <div className="round-result">
          <h2>{roundResult}</h2>
        </div>
      )}
      
      {gameOver && (
        <div className="game-over-controls">
          <h1>🎮 Game Over</h1>
          <button onClick={restartGame} className="restart-btn">🔁 Restart Game</button>
        </div>
      )}

    </div>
  );
};

export default App;