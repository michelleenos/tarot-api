import express from 'express'
import { z } from 'zod'
import {
    CardGroupSchema,
    CardListSchema,
    CardMajorParamsSchema,
    CardMajorSchema,
    CardMinorParamsSchema,
    CardMinorSchema,
    CardQuerySchema,
    CardWithOrientationListSchema,
    RandomQuerySchema,
} from './schema'
import {
    getAllCards,
    getCardsByGroup,
    getMajorCard,
    getMinorCard,
    getRandomCards,
    searchByKeyword,
} from './tarot'
import { sendValidated } from './utils'
import { rateLimit } from 'express-rate-limit'

const app = express()

app.use(express.json())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
})

app.use(limiter)

app.get('/', (_req, res) => {
    res.json({
        name: 'tarot-api',
        version: '1.0.0',
        description: 'A REST API for tarot card data. Check the GitHub README for docs!',
        github: 'https://github.com/michelleenos/tarot-api',
    })
})

app.get('/cards', (req, res) => {
    const queryRes = CardQuerySchema.safeParse(req.query)
    // if (!queryRes.success) return res.status(400).json({ error: z.flattenError(queryRes.error) })

    const keyword = queryRes.data?.keyword
    const cards = keyword ? searchByKeyword(keyword) : getAllCards()
    return sendValidated(res, CardListSchema, cards)
})

app.get('/cards/random', (req, res) => {
    const queryRes = RandomQuerySchema.safeParse(req.query)

    if (!queryRes.success) return res.status(400).json({ error: z.flattenError(queryRes.error) })

    const { count, orientation } = queryRes.data
    const cards = getRandomCards(count)

    if (orientation) {
        const withOrientation = cards.map((card) => ({ ...card, reversed: Math.random() < 0.5 }))
        return sendValidated(res, CardWithOrientationListSchema, withOrientation)
    }

    return sendValidated(res, CardListSchema, cards)
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

    return sendValidated(res, CardMajorSchema, card)
})

app.get('/cards/:suit/:value', (req, res) => {
    const paramsRes = CardMinorParamsSchema.safeParse(req.params)
    if (!paramsRes.success) return res.status(400).json({ error: z.flattenError(paramsRes.error) })

    const card = getMinorCard(paramsRes.data)

    return sendValidated(res, CardMinorSchema, card)
})

export default app
