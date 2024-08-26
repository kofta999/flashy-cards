import { CreateDeckSchema } from "@/types";
import { generateObject } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const generateCards = async (values: CreateDeckSchema) => {
  const cardSchema = z.object({
    front: z.string(),
    back: z.string(),
  });

  const google = createGoogleGenerativeAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const { object } = await generateObject({
    model: google("gemini-1.5-flash"),

    schema: cardSchema,
    output: "array",
    prompt: `Generate exactly ${values.noOfCards + 10} unique Anki-style flashcards on the theme: '${values.prompt}'. Ensure no duplicates.`,
  });

  const cards = object.slice(0, values.noOfCards);

  console.log(cards);

  return {
    title: values.title,
    description: values.prompt,
    cards,
  };
};
