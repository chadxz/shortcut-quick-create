import { LocalStorage } from "@raycast/api";
import { UUID } from "../../types";

export async function saveCriteria(id: UUID, criteria: string) {
  await LocalStorage.setItem(`criteria.${id}`, criteria);
}

export async function loadCriteria(id: UUID): Promise<string | undefined> {
  return await LocalStorage.getItem(`criteria.${id}`);
}

export async function loadAllCriteria(): Promise<string[]> {
  const allItems = await LocalStorage.allItems();
  return Object.keys(allItems).filter((key) => key.startsWith("criteria."));
}
