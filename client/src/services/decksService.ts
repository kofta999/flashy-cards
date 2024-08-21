import { API_URL } from "@/consts";
import { IDeck, IDeckItem } from "@/types";
import { authedClient } from "./authService";

const DECKS_API_URL = API_URL + "/decks";

export async function getDecks() {
  try {
    const { data } = await authedClient.get<IDeckItem[]>(DECKS_API_URL);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDeck(deckId: number) {
  try {
    const { data } = await authedClient.get<IDeck>(
      DECKS_API_URL + "/" + deckId,
    );

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
