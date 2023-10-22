export type Word = {
  "word": string;
  "synonyms": string[];
};

export async function getDictionary(): Promise<Word[]> {
  const plainText: string = await Deno.readTextFile("static/synonyms.jsonl");
  const unparsedDictionary: string[] = plainText.split(/\n/g);
  return await unparsedDictionary.map((line) => JSON.parse(line));
}

export function selectRandom<Type>(array: Type[]): Type {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function getAvailableSynonyms(
  synonyms: string[],
  currentSynonyms: string[],
): string[] {
  return synonyms.filter((synonym) => currentSynonyms.indexOf(synonym) == -1);
}
