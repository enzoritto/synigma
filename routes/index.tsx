import { getDictionary, selectRandom } from "../lib/main.ts";


export default async function Home() {
  const dictionary: Word[] = await getDictionary();
  const answer: Word = selectRandom(dictionary);
  const currentSynonyms: string[] = [selectRandom(answer.synonyms)];

  return (
    <div>
      <h1>The answer is {answer.word}</h1>
      <h2>The synonyms are: {currentSynonyms}</h2>
    </div>
  );
}

