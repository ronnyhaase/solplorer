import json

import httpx
from dotenv import load_dotenv

from etl.connector import get_redis_connection
from etl.utils import now, pick


def normalize_tokens(raw_tokens):
    return list(
        map(
            lambda raw_token: pick(
                [
                    "id",
                    ["image", "imageUrl"],
                    ["current_price", "price"],
                    ["high_24h", "priceHigh_24h"],
                    ["low_24h", "priceLow_24h"],
                    ["price_change_24h", "priceChange_24h"],
                    ["price_change_percentage_24h", "priceChangePercent_24h"],
                    ["market_cap", "marketCap"],
                    ["market_cap_change_24h", "marketCapChange_24h"],
                    ["market_cap_change_percentage_24h", "marketCapChangePercent_24h"],
                    ["total_volume", "volume"],
                    ["circulating_supply", "supplyCirculating"],
                    ["total_supply", "supplyTotal"],
                    ["max_supply", "supplyMax"],
                ],
                raw_token,
            ),
            raw_tokens,
        )
    )


def update_tokens():
    redis = get_redis_connection()

    done = False
    page = 1
    raw_tokens = []
    while not done:
        dataset = httpx.get(
            "https://api.coingecko.com/api/v3/coins/markets",
            params={
                "category": "solana-ecosystem",
                "page": page,
                "per_page": 250,
                "vs_currency": "usd",
            },
        ).json()
        if len(dataset) == 0:
            done = True
        else:
            raw_tokens += dataset
            page += 1

    result = json.dumps(
        {
            "data": normalize_tokens(raw_tokens),
            "count": len(raw_tokens),
            "type": "list",
            "updatedAt": now(),
        }
    )

    redis.set("tokens", result)
    redis.close()

    return result


if __name__ == "__main__":
    load_dotenv()
    print(update_tokens())
