import { z } from 'zod'

export const SuitSchema = z.enum(['wands', 'cups', 'swords', 'pentacles'])
export type Suit = z.infer<typeof SuitSchema>

export const ArcanaSchema = z.enum(['major', 'minor'])
export type Arcana = z.infer<typeof ArcanaSchema>

export const CardGroupSchema = SuitSchema.or(ArcanaSchema)
export type CardGroup = z.infer<typeof CardGroupSchema>
