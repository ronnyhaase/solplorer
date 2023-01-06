"""
Get and print all DAUs from Solana.FM since 2022-01-01 till yesterday in CSV format
"""
from datetime import datetime, timedelta
import json
from time import sleep

import httpx

if __name__ == "__main__":
    date = datetime(2022, 1, 1)
    yesterday = datetime.today() - timedelta(days=1)

    while date < yesterday:
        data = httpx.get(
            "https://hyper.solana.fm/v1/stats/active-users?date=" + date.strftime("%d-%m-%Y")
        ).json()

        # "2023-01-05 0:00:00.0" -> "2023-01-05 00:00:00"
        data["date"] = data["date"][:10] + " 0" + data["date"][10 + 1 : -2]

        print(json.dumps(data))
        sleep(0.25)
        date += timedelta(days=1)
