import { z } from 'zod'

export const SuitSchema = z.enum(['wands', 'cups', 'swords', 'pentacles'])
export type Suit = z.infer<typeof SuitSchema>

export const ArcanaSchema = z.enum(['major', 'minor'])
export type Arcana = z.infer<typeof ArcanaSchema>

// we could instead do SuitSchema.or(ArcanaSchema), but using the enum makes the error messages a bit clearer
export const CardGroupSchema = z.enum(['wands', 'cups', 'swords', 'pentacles', 'major', 'minor'])
export type CardGroup = z.infer<typeof CardGroupSchema>

export const MinorValueSchema = z.number().int().min(1).max(14)
export const MajorValueSchema = z.number().int().min(0).max(21)
