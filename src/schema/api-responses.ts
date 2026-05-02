import type { Card, CardList } from './card'

export type TarotApiError = { error: string }
export type CardResponse = Card | TarotApiError
export type CardListResponse = CardList | TarotApiError
