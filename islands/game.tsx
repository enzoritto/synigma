import { getAvailableSynonyms, selectRandom } from "../lib/main.ts";
import { useEffect, useState } from "preact/hooks";
import Message from "../components/message.tsx";

export default function Game({ dictionary, answer, startingSynonym }) {
  const [currentSynonyms, setCurrentSynonyms] = useState([startingSynonym]);
  const [availableSynonyms, setAvailableSynonyms] = useState(
    getAvailableSynonyms(answer.synonyms, currentSynonyms),
  );
  const [guess, setGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
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
    setGameOver(true);
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
    setMessage(`You lost! The word was ${answer.word}!`);
    setGameOver(true);
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
    <div>
      <p>
        Current Synonyms: <strong>{currentSynonyms.join(", ")}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          onInput={handleInputChange}
          autoComplete="off"
          disabled={gameOver && "disabled"}
        />
        <button type="submit" disabled={gameOver && "disabled"}>
          Check Guess
        </button>
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
