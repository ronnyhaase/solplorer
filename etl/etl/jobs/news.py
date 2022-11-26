import json
import os

import httpx
from dotenv import load_dotenv

from etl.connector import get_redis_connection
from etl.utils import isodate_ts, now


def normalize_news(raw_news):
    news = []
    for article in raw_news:
        news.append(
            {
                "publishedAt": isodate_ts(article["published_at"]),
                "source": article["source"]["title"],
                "title": article["title"],
                "url": article["url"],
            }
        )
    return news


def update_news():
    redis = get_redis_connection()

    raw_news = httpx.get(
        "https://cryptopanic.com/api/v1/posts/",
        params={
            "auth_token": os.environ["CRYPTOPANIC_TOKEN"],
            "public": "true",
            "currencies": "SOL",
            "kind": "news",
            "filter": "important",
        },
    ).json()["results"]

    result = json.dumps(
        {
            "data": normalize_news(raw_news),
            "count": len(raw_news),
            "type": "list",
            "updatedAt": now(),
        }
    )

    redis.set("news", result)
    redis.close()

    return result


if __name__ == "__main__":
    load_dotenv()
    print(update_news())
