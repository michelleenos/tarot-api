import { z } from 'zod'
import { SuitSchema } from './suits-arcana'
import { MajorValueSchema, MinorValueSchema } from './card'

export const CardMinorParamsSchema = z.object({
    suit: SuitSchema,
    value: z.coerce.number().pipe(MinorValueSchema),
})

export const CardMajorParamsSchema = z.object({
    value: z.coerce.number().pipe(MajorValueSchema),
})

export type CardMinorParams = z.infer<typeof CardMinorParamsSchema>
export type CardMajorParams = z.infer<typeof CardMajorParamsSchema>

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
