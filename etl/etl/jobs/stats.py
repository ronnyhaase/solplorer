import json

from dotenv import load_dotenv

from etl.connector import get_connections
from etl.jobs.epoch import normalize_epoch
from etl.utils import now


def update_stats():
    [redis, solana] = get_connections()

    raw_epoch = solana.get_epoch_info().value
    raw_perf_samples = solana.get_recent_performance_samples(30).value

    result = json.dumps(
        {
            "data": {
                "epoch": normalize_epoch(raw_epoch),
                "blockHeight": raw_epoch.block_height,
                "slotHeight": raw_epoch.absolute_slot,
                "transactionsCount": raw_epoch.transaction_count,
                "tps": round(
                    raw_perf_samples[0].num_transactions / raw_perf_samples[0].sample_period_secs
                ),
            },
            "count": 0,
            "type": "object",
            "updatedAt": now(),
        }
    )

    redis.set("stats", result)
    redis.close()

    return result


if __name__ == "__main__":
    load_dotenv()
    print(update_stats())
