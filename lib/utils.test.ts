import { assert, assertEquals } from "$std/testing/asserts.ts";
import { resolvesNext, stub } from "$std/testing/mock.ts";
import { getAvailableSynonyms, getDictionary, selectRandom } from "./utils.ts";

const mockFileContents =
  `{"word": "happy", "synonyms": ["joyful", "content", "delighted", "cheerful"]}
{"word": "quick", "synonyms": ["fast", "swift", "speedy", "rapid"]}`;

Deno.test("getDictionary should read and parse a dictionary file correctly", async () => {
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    resolvesNext([mockFileContents]),
  );

  const result = await getDictionary();

  assertEquals(
    result,
    [
      {
        "word": "happy",
        "synonyms": ["joyful", "content", "delighted", "cheerful"],
      },
      { "word": "quick", "synonyms": ["fast", "swift", "speedy", "rapid"] },
    ],
  );

  readTextFileStub.restore();
});

Deno.test("selectRandom", async (t) => {
  await t.step("should return an element from the array", () => {
    const array = [1, 2, 3, 4, 5];
    const result = selectRandom<number>(array);
    assert(array.includes(result));
  });

  await t.step(
    "should return an element for an array with a single element",
    () => {
      const array = [42];
      const result = selectRandom(array);
      assert(result === 42);
    },
  );

  await t.step("should return elements within the array", () => {
    const array = [10, 20, 30, 40, 50];
    const results = new Set();
    for (let i = 0; i < 1000; i++) {
      results.add(selectRandom(array));
    }
    assert(results.size === array.length);
  });
});

Deno.test("getAvailableSynonyms", async (t) => {
  await t.step("should return available synonyms", () => {
    const synonyms = ["happy", "joyful", "content", "pleased"];
    const currentSynonyms = ["happy", "joyful"];

    const availableSynonyms = getAvailableSynonyms(synonyms, currentSynonyms);

    assertEquals(availableSynonyms, ["content", "pleased"]);
  });

  await t.step("should return all synonyms if none are used", () => {
    const synonyms = ["happy", "joyful", "content", "pleased"];
    const currentSynonyms: string[] = [];

    const availableSynonyms = getAvailableSynonyms(synonyms, currentSynonyms);

    assertEquals(availableSynonyms, ["happy", "joyful", "content", "pleased"]);
  });

  await t.step("should return an empty array if all synonyms are used", () => {
    const synonyms = ["happy", "joyful", "content", "pleased"];
    const currentSynonyms = ["happy", "joyful", "content", "pleased"];

    const availableSynonyms = getAvailableSynonyms(synonyms, currentSynonyms);

    assertEquals(availableSynonyms, []);
  });
});
