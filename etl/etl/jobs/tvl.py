import json

import httpx
from dotenv import load_dotenv
from toolz import compose_left
from toolz.curried import filter, map, merge

from etl.connector import get_redis_connection
from etl.utils import now, pick, s_to_ms, sort


def normalize_tvl(raw_history, raw_protocols):
    total_tvl = raw_history[-1]["totalLiquidityUSD"]
    return {
        "totalTvl": total_tvl,
        "history": list(
            map(
                pick(
                    [
                        ["date", "ts", s_to_ms],
                        ["totalLiquidityUSD", "tvl"],
                    ]
                ),
                raw_history,
            )
        ),
        "protocols": list(
            compose_left(
                filter(
                    lambda raw_protocol: "Solana" in raw_protocol["chains"]
                    and "chainTvls" in raw_protocol
                    and "Solana" in raw_protocol["chainTvls"]
                ),
                map(
                    lambda raw_protocol: merge(
                        pick(
                            [
                                [
                                    "category",
                                    "category",
                                    lambda c: "DEX" if c == "Dexes" else c,
                                ],
                                "change_1h",
                                "change_7d",
                                ["change_1d", "change_24h"],
                                "description",
                                ["listedAt", "listedAt", s_to_ms],
                                ["logo", "imageUrl"],
                                ["mcap", "marketCap"],
                                "name",
                                "symbol",
                                "twitter",
                                "url",
                            ],
                            enforce_unset=True
                        )(raw_protocol),
                        {
                            "dominancePercent": (raw_protocol["chainTvls"]["Solana"] / total_tvl) * 100,
                            "tvl": raw_protocol["chainTvls"]["Solana"],
                        },
                    ),
                ),
                sort(lambda a, b: b["tvl"] - a["tvl"])
            )(raw_protocols)
        ),
    }


def update_tvl():
    redis = get_redis_connection()

    raw_tvl_history = httpx.get("https://api.llama.fi/charts/Solana").json()
    raw_protocols = httpx.get("https://api.llama.fi/protocols").json()

    result = json.dumps(
        {
            "data": normalize_tvl(raw_tvl_history, raw_protocols),
            "count": None,
            "type": "object",
            "updatedAt": now(),
        }
    )

    redis.set("tvl", result)
    redis.close()

    return result


if __name__ == "__main__":
    load_dotenv()
    print(update_tvl())