import json
import os

import httpx
from dotenv import load_dotenv
from toolz.curried import map

from etl.connector import get_redis_connection
from etl.utils import isodate_ts, now


def fetch_nft_collections():
    data = []
    for page_number in range(1, 4):
        response = httpx.post(
            "https://beta.api.solanalysis.com/rest/get-project-stats",
            headers={"Authorization": os.environ["HYPERSPACE_TOKEN"]},
            json={
                "conditions": {
                    # "is_verified": True,
                },
                "pagination_info": {
                    "page_number": page_number,
                    "page_size": 1000,
                },
                "order_by": {
                    "field_name": "market_cap",
                    "sort_order": "DESC",
                },
            },
        )
        response.raise_for_status()
        partial = response.json()
        data += partial["project_stats"]
    return data


def normalize_nft_collection(raw_collection, n):
    return {
        "name": raw_collection["project"]["display_name"],
        "slug": raw_collection["project"]["project_slug"],
        "description": raw_collection["project"]["description"],
        "imageUrl": raw_collection["project"]["img_url"].strip()
        if isinstance(raw_collection["project"]["img_url"], str)
        else None,
        "isMinting": bool(raw_collection["project"]["is_minting"]),
        "urlTwitter": raw_collection["project"]["twitter"],
        "urlDiscord": raw_collection["project"]["discord"],
        "urlWebsite": raw_collection["project"]["website"],
        "addressCreator": raw_collection["project"]["first_creator"],
        "addressEdition": raw_collection["project"]["mcc_id"],
        "marketCap": raw_collection["market_cap"],
        "rank": n + 1,
        "price": {
            "floor": raw_collection["floor_price"],
            "floorChangePercent_24h": raw_collection["floor_price_1day_change"],
            "avg": raw_collection["average_price"],
            "avgChangePercent_24h": raw_collection["average_price_1day_change"],
            "max": raw_collection["max_price"],
        },
        "volume": {
            "1m": raw_collection["volume_1m"],
            "5m": raw_collection["volume_5m"],
            "15m": raw_collection["volume_15m"],
            "30m": raw_collection["volume_30m"],
            "7day": raw_collection["volume_7day"],
            "24h": raw_collection["volume_1day"],
            "changePercent_24h": raw_collection["volume_1day_change"],
            "1h": raw_collection["volume_1hr"],
        },
        "supply": {
            "total": raw_collection["supply"],
            "holders": raw_collection["num_of_token_holders"],
            "listed": raw_collection["num_of_token_listed"],
            "listedPercent": raw_collection["percentage_of_token_listed"],
        },
        "hyperspace_id": raw_collection["project"]["project_id"],
        "createdAt": isodate_ts(raw_collection["created_at"]),
        "updatedAt": isodate_ts(raw_collection["updated_at"]),
    }


def normalize_nft_collections(raw_nfts):
    return [
        normalize_nft_collection(raw_collection, n) for n, raw_collection in enumerate(raw_nfts)
    ]


def update_nft_collections():
    redis = get_redis_connection()

    raw_nfts = fetch_nft_collections()
    nfts = normalize_nft_collections(raw_nfts)

    result = json.dumps(
        {
            "data": nfts,
            "count": len(nfts),
            "type": "list",
            "updatedAt": now(),
        }
    )

    redis.set("nft-collections", result)
    redis.close()

    return result


if __name__ == "__main__":
    load_dotenv()
    print(update_nft_collections())
