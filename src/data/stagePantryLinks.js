import { JAR_SHELVES, getJarsByShelf } from "./pantryJars.js";
import { seasonShelves } from "./seasonShelves.js";

const PAID_JARS_PER_SHELF = 5;

export function getPantryShelfForSeasonShelf(seasonShelf) {
  const required = Math.max(0, Number(seasonShelf?.pantryRoomStepRequired || 0));
  if (required <= 0 || required % PAID_JARS_PER_SHELF !== 0) return null;
  return JAR_SHELVES[(required / PAID_JARS_PER_SHELF) - 1] || null;
}

export function getSeasonShelvesForPantryShelf(pantryShelfId) {
  return seasonShelves.filter(
    (seasonShelf) => getPantryShelfForSeasonShelf(seasonShelf)?.id === pantryShelfId
  );
}

export function getPaidJarProgressForPantryShelf(pantryShelfId, ownedJarIds = []) {
  const owned = new Set(ownedJarIds);
  const paidJars = getJarsByShelf(pantryShelfId).filter((jar) => jar.cost > 0);
  const current = paidJars.filter((jar) => owned.has(jar.id)).length;
  return {
    current,
    total: paidJars.length,
    complete: paidJars.length > 0 && current >= paidJars.length
  };
}