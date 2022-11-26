import json

from dotenv import load_dotenv

from etl.connector import get_connections
from etl.utils import now


def normalize_epoch(raw_epoch):
    AVG_SLOTTIME = 550
    return {
        "currentEpoch": raw_epoch.epoch,
        "nextEpoch": raw_epoch.epoch + 1,
        "slotCurrent": raw_epoch.slot_index,
        "slotTarget": raw_epoch.slots_in_epoch,
        "slotRangeStart": raw_epoch.absolute_slot - raw_epoch.slot_index,
        "slotRangeEnd": (
            raw_epoch.absolute_slot - raw_epoch.slot_index + raw_epoch.slots_in_epoch
        ),
        "epochETA": (raw_epoch.slots_in_epoch - raw_epoch.slot_index) * AVG_SLOTTIME,
        "epochProgress": round((raw_epoch.slot_index / raw_epoch.slots_in_epoch) * 100),
    }


def update_epoch():
    [redis, solana] = get_connections()

    raw_epoch = solana.get_epoch_info().value

    result = json.dumps(
        {
            "data": {"epoch": normalize_epoch(raw_epoch)},
            "count": 0,
            "type": "object",
            "updatedAt": now(),
        }
    )

    redis.set("epoch", result)
    redis.close()

    return result


if __name__ == "__main__":
    load_dotenv()
    print(update_epoch())
