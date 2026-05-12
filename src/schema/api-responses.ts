import { z } from 'zod'
import { CardMajorSchema, CardMinorSchema, CardSchema, type Card, type CardList } from './card'

export type TarotApiError = { error: string }
export type CardResponse = Card | TarotApiError
export type CardListResponse = CardList | TarotApiError

export const CardWithOrientationSchema = z.discriminatedUnion('arcana', [
    CardMajorSchema.extend({ reversed: z.boolean() }),
    CardMinorSchema.extend({ reversed: z.boolean() }),
])

export type CardWithOrientation = z.infer<typeof CardWithOrientationSchema>
export const CardWithOrientationListSchema = z.array(CardWithOrientationSchema)
