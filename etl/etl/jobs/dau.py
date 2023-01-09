import json
import os
from datetime import datetime, timedelta

import httpx
from dotenv import load_dotenv


def update_dau():
    yesterday = (datetime.today() - timedelta(days=1)).strftime("%d-%m-%Y")

    # Get yesterdays DAU
    raw_dau = httpx.get("https://hyper.solana.fm/v1/stats/active-users?date=" + yesterday).json()
    # "2023-01-05 0:00:00.0" -> "2023-01-05 00:00:00"
    raw_dau["date"] = raw_dau["date"][:10] + " 0" + raw_dau["date"][10 + 1 : -2]
    dau_s = json.dumps(raw_dau) + "\n"

    # Ingest to Tinybird
    response = httpx.post(
        "https://api.tinybird.co/v0/events?name=dau",
        headers={"Authorization": "Bearer " + os.environ["TINYBIRD_INGEST_TOKEN"]},
        content=dau_s,
    )
    response.raise_for_status()
    data = response.json()

    if data["successful_rows"] != 1:
        raise Exception("Row was not inserted")

    return raw_dau


if __name__ == "__main__":
    load_dotenv()
    print(update_dau())
