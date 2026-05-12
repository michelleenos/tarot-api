import { z } from 'zod'
import { SuitSchema, MinorValueSchema, MajorValueSchema } from './card-props'

export const CardMinorParamsSchema = z.object({
    suit: SuitSchema,
    value: z.coerce.number().pipe(MinorValueSchema),
})

export const CardMajorParamsSchema = z.object({
    value: z.coerce.number().pipe(MajorValueSchema),
})

export type CardMinorParams = z.infer<typeof CardMinorParamsSchema>
export type CardMajorParams = z.infer<typeof CardMajorParamsSchema>

export const RandomQuerySchema = z.object({
    count: z.coerce.number().int().min(1).default(1),
    orientation: z
        .enum(['true', 'false'])
        .transform((val) => val === 'true')
        .optional()
        .default(true),
})
export type RandomQuery = z.infer<typeof RandomQuerySchema>

export const CardQuerySchema = z.object({
    keyword: z
        .preprocess((v) => {
            if (v === undefined) return undefined
            if (Array.isArray(v)) return v
            if (typeof v === 'string') {
                return v.split(',').map((w) => w.trim())
            }
        }, z.array(z.string()))
        .optional(),
})
export type CardQuery = z.infer<typeof CardQuerySchema>

// Validates { suit, identifier } from req.params and returns { suit, number }
// export const SpecificCardParamsSchema = z
//     .object({ suit: SuitSchema, identifier: z.string() })
//     .transform(({ suit, identifier }, ctx) => {
//         // const schema = suit === 'major' ? MajorCardIdentifierSchema : MinorCardIdentifierSchema
//         const schema = MinorCardIdentifierSchema
//         const result = schema.safeParse(identifier)
//         if (!result.success) {
//             result.error.issues.forEach((issue) => ctx.addIssue(issue))
//             return z.NEVER
//         }
//         return { suit, number: result.data }
//     })

// export type SpecificCardParams = z.infer<typeof SpecificCardParamsSchema>
