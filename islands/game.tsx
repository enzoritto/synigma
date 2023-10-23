import { getAvailableSynonyms, selectRandom } from "../lib/main.ts";
import { useEffect, useState } from "preact/hooks";
import Message from "../components/message.tsx";

export default function Game({ dictionary, answer, startingSynonym }) {
  const [currentSynonyms, setCurrentSynonyms] = useState([startingSynonym]);
  const [availableSynonyms, setAvailableSynonyms] = useState(
    getAvailableSynonyms(answer.synonyms, currentSynonyms),
  );
  const [guess, setGuess] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guess) return;

    if (currentSynonyms.includes(guess)) {
      handleInvalidGuess();
    } else if (guess === answer.word) {
      handleCorrectGuess();
    } else if (availableSynonyms.includes(guess)) {
      handleRightTrackGuess();
    } else if (availableSynonyms.length === 0) {
      handleGameOver();
    } else {
      handleWrongGuess();
    }
  };

  useEffect(() => {
    if (message) {
      setShowMessage(true);
    }
  }, [message]);

  const hideMessage = () => {
    setShowMessage(false);
  };

  const handleInvalidGuess = () => {
    setMessage("Invalid guess!");
    setGuess("");
  };

  const handleCorrectGuess = () => {
    setMessage("Correct! You won!");
    setGameWon(true);
  };

  const handleRightTrackGuess = () => {
    const updatedCurrentSynonyms = [...currentSynonyms, guess];
    const updatedAvailableSynonyms = availableSynonyms.filter((synonym) =>
      synonym !== guess
    );

    setCurrentSynonyms(updatedCurrentSynonyms);
    setAvailableSynonyms(updatedAvailableSynonyms);
    setMessage("You're on the right track!");
    setGuess("");
  };

  const handleGameOver = () => {
    setMessage("You lost!");
    setGuess(answer.word);
    setGameLost(true);
  };

  const handleWrongGuess = () => {
    setMessage("Wrong! Try again!");
    const randomAvailableSynonym = selectRandom(availableSynonyms);
    const updatedCurrentSynonyms = [...currentSynonyms, randomAvailableSynonym];
    const updatedAvailableSynonyms = availableSynonyms.filter((synonym) =>
      synonym !== randomAvailableSynonym
    );

    setCurrentSynonyms(updatedCurrentSynonyms);
    setAvailableSynonyms(updatedAvailableSynonyms);
    setGuess("");
  };

  const handleInputChange = (e) => {
    setGuess(e.target.value);
  };

  return (
    <main>
      <h1 class="instructions">Guess the word based on these synonyms</h1>

      <div class="synonyms">
        {currentSynonyms.map((synonym, _) => {
          return <div class="synonym-block">{synonym}</div>;
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="YOUR GUESS"
          value={guess}
          onInput={handleInputChange}
          autoComplete="off"
          disabled={gameWon || gameLost && "disabled"}
          class={gameLost && "game-lost" || gameWon && "game-won"}
        />
        <button
          type="submit"
          disabled={gameWon || gameLost && "disabled"}
          class={gameLost && "game-lost" || gameWon && "game-won"}
        >
          Guess
        </button>
      </form>

      {showMessage && (
        <Message
          message={message}
          isVisible={showMessage}
          toggleVisibility={hideMessage}
        />
      )}
    </main>
  );
}
