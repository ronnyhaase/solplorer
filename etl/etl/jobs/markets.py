import json

import httpx
from dotenv import load_dotenv
from toolz import merge

from etl.connector import get_redis_connection
from etl.utils import calc_change, now, s_to_ms, str_format_money


def normalize_price_history(raw_history_data):
    price_history = []
    reduced_raw_history = raw_history_data["prices"][0:-1]
    for n, raw_price in enumerate(reduced_raw_history):
        price_history.append(
            {
                "ts": raw_price[0],
                "price": round(raw_price[1], 2),
                "volume": round(raw_history_data["total_volumes"][n][1]),
            }
        )
    return price_history


def normalize_tvl_history(raw_tvl_data):
    tvl_history = []
    reduced_raw_tvl_history = raw_tvl_data[-14:]
    for raw_tvl in reduced_raw_tvl_history:
        tvl_history.append(
            {
                "ts": s_to_ms(raw_tvl["date"]),
                "tvl": round(raw_tvl["totalLiquidityUSD"]),
            }
        )
    return tvl_history


def merge_price_tvl_history(price_history, tvl_history):
    merged_history = []
    for n, price in enumerate(price_history):
        merged_history.append(merge(price, tvl_history[n]))
    return merged_history


def normalize_markets_data(raw_price_data, raw_price_history, raw_tvl_history):
    price_history = normalize_price_history(raw_price_history)
    tvl_history = normalize_tvl_history(raw_tvl_history)
    merged_history = merge_price_tvl_history(price_history, tvl_history)

    return {
        "price": str_format_money(raw_price_data["solana"]["usd"]),
        "tvl": raw_tvl_history[-1]["totalLiquidityUSD"],
        "tvlChange": round(
            calc_change(
                raw_tvl_history[-2]["totalLiquidityUSD"],
                raw_tvl_history[-1]["totalLiquidityUSD"],
            ),
            2,
        ),
        "volume": round(raw_price_data["solana"]["usd_24h_vol"]),
        "change": round(raw_price_data["solana"]["usd_24h_change"], 2),
        "marketCap": round(raw_price_data["solana"]["usd_market_cap"]),
        "history": merged_history,
    }


def update_markets():
    redis = get_redis_connection()

    price_response = httpx.get(
        "https://api.coingecko.com/api/v3/simple/price",
        params={
            "ids": "solana",
            "vs_currencies": "usd",
            "include_market_cap": True,
            "include_24hr_vol": True,
            "include_24hr_change": True,
        },
    )
    price_response.raise_for_status()
    raw_price_data = price_response.json()

    history_response = httpx.get(
        "https://api.coingecko.com/api/v3/coins/solana/market_chart",
        params={
            "vs_currency": "usd",
            "days": 14,
            "interval": "daily",
        },
    )
    history_response.raise_for_status()
    raw_history_data = history_response.json()

    tvl_response = httpx.get("https://api.llama.fi/charts/Solana")
    tvl_response.raise_for_status()
    raw_tvl_data = tvl_response.json()

    result = json.dumps(
        {
            "data": normalize_markets_data(raw_price_data, raw_history_data, raw_tvl_data),
            "count": 0,
            "type": "object",
            "updatedAt": now(),
        }
    )

    redis.set("markets", result)
    redis.close()

    return result


if __name__ == "__main__":
    load_dotenv()
    print(update_markets())
