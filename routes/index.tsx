import Game from "../islands/game.tsx";
import { getDictionary, selectRandom } from "../lib/main.ts";

export default async function Home() {
  const dictionary: Word[] = await getDictionary();
  const answer: Word = selectRandom(dictionary);

  return (
    <div>
      <Game dictionary={dictionary} answer={answer} />
    </div>
  );
}

