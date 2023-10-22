import { getDictionary, selectRandom, getAvailableSynonyms } from "../lib/main.ts";


export default async function Home() {
  const dictionary: Word[] = await getDictionary();
  const answer: Word = selectRandom(dictionary);
  const currentSynonyms: string[] = [selectRandom(answer.synonyms)];
  const availableSynonyms: string[] = getAvailableSynonyms(answer.synonyms, currentSynonyms);

  return (
    <div>
      <h1>The answer is {answer.word}</h1>
      <h2>The synonyms are: {currentSynonyms}</h2>
      <h2>The available synonyms are: {...availableSynonyms}</h2>
      <input type="text" />
      <button>guess</button>
    </div>
  );
}

