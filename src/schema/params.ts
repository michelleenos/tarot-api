import { z } from 'zod'
import { SuitSchema } from './suits'

const MinorCardIdentifierSchema = z.coerce.number().int().min(1).max(14)

const MajorCardIdentifierSchema = z.coerce.number().int().min(0).max(21)

// Validates { suit, identifier } from req.params and returns { suit, number }
export const SpecificCardParamsSchema = z
    .object({ suit: SuitSchema, identifier: z.string() })
    .transform(({ suit, identifier }, ctx) => {
        const schema = suit === 'major' ? MajorCardIdentifierSchema : MinorCardIdentifierSchema
        const result = schema.safeParse(identifier)
        if (!result.success) {
            result.error.issues.forEach((issue) => ctx.addIssue(issue))
            return z.NEVER
        }
        return { suit, number: result.data }
    })

export type SpecificCardParams = z.infer<typeof SpecificCardParamsSchema>
