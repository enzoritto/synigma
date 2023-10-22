import { selectRandom, getAvailableSynonyms } from "../lib/main.ts";
import { useSignal } from "@preact/signals";

export default function Game({dictionary, answer}) {
  const currentSynonyms: string[] = [selectRandom(answer.synonyms)];
  const availableSynonyms: string[] = getAvailableSynonyms(answer.synonyms, currentSynonyms);

  const guess = useSignal('');

  let message = null;

  function handleSubmit() {
    if (!guess.value) return;
    if (currentSynonyms.includes(guess.value)) {
      alert("Invalid guess");
      return;
    }

    if (guess.value == answer.word) {
      alert("Correct!");
    } else if (availableSynonyms.includes(guess.value)) {
      alert("Almost!");
    } else {
      alert("Wrong!");
    }
  }

  return (
    <div>
      <p>
        answer: <strong>{answer.word}</strong>,
        current synonyms: <strong>{currentSynonyms}</strong>,
        available synonyms: <strong>{availableSynonyms.join(' - ')}</strong>,
        guess: <strong>{guess}</strong>
      </p>
      <input autocomplete="off" type="text" onChange={e => guess.value = e.target.value}/>
      <button onClick={handleSubmit}>guess</button>
    </div>
  );
}

