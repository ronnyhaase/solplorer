import json
import os

import httpx
from dotenv import load_dotenv

from etl.connector import get_redis_connection
from etl.utils import calc_change, isodate_ts, now, sort

# NATIVE_SOL_CMC_ID = 5426
WSOL_CMC_ID = 16116
USDC_CMC_ID = 3408


def fetch_raw_tokens():
    raw_tokens = []

    done = False
    start = 1
    LIMIT = 5000
    while not done:
        resp = httpx.get(
            "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
            params={
                "start": start,
                "limit": LIMIT,
                "convert": "USD",
                "aux": "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_7d,volume_30d",
            },
            headers={
                "X-CMC_PRO_API_KEY": os.environ["CMC_TOKEN"],
            },
        )
        resp.raise_for_status()
        resp_json = resp.json()

        for token in resp_json["data"]:
            if (
                "solana-ecosystem" in token["tags"]
                or (token["platform"] and token["platform"].get("slug") == "solana")
                or token["id"] == USDC_CMC_ID
            ):
                raw_tokens.append(token)

        if start + LIMIT >= resp_json["status"]["total_count"]:
            done = True
        else:
            start += LIMIT

    return raw_tokens


def normalize_token(raw_token, n):
    return {
        "symbol": raw_token["symbol"] if raw_token["id"] != WSOL_CMC_ID else "wSOL",
        "name": raw_token["name"],
        "imageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/"
        + str(raw_token["id"])
        + ".png",
        "cmc": {
            "id": raw_token["id"],
            "rank": raw_token["cmc_rank"],
            "slug": raw_token["slug"],
        },
        "price": {
            "current": raw_token["quote"]["USD"]["price"],
            "changePercent_1h": round(raw_token["quote"]["USD"]["percent_change_1h"], 2),
            "changePercent_24h": round(raw_token["quote"]["USD"]["percent_change_24h"], 2),
            "changePercent_7d": round(raw_token["quote"]["USD"]["percent_change_7d"], 2),
            "changePercent_30d": round(raw_token["quote"]["USD"]["percent_change_30d"], 2),
            "changePercent_60d": round(raw_token["quote"]["USD"]["percent_change_60d"], 2),
            "changePercent_90d": round(raw_token["quote"]["USD"]["percent_change_90d"], 2),
        },
        "volume": {
            "current": raw_token["quote"]["USD"]["volume_24h"],
            "change_24h": round(raw_token["quote"]["USD"]["volume_change_24h"], 2),
            "changePercent_24h": round(
                calc_change(
                    raw_token["quote"]["USD"]["volume_24h"],
                    raw_token["quote"]["USD"]["volume_24h"]
                    + raw_token["quote"]["USD"]["volume_change_24h"],
                ),
                2,
            ),
            "24h": round(raw_token["quote"]["USD"]["volume_24h"], 2),
            "7d": round(raw_token["quote"]["USD"]["volume_7d"], 2),
            "30d": round(raw_token["quote"]["USD"]["volume_30d"], 2),
        },
        "marketCap": raw_token["quote"]["USD"]["market_cap"]
        if raw_token["quote"]["USD"]["market_cap"]
        else raw_token["self_reported_market_cap"],
        "fdv": raw_token["quote"]["USD"]["fully_diluted_market_cap"]
        if raw_token["quote"]["USD"]["fully_diluted_market_cap"]
        else None,
        "supply": {
            "circulating": raw_token["circulating_supply"]
            if raw_token["circulating_supply"]
            else raw_token["self_reported_circulating_supply"],
            "max": raw_token["max_supply"] if raw_token["max_supply"] else None,
            "total": raw_token["total_supply"] if raw_token["total_supply"] else None,
        },
        "tokenAddress": raw_token["platform"].get("token_address")
        if raw_token["platform"]
        else None,
        "updatedAt": isodate_ts(raw_token["last_updated"]),
    }


def update_tokens():
    redis = get_redis_connection()

    raw_tokens = fetch_raw_tokens()
    tokens = sort(
        lambda a, b: (b["marketCap"] or 0) - (a["marketCap"] or 0),
        [normalize_token(raw_token, n) for n, raw_token in enumerate(raw_tokens)],
    )
    result = json.dumps(
        {
            "data": tokens,
            "count": len(tokens),
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
