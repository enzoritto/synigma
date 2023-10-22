import { getDictionary, selectRandom } from "../lib/main.ts";

export default async function Home() {
  const dictionary: Word[] = await getDictionary();
  const answer: Word = selectRandom(dictionary);

  return (
    <div>
      <h1>The answer is {answer.word}</h1>
    </div>
  );
}
