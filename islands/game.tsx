import { selectRandom, getAvailableSynonyms } from "../lib/main.ts";
import { useState } from 'preact/hooks';

export default function Game({ dictionary, answer, startingSynonym }) {
  const [currentSynonyms, setCurrentSynonyms] = useState<string[]>([startingSynonym]);
  const [availableSynonyms, setAvailableSynonyms] = useState<string[]>(getAvailableSynonyms(answer.synonyms, currentSynonyms));
  const [guess, setGuess] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guess) return;

    if (currentSynonyms.includes(guess)) {
      alert('Invalid guess!');
      setGuess('');
      return;
    }

    if (guess === answer.word) {
      alert('Correct!');
      setGameOver(true);
      return;
    }

    if (availableSynonyms.includes(guess)) {
      const updatedCurrentSynonyms = [...currentSynonyms, guess];
      const updatedAvailableSynonyms = availableSynonyms.filter(synonym => synonym !== guess);

      setCurrentSynonyms(updatedCurrentSynonyms);
      setAvailableSynonyms(updatedAvailableSynonyms);
      setGuess('');
    } else if (availableSynonyms.length === 0) {
      alert('You lost!');
      setGameOver(true);
      return;
    } else {
      alert('Wrong!');
      const randomAvailableSynonym = selectRandom(availableSynonyms);
      const updatedCurrentSynonyms = [...currentSynonyms, randomAvailableSynonym];
      const updatedAvailableSynonyms = availableSynonyms.filter(synonym => synonym !== randomAvailableSynonym);

      setCurrentSynonyms(updatedCurrentSynonyms);
      setAvailableSynonyms(updatedAvailableSynonyms);
      setGuess('');
    }
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
    </div>
  );
}

