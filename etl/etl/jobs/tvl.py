import json

import httpx
from dotenv import load_dotenv
from toolz import compose_left
from toolz.curried import filter, map, merge

from etl.connector import get_redis_connection
from etl.utils import now, pick, s_to_ms, sort

def normalize_protocol(raw_protocol, total_tvl, n):
    return pick(
        [
            ["symbol", "symbol", lambda s, _: None if s == "-" else s],
            "name",
            "description",
            ["logo", "imageUrl"],
            ["twitter", "urlTwitter"],
            ["url", "urlWebsite"],
            ["listedAt", "listedAt", lambda val, _: s_to_ms(val)],
            ["mcap", "marketCap"],
            ["name", "rank", lambda val, dic: n + 1],
            [
                "category",
                "category",
                lambda c, _: "DEX" if c == "Dexes" else c,
            ],
            [
                "chainTvls",
                "tvl",
                lambda _, dic: {
                    "current": dic["chainTvls"]["Solana"],
                    "change_7day": dic["change_7d"],
                    "change_24h": dic["change_1d"],
                    "change_1h": dic["change_1h"],
                    "dominancePercent": (dic["chainTvls"]["Solana"] / total_tvl)
                    * 100,
                },
            ],
        ],
        raw_protocol,
        enforce_unset=True,
    )

def normalize_tvl(raw_history, raw_protocols):
    total_tvl = raw_history[-1]["totalLiquidityUSD"]
    return {
        "totalTvl": total_tvl,
        "history": list(
            map(
                pick(
                    [
                        ["date", "ts", lambda val, _: s_to_ms(val)],
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
                sort(lambda a, b: b["chainTvls"]["Solana"] - a["chainTvls"]["Solana"]),
                lambda raw_protocols: [
                    normalize_protocol(raw_protocol, total_tvl, n) for n, raw_protocol in enumerate(raw_protocols)
                ]
            )(raw_protocols)
        ),
    }


def update_tvl():
    redis = get_redis_connection()


    tvl_response = httpx.get("https://api.llama.fi/charts/Solana")
    tvl_response.raise_for_status()
    raw_tvl_history = tvl_response.json()

    protocols_response = httpx.get("https://api.llama.fi/protocols")
    protocols_response.raise_for_status()
    raw_protocols = protocols_response.json()

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
