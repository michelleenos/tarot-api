import { describe, test, expect, vi } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { type Response } from 'express'
import { CardSchema, type Card } from '../src/schema'
import { sendValidated } from '../src/utils'

describe('GET /cards', () => {
    test('returns all cards if no query passed', async () => {
        const res = await request(app).get('/cards')
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body.length).toBe(78)
    })

    test('finds cards by keyword match', async () => {
        const res = await request(app).get('/cards?keyword=partnership')
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(2)
        expect(res.body.find((c: Card) => c.name === 'Two of Cups')).toBeDefined()
    })

    test('finds keywords from both reversed and upright lists', async () => {
        const res = await request(app).get('/cards?keyword=insecurity')
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(5)
        expect((res.body as Card[]).find((c) => c.name === 'Five of Pentacles')).toBeDefined()
    })

    test('matches cards to multiple keywords passed to repeated params', async () => {
        const res = await request(app).get('/cards?keyword=gossip&keyword=boredom') // "gossip" = 3 of cups; "boredom" = ace of wands
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(2)
    })

    test('matches cards to multiple keywords passed with commas', async () => {
        const res = await request(app).get('/cards?keyword=gossip,boredom') // "gossip" = 3 of cups; "boredom" = ace of wands
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(2)
    })
})

describe('GET /cards/:group', () => {
    test('returns 22 major arcana cards', async () => {
        const res = await request(app).get('/cards/major')
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(22)
    })

    test('returns 56 minor arcana cards', async () => {
        const res = await request(app).get('/cards/minor')
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(56)
    })

    test.each(['wands', 'cups', 'swords', 'pentacles'])(
        'returns 14 cards for suit %s',
        async (suit) => {
            const res = await request(app).get(`/cards/${suit}`)
            expect(res.status).toBe(200)
            expect(res.body).toHaveLength(14)
            expect(res.body.every((c: Card) => c.suit === suit)).toBe(true)
        }
    )

    test('returns error if called with an invalid group name', async () => {
        const res = await request(app).get('/cards/notasuit')
        expect(res.status).toBe(400)
        expect(res.body).toMatchInlineSnapshot(`
          {
            "error": {
              "fieldErrors": {},
              "formErrors": [
                "Invalid option: expected one of "wands"|"cups"|"swords"|"pentacles"|"major"|"minor"",
              ],
            },
          }
        `)
    })
})

describe('GET /cards/:group/value', () => {
    test('returns specified major arcana', async () => {
        const res = await request(app).get('/cards/major/2')
        expect(res.status).toBe(200)
        expect(res.body.name).toBe('The High Priestess')
        expect(res.body).toMatchObject({
            arcana: 'major',
            name: 'The High Priestess',
            suit: null,
            value: 2,
        })
    })

    test('returns error if called with nonexistent major arcana value', async () => {
        const res = await request(app).get('/cards/major/80')
        expect(res.status).toBe(400)
    })

    test('returns specified minor arcana', async () => {
        const res = await request(app).get('/cards/cups/2')
        expect(res.status).toBe(200)
        expect(res.body.name).toBe('Two of Cups')
    })

    test('returns error if called with nonexistent minor arcana', async () => {
        const res = await request(app).get('/cards/cups/55')
        expect(res.status).toBe(400)
    })

    test('returns error if called with nonexistent suit/group', async () => {
        const res = await request(app).get('/cards/blah/2')
        expect(res.status).toBe(400)
        expect(res.body).toMatchInlineSnapshot(`
          {
            "error": {
              "fieldErrors": {
                "suit": [
                  "Invalid option: expected one of "wands"|"cups"|"swords"|"pentacles"",
                ],
              },
              "formErrors": [],
            },
          }
        `)
    })
})

describe('GET /cards/random', () => {
    test('gets 1 card by default', async () => {
        const res = await request(app).get('/cards/random')
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(1)
        const card = res.body[0]
        expect(card).toHaveProperty('name')
        expect(card).toHaveProperty('arcana')
    })

    test('cards are random', async () => {
        const results = await Promise.all(
            Array.from({ length: 5 }, () => request(app).get('/cards/random'))
        )
        const unique = new Set(results.map((res) => res.body[0].name))
        expect(unique.size).toBeGreaterThan(1)
    })

    test('gets more cards when requested', async () => {
        const res = await request(app).get('/cards/random?count=3')
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(3)
    })

    test('generates an orientation by default', async () => {
        const res = await request(app).get('/cards/random')
        expect(res.body[0]).toHaveProperty('reversed')
    })

    test('does not generate an orientation when specified as false', async () => {
        const res = await request(app).get('/cards/random?orientation=false')
        expect(res.body[0]).not.toHaveProperty('reversed')
    })

    test('generates orientation when specified as true', async () => {
        const res = await request(app).get('/cards/random?orientation=true')
        expect(res.body[0]).toHaveProperty('reversed')
    })

    test('errors when count is not a number', async () => {
        const res = await request(app).get('/cards/random?count=hi')
        expect(res.status).toBe(400)
    })

    test('errors when orientation is not a boolean', async () => {
        const res = await request(app).get('/cards/random?orientation=maybe')
        expect(res.status).toBe(400)
    })
})

describe('sendValidated util', () => {
    const mockStatus = vi.fn()
    const mockJson = vi.fn()
    const mockRes = {
        status: mockStatus.mockReturnValue({ json: mockJson }),
    }

    test('sends a 500 with invalid input', () => {
        sendValidated(mockRes as unknown as Response, CardSchema, { name: 'Not a card', value: 50 })
        expect(mockRes.status).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Unexpected data shape' })
    })
})
