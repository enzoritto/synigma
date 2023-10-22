import Game from "../islands/game.tsx";
import { getDictionary, selectRandom } from "../lib/main.ts";

export default async function Home() {
  const dictionary: Word[] = await getDictionary();
  const answer: Word = selectRandom(dictionary);
  const startingSynonym: string = selectRandom(answer.synonyms);

  return (
    <div>
      <Game
        dictionary={dictionary}
        answer={answer}
        startingSynonym={startingSynonym}
      />
    </div>
  );
}
