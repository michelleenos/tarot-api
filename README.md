# 🔮 Tarot API 🔮

A tarot card REST API for all of your witchy needs!

Currently deployed and free for use as long as I stay within google's free tier allotment :) Also, it will likely spin down between requests so the first call might be a tad slow.

Access the API live at [tarot.michelleenos.com](https://tarot.michelleenos.com).

**CREDITS**: Keyword meanings were scraped from [labyrinthos.co](https://labyrinthos.co). Each card response includes a `url` field linking to that card's page there.

---

## Card Object

```json
{
    "name": "The Fool",
    "arcana": "major",
    "value": 0,
    "suit": null,
    "keywords_upright": ["innocence", "new beginnings", "free spirit"],
    "keywords_reversed": ["recklessness", "taken advantage of", "inconsideration"],
    "url": "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-fool-meaning-major-arcana-tarot-card-meanings"
}
```

**Fields:**

| Field               | Type                                                           | Description                                                                                 |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `name`              | string                                                         | Card name                                                                                   |
| `arcana`            | `"major"` \| `"minor"`                                         | Arcana type                                                                                 |
| `value`             | number                                                         | 0–21 for major arcana; 1–14 for minor arcana (1=Ace, 11=Page, 12=Knight, 13=Queen, 14=King) |
| `suit`              | `"wands"` \| `"cups"` \| `"swords"` \| `"pentacles"` \| `null` | Suit for minor arcana; null for major                                                       |
| `keywords_upright`  | string[]                                                       | Upright keywords keywords                                                                   |
| `keywords_reversed` | string[]                                                       | Reversed keywords keywords                                                                  |
| `url`               | string                                                         | Link to card's entry on labyrinthos.co                                                      |

---

## Endpoints

### `GET /cards`

Get all 78 cards, or filter by keyword.

**Query parameters:**

| Param     | Type   | Description                                                                                            |
| --------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `keyword` | string | One or more keywords. Returns cards whose upright or reversed keywords include any of the given terms. |

Multiple keywords can be passed as a comma-separated value or as repeated params. These are equivalent:

```
GET /cards?keyword=love,hope
GET /cards?keyword=love&keyword=hope
```

---

### `GET /cards/:group`

Returns all cards of a specified arcana or suit.

**`:group`** must be one of:

| Group Type | Value                                     |
| ---------- | ----------------------------------------- |
| Arcana     | `major` or `minor`                        |
| Suit       | `wands`, `cups`, `swords`, or `pentacles` |

**Examples:**

```
GET /cards/major   # returns 22 major arcana
GET /cards/wands   # returns 14 wands cards
```

---

### `GET /cards/major/:value`

Returns a single major arcana card by its numeric value.

**`:value`** — integer from `0` (The Fool) to `21` (The World)

**Example:**

```
GET /cards/major/0
```

---

### `GET /cards/:suit/:value`

Returns a single minor arcana card by suit and value.

**`:suit`** — `wands`, `cups`, `swords`, or `pentacles`

**`:value`** — integer from `1` (Ace) to `14` (King)

| Value | Card           |
| ----- | -------------- |
| 1     | Ace            |
| 2–10  | Numbered cards |
| 11    | Page           |
| 12    | Knight         |
| 13    | Queen          |
| 14    | King           |

**Example:**

```
GET /cards/cups/1      # Ace of Cups
GET /cards/swords/12   # Knight of Swords
GET /cards/major/1     # The Magician
```

---

### `GET /cards/random`

Returns one or more randomly selected cards. By default, it will also assign a `"reversed"` field for each card to either `true` or `false`, to mimic actually drawing cards that might be in either orientation. You can disable this with `orientation=false`.

**Query parameters:**

| Param         | Type              | Default | Description                                            |
| ------------- | ----------------- | ------- | ------------------------------------------------------ |
| `count`       | integer           | `1`     | Number of cards to return                              |
| `orientation` | `true` \| `false` | `true`  | If true, each card includes a `reversed` boolean field |

**Examples:**

```
GET /cards/random
GET /cards/random?count=3
GET /cards/random?count=5&orientation=false
```
