import Game from "../islands/game.tsx";
import { type Word, getDictionary, selectRandom } from "../lib/utils.ts";

export default async function Home() {
  const dictionary: Word[] = await getDictionary();
  const answer: Word = selectRandom(dictionary);
  const startingSynonym: string = selectRandom(answer.synonyms);

  return (
    <>
      <Game
        answer={answer}
        startingSynonym={startingSynonym}
      />
    </>
  );
}
