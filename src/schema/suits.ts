import { z } from 'zod'

export const SuitSchema = z.enum(['wands', 'cups', 'swords', 'pentacles', 'major'])
export type Suit = z.infer<typeof SuitSchema>
