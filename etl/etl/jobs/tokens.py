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
                    "symbol",
                    "name",
                    ["image", "imageUrl"],
                    ["total_volume", "volume"],
                    [
                        "current_price",
                        "price",
                        lambda _, dic: {
                            "current": dic["current_price"],
                            "change_24h": dic["price_change_24h"],
                            "changePercent_24h": dic["price_change_percentage_24h"],
                            "low_24h": dic["low_24h"],
                            "high_24h": dic["high_24h"],
                        },
                    ],
                    [
                        "market_cap",
                        "marketCap",
                        lambda _, dic: {
                            "current": dic["market_cap"],
                            "change_24h": dic["market_cap_change_24h"],
                            "changePercent_24h": dic["market_cap_change_percentage_24h"],
                        },
                    ],
                    [
                        "max_supply",
                        "supply",
                        lambda _, dic: {
                            "circulating": dic["circulating_supply"],
                            "total": dic["total_supply"],
                            "max": dic["max_supply"],
                        },
                    ],
                    ["fully_diluted_valuation", "fdv"],
                    [
                        "ath",
                        "ath",
                        lambda _, dic: {
                            "val": dic["ath"],
                            "changePercent": dic["ath_change_percentage"],
                            "ts": dic["ath_date"],
                        },
                    ],
                    [
                        "atl",
                        "atl",
                        lambda _, dic: {
                            "val": dic["atl"],
                            "changePercent": dic["atl_change_percentage"],
                            "ts": dic["atl_date"],
                        },
                    ],
                    ["last_updated", "updatedAt"],
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
