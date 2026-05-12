import { describe, test, expect } from 'vitest'
import {
    getAllCards,
    getCardsByGroup,
    getMajorCard,
    getMinorCard,
    getRandomCards,
    searchByKeyword,
} from '../src/tarot'

describe('getAllCards', () => {
    test('returns all 78 cards', () => {
        expect(getAllCards()).toHaveLength(78)
    })

    test('returns a copy, not the original array', () => {
        const a = getAllCards()
        const b = getAllCards()
        expect(a).not.toBe(b)
    })
})

describe('getCardsByGroup', () => {
    test('returns 22 major arcana cards', () => {
        const result = getCardsByGroup('major')
        expect(result).toHaveLength(22)
        expect(result.every((c) => c.arcana === 'major')).toBe(true)
    })

    test('returns 56 minor arcana cards', () => {
        const result = getCardsByGroup('minor')
        expect(result).toHaveLength(56)
        expect(result.every((c) => c.arcana === 'minor')).toBe(true)
    })

    test.each(['wands', 'cups', 'swords', 'pentacles'] as const)(
        'returns 14 cards for suit %s',
        (suit) => {
            const result = getCardsByGroup(suit)
            expect(result).toHaveLength(14)
            expect(result.every((c) => c.suit === suit)).toBe(true)
        }
    )
})

describe('getMajorCard', () => {
    test('returns The Fool for value 0', () => {
        const card = getMajorCard({ value: 0 })
        expect(card?.name).toBe('The Fool')
    })

    test('returns The World for value 21', () => {
        const card = getMajorCard({ value: 21 })
        expect(card?.name).toBe('The World')
    })

    test('returns undefined for a value with no major card', () => {
        expect(getMajorCard({ value: 99 })).toBeUndefined()
    })
})

describe('getMinorCard', () => {
    test('returns Ace of Wands for wands/1', () => {
        const card = getMinorCard({ suit: 'wands', value: 1 })
        expect(card?.name).toBe('Ace of Wands')
    })

    test('returns King of Cups for cups/14', () => {
        const card = getMinorCard({ suit: 'cups', value: 14 })
        expect(card?.name).toBe('King of Cups')
    })

    test('returns undefined for a value with no minor card', () => {
        expect(getMinorCard({ suit: 'swords', value: 99 })).toBeUndefined()
    })
})

describe('getRandomCards', () => {
    test('returns the requested number of cards', () => {
        expect(getRandomCards(3)).toHaveLength(3)
        expect(getRandomCards(10)).toHaveLength(10)
    })

    test('returns different orderings across calls', () => {
        const results = Array.from({ length: 10 }, () => getRandomCards(5).map((c) => c.name))
        const unique = new Set(results.map((r) => r.join(',')))
        expect(unique.size).toBeGreaterThan(1)
    })
})

describe('searchByKeyword', () => {
    test('finds cards matching a keyword exactly', () => {
        const result = searchByKeyword(['hope'])
        expect(result.some((c) => c.name === 'The Star')).toBe(true)
    })

    test('matching is case-insensitive', () => {
        const lower = searchByKeyword(['hope'])
        const upper = searchByKeyword(['HOPE'])
        expect(lower.map((c) => c.name)).toEqual(upper.map((c) => c.name))
    })

    test('finds cards by partial keyword match', () => {
        const result = searchByKeyword(['begin'])
        expect(result.some((c) => c.name === 'The Fool')).toBe(true)
    })

    test('returns results matching any of multiple keywords', () => {
        const result = searchByKeyword(['hope', 'grief'])
        expect(result.some((c) => c.name === 'The Star')).toBe(true)
        expect(result.some((c) => c.name === 'Three of Swords')).toBe(true)
    })

    test('returns empty array when no cards match', () => {
        expect(searchByKeyword(['zzznomatch'])).toHaveLength(0)
    })
})
