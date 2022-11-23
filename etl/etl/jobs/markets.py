import json

import httpx
from dotenv import load_dotenv

from etl.connector import get_redis_connection
from etl.utils import calc_change, now, s_to_ms, str_format_money


def normalize_price_history(raw_history_data):
    history = []
    for n, raw_price in enumerate(raw_history_data["prices"]):
        history.append(
            {
                "ts": raw_price[0],
                "price": round(raw_price[1], 2),
                "volume": round(raw_history_data["total_volumes"][n][1]),
            }
        )
    return history


def normalize_tvl_history(raw_tvl_data):
    tvl_history = []
    for raw_tvl in raw_tvl_data:
        tvl_history.append(
            {
                "ts": s_to_ms(raw_tvl["date"]),
                "tvl": round(raw_tvl["totalLiquidityUSD"]),
            }
        )
    return tvl_history


def normalize_markets_data(raw_price_data, raw_history_data, raw_tvl_data):
    return {
        "price": str_format_money(raw_price_data["solana"]["usd"]),
        "tvl": raw_tvl_data[-1]["totalLiquidityUSD"],
        "tvlChange": round(
            calc_change(
                raw_tvl_data[-2]["totalLiquidityUSD"],
                raw_tvl_data[-1]["totalLiquidityUSD"],
            ),
            2,
        ),
        "volume": round(raw_price_data["solana"]["usd_24h_vol"]),
        "change": round(raw_price_data["solana"]["usd_24h_change"], 2),
        "marketCap": round(raw_price_data["solana"]["usd_market_cap"]),
        "history": normalize_price_history(raw_history_data),
        "tvlHistory": normalize_tvl_history(raw_tvl_data),
    }


def update_markets():
    redis = get_redis_connection()

    raw_price_data = httpx.get(
        "https://api.coingecko.com/api/v3/simple/price",
        params={
            "ids": "solana",
            "vs_currencies": "usd",
            "include_market_cap": True,
            "include_24hr_vol": True,
            "include_24hr_change": True,
        },
    ).json()
    raw_history_data = httpx.get(
        "https://api.coingecko.com/api/v3/coins/solana/market_chart",
        params={
            "vs_currency": "usd",
            "days": 13,
            "interval": "daily",
        },
    ).json()
    raw_tvl_data = httpx.get("https://api.llama.fi/charts/Solana").json()

    result = json.dumps(
        {
            "data": normalize_markets_data(
                raw_price_data, raw_history_data, raw_tvl_data
            ),
            "count": 0,
            "type": "object",
            "updatedAt": now(),
        }
    )

    redis.set("_markets", result)
    redis.close()

    return result


if __name__ == "__main__":
    load_dotenv()
    print(update_markets())
