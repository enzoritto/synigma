import { getAvailableSynonyms, selectRandom } from "../lib/main.ts";
import { useEffect, useState } from "preact/hooks";
import Message from "../components/message.tsx";
import Confetti from "../components/preact-confetti.tsx";

export default function Game({ dictionary, answer, startingSynonym }) {
  const [currentSynonyms, setCurrentSynonyms] = useState([{
    word: startingSynonym,
    guessed: false,
  }]);
  const [availableSynonyms, setAvailableSynonyms] = useState(
    getAvailableSynonyms(answer.synonyms, currentSynonyms[0].word),
  );
  const [guess, setGuess] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [message, setMessage] = useState({ message: "", id: 0 });

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    addEventListener("resize", handleResize);

    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guess) return;

    if (currentSynonyms.some((synonym) => synonym.word === guess)) {
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

  const handleInvalidGuess = () => {
    setMessage({ message: "Invalid guess!", id: message.id + 1 });
    setGuess("");
  };

  const handleCorrectGuess = () => {
    setMessage({ message: "Correct! You Won!", id: message.id + 1 });
    setGameWon(true);
  };

  const handleRightTrackGuess = () => {
    const updatedCurrentSynonyms = [...currentSynonyms, {
      word: guess,
      guessed: true,
    }];
    const updatedAvailableSynonyms = availableSynonyms.filter((synonym) =>
      synonym !== guess
    );

    setCurrentSynonyms(updatedCurrentSynonyms);
    setAvailableSynonyms(updatedAvailableSynonyms);
    setMessage({ message: "You're on the right track!", id: message.id + 1 });
    setGuess("");
  };

  const handleGameOver = () => {
    setMessage({ message: "You lost!", id: message.id + 1 });
    setGuess(answer.word);
    setGameLost(true);
  };

  const handleWrongGuess = () => {
    setMessage({ message: "Wrong! Try again!", id: message.id + 1 });
    const randomAvailableSynonym = selectRandom(availableSynonyms);
    const updatedCurrentSynonyms = [...currentSynonyms, {
      word: randomAvailableSynonym,
      guessed: false,
    }];
    const updatedAvailableSynonyms = availableSynonyms.filter((synonym) =>
      synonym !== randomAvailableSynonym
    );

    setCurrentSynonyms(updatedCurrentSynonyms);
    setAvailableSynonyms(updatedAvailableSynonyms);
    setGuess("");
  };

  const handleInputChange = (e) => {
    setGuess(e.target.value.trim().toLowerCase());
  };

  const spawnConfetti = () => {
    return (
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces="200"
      />
    );
  };

  return (
    <main>
      <h1 class="instructions">Guess the word based on these synonyms</h1>

      <div class="synonyms">
        {currentSynonyms.map((synonym, _) => {
          return (
            <div
              class={synonym.guessed
                ? "synonym-block guessed"
                : "synonym-block"}
            >
              {synonym.word}
            </div>
          );
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

      {gameWon && spawnConfetti()}

      <Message
        message={message}
      />
    </main>
  );
}
