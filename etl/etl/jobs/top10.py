import json
import os

import httpx
from dotenv import load_dotenv
from toolz.curried import map

from etl.connector import get_redis_connection
from etl.jobs.nft_collections import normalize_nft_collection
from etl.utils import now


def fetch_top10():
    # TODO
    tokens = None

    nfts = httpx.post(
        "https://beta.api.solanalysis.com/rest/get-project-stats",
        headers={"Authorization": os.environ["HYPERSPACE_TOKEN"]},
        json={
            "pagination_info": {
                "page_number": 1,
                "page_size": 10,
            },
            "order_by": {
                "field_name": "volume_1hr",
                "sort_order": "DESC",
            },
        },
    ).json()

    return [tokens, nfts]


def normalize_nft(raw_nft):
    return {}


def normalize_token(raw_token):
    pass


def normalize_top10(raw_tokens, raw_nfts):
    return [
        raw_tokens,
        [normalize_nft_collection(raw_collection, n) for n, raw_collection in enumerate(raw_nfts["project_stats"])]
    ]


def update_top10():
    redis = get_redis_connection()

    [raw_top10_tokens, raw_top_10_nfts] = fetch_top10()
    [top10_tokens, top_10_nfts] = normalize_top10(raw_top10_tokens, raw_top_10_nfts)

    result = json.dumps(
        {
            "data": {
                "nfts": top_10_nfts,
                "tokens": top10_tokens,
            },
            "count": None,
            "type": "object",
            "updatedAt": now(),
        }
    )

    redis.set("top10", result)
    redis.close()

    return result


if __name__ == "__main__":
    load_dotenv()
    print(update_top10())
