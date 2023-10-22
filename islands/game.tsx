import { selectRandom, getAvailableSynonyms } from "../lib/main.ts";
import { useState, useEffect } from 'preact/hooks';
import Message from '../components/message.tsx';

export default function Game({ dictionary, answer, startingSynonym }) {
  const [currentSynonyms, setCurrentSynonyms] = useState<string[]>([startingSynonym]);
  const [availableSynonyms, setAvailableSynonyms] = useState<string[]>(getAvailableSynonyms(answer.synonyms, currentSynonyms));
  const [guess, setGuess] = useState<string>('');

  const [gameOver, setGameOver] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guess) return;

    if (currentSynonyms.includes(guess)) {
      setMessage('Invalid guess!')
      setGuess('');
      return;
    }

    if (guess === answer.word) {
      setMessage('Correct! You won!')
      setGameOver(true);
      return;
    }

    if (availableSynonyms.includes(guess)) {
      const updatedCurrentSynonyms = [...currentSynonyms, guess];
      const updatedAvailableSynonyms = availableSynonyms.filter(synonym => synonym !== guess);

      setCurrentSynonyms(updatedCurrentSynonyms);
      setAvailableSynonyms(updatedAvailableSynonyms);
      setMessage("You're on the right track!");
      setGuess('');
    } else if (availableSynonyms.length === 0) {
      setMessage(`You lost! The word was ${answer.word}`);
      setGameOver(true);
      return;
    } else {
      setMessage('Wrong! Try again!');
      const randomAvailableSynonym = selectRandom(availableSynonyms);
      const updatedCurrentSynonyms = [...currentSynonyms, randomAvailableSynonym];
      const updatedAvailableSynonyms = availableSynonyms.filter(synonym => synonym !== randomAvailableSynonym);

      setCurrentSynonyms(updatedCurrentSynonyms);
      setAvailableSynonyms(updatedAvailableSynonyms);
      setGuess('');
    }
  };

  useEffect(() => {
    setShowMessage(true);
  }, [message])

  const hideMessage = () => {
    setShowMessage(false);
  };

  const handleInputChange = (e) => {
    setGuess(e.target.value);
  };

  return (
    <div>
      <p>Current Synonyms: <strong>{currentSynonyms.join(', ')}</strong></p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          onInput={handleInputChange}
          autocomplete="off"
          disabled={gameOver && 'disabled'}
        />
        <button
          type="submit"
          disabled={gameOver && 'disabled'}
        >Check Guess</button>
      </form>

      {showMessage && (
        <Message
          message={message}
          isVisible={showMessage}
          toggleVisibility={hideMessage}
        />
      )}
    </div>
  );
}

