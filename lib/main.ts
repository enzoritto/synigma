export type Word = {
  "word": string;
  "synonyms": string[];
}

export async function getDictionary(): Promise<Word[]> {
  const plainText: string = await Deno.readTextFile("static/synonyms.jsonl");
  const unparsedDictionary: string[] = plainText.split(/\n/g);
  return await unparsedDictionary.map((line) => JSON.parse(line));
}

export function selectRandom<Type>(array: Type[]): Type {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex];
}

