export type Word = {
  "word": string;
  "synonyms": string[];
}

async function getDictionary(): Word[] {
  const plainText: string = await Deno.readTextFile("static/synonyms.jsonl");
  const unparsedDictionary: string[] = plainText.split(/\n/g);
  return await unparsedDictionary.map((line) => JSON.parse(line));
}

export default async function Home() {
  const dictionary: Word[] = await getDictionary();

  return (
    <div>
      <h1>Synigma</h1>
      {dictionary.map(word => <p>{word.word}</p>)}
    </div>
  );
}
