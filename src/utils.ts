import express from 'express'
import { z, type ZodType } from 'zod'

export function sendValidated<T>(res: express.Response, schema: ZodType<T>, data: unknown) {
    const result = schema.safeParse(data)
    if (!result.success) {
        console.log(z.prettifyError(result.error))
        return res.status(500).json({ error: 'Unexpected data shape' })
    }
    return res.json(result.data)
}
