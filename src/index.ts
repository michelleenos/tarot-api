import express from 'express'
import {
    CardGroupSchema,
    CardListSchema,
    CardMajorParamsSchema,
    CardMajorSchema,
    CardMinorParamsSchema,
    CardMinorSchema,
} from 'shared'
import { z, type ZodType } from 'zod'
import { getAllCards, getCardsByGroup, getMajorCard, getMinorCard } from './tarot'

const app = express()

app.use(express.json())
const PORT = process.env.PORT || 3000

function sendValidated<T>(res: express.Response, schema: ZodType<T>, data: unknown) {
    const result = schema.safeParse(data)
    if (!result.success) {
        console.log(z.prettifyError(result.error))
        return res.status(500).json({ error: 'Unexpected data shape' })
    }
    return res.json(result.data)
}

app.get('/cards', (_req, res) => {
    return sendValidated(res, CardListSchema, getAllCards())
})

app.get('/cards/:group', (req, res) => {
    const groupResult = CardGroupSchema.safeParse(req.params.group)
    if (!groupResult.success) {
        return res.status(400).json({ error: z.flattenError(groupResult.error) })
    }

    return sendValidated(res, CardListSchema, getCardsByGroup(groupResult.data))
})

app.get('/cards/major/:value', (req, res) => {
    const paramsRes = CardMajorParamsSchema.safeParse(req.params)
    if (!paramsRes.success) return res.status(400).json({ error: z.flattenError(paramsRes.error) })

    const card = getMajorCard(paramsRes.data)
    if (!card) return res.status(404).json({ error: 'Card not found!' })

    return sendValidated(res, CardMajorSchema, card)
})

app.get('/cards/:suit/:value', (req, res) => {
    const paramsRes = CardMinorParamsSchema.safeParse(req.params)
    if (!paramsRes.success) return res.status(400).json({ error: z.flattenError(paramsRes.error) })

    const card = getMinorCard(paramsRes.data)
    if (!card) return res.status(404).json({ error: 'Card not found!' })

    return sendValidated(res, CardMinorSchema, card)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
