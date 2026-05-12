import cards from '../data/cards.json'
import { type CardMajorParams, type CardMinorParams } from './schema'
import type { Arcana, Suit, CardGroup } from './schema/card-props'

export function getAllCards() {
    return [...cards]
}

export function getCardsByGroup(group: CardGroup) {
    if (group === 'major' || group === 'minor') {
        return cards.filter((c) => c.arcana === group)
    } else {
        return cards.filter((c) => c.suit === group)
    }
}

export function getMinorCard({ suit, value }: CardMinorParams) {
    return cards.find((c) => c.suit === suit && c.value === value)
}

export function getMajorCard({ value }: CardMajorParams) {
    return cards.find((c) => c.arcana === 'major' && c.value === value)
}

export function getRandomCards(count: number) {
    return [...cards].sort(() => Math.random() - 0.5).slice(0, count)
}

export function searchByKeyword(keywords: string[]) {
    const inputKws = keywords.map((k) => k.toLowerCase())
    return cards.filter((card) => {
        return inputKws.some((inputkw) => {
            return (
                card.keywords_reversed.some((k) => k.toLowerCase().includes(inputkw)) ||
                card.keywords_upright.some((k) => k.toLowerCase().includes(inputkw))
            )
        })
    })
}
