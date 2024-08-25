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
    apiKey: "AIzaSyC9e6u6HRcoNgAdwPWgCB2FpQWdQOiukko",
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
    name: values.name,
    description: values.prompt,
    cards,
  };
};
