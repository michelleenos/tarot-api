import cards from '../data/cards.json'
import {
    type Arcana,
    type CardGroup,
    type CardMajorParams,
    type CardMinorParams,
    type Suit,
} from 'shared'

export function getAllCards() {
    return [...cards]
}

export function getArcana(arcana: Arcana) {
    return cards.filter((c) => c.arcana === arcana)
}

export function getSuit(suit: Suit) {
    return cards.filter((c) => c.suit === suit)
}

export function getCardsByGroup(group: CardGroup) {
    if (group === 'major' || group === 'minor') {
        return cards.filter((c) => c.arcana === group)
    } else {
        return cards.filter((c) => c.arcana === 'minor' && c.suit === group)
    }
}

export function getMinorCard({ suit, value }: CardMinorParams) {
    return cards.find((c) => c.suit === suit && c.value === value)
}

export function getMajorCard({ value }: CardMajorParams) {
    return cards.find((c) => c.arcana === 'major' && c.value === value)
}
