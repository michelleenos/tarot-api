import { z } from 'zod'
import { SuitSchema } from './suits'

export const TarotCardSchema = z.object({
    name: z.string(),
    suit: SuitSchema,
    keywords_upright: z.array(z.string()),
    keywords_reversed: z.array(z.string()),
    url: z.string(),
    image: z.string().optional(),
    // 1–14 for minor arcana, 0–21 for major arcana
    number: z.number().int().min(0).max(21),
})

export type TarotCard = z.infer<typeof TarotCardSchema>
