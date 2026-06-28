import { characterIdentity, franchiseCoreCharacters } from "./characterIdentity.js";

export { characterIdentity, franchiseCoreCharacters };

export const mvpCharacters = characterIdentity.filter((character) =>
  ["pip", "elena", "aunt-mina"].includes(character.id)
);

export function getCharacter(id) {
  return characterIdentity.find((character) => character.id === id) || null;
}
