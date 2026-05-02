import { z } from 'zod'
import { SuitSchema, ArcanaSchema } from './suits-arcana'

export const MinorValueSchema = z.number().int().min(1).max(14)
export const MajorValueSchema = z.number().int().min(1).max(22)

const CardSharedSchema = z.object({
    name: z.string(),
    arcana: ArcanaSchema,
    keywords_upright: z.array(z.string()),
    keywords_reversed: z.array(z.string()),
    url: z.string(),
})

export const CardMajorSchema = z.object({
    ...CardSharedSchema.shape,
    arcana: z.literal('major'),
    value: MajorValueSchema,
})
export type CardMajor = z.infer<typeof CardMajorSchema>

export const CardMinorSchema = z.object({
    ...CardSharedSchema.shape,
    arcana: z.literal('minor'),
    value: MinorValueSchema,
    suit: SuitSchema,
})
export type CardMinor = z.infer<typeof CardMinorSchema>

export const CardSchema = z.discriminatedUnion('arcana', [CardMajorSchema, CardMinorSchema])
export type Card = z.infer<typeof CardSchema>

export const CardListSchema = z.array(CardSchema)
export type CardList = z.infer<typeof CardListSchema>

export const CardMinorListSchema = z.array(CardMinorSchema)
export type CardMinorList = z.infer<typeof CardMinorListSchema>

export const CardMajorListSchema = z.array(CardMajorSchema)
export type CardMajorList = z.infer<typeof CardMajorListSchema>
