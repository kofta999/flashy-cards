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

export async function createDeck(deck: IDeck) {
  try {
    const { data } = await authedClient.post(DECKS_API_URL, deck);

    console.log(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateDeck(deck: IDeck) {
  try {
    const { data } = await authedClient.put(
      DECKS_API_URL + "/" + deck.id,
      deck,
    );

    console.log(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
