import json
from functools import reduce

from dotenv import load_dotenv

from etl.connector import get_connections
from etl.utils import now

SOL_PER_LAMPORT = 0.000000001


def calc_stake(raw_validators):
    stake_active = reduce(
        lambda total, val: total + val.activated_stake, raw_validators.current, 0
    )
    stake_delinquent = reduce(
        lambda total, val: total + val.activated_stake, raw_validators.delinquent, 0
    )
    return [stake_active, stake_delinquent]


def update_supply():
    [redis, solana] = get_connections()

    raw_supply = solana.get_supply().value
    raw_validators = solana.get_vote_accounts().value

    [stake_active, stake_delinquent] = calc_stake(raw_validators)

    result = json.dumps(
        {
            "data": {
                "circulating": raw_supply.circulating * SOL_PER_LAMPORT,
                "nonCirculating": raw_supply.non_circulating * SOL_PER_LAMPORT,
                "total": raw_supply.total * SOL_PER_LAMPORT,
                "circulatingPercent": (raw_supply.circulating / raw_supply.total) * 100,
                "activeStake": round(stake_active * SOL_PER_LAMPORT),
                "delinquentStake": round(stake_delinquent * SOL_PER_LAMPORT),
                "activeStakePercent": (stake_active / raw_supply.total) * 100,
                "delinquentsStakePercent": (stake_delinquent / raw_supply.total) * 100,
            },
            "count": 0,
            "type": "object",
            "updatedAt": now(),
        }
    )

    redis.set("supply", result)
    redis.close()

    print(stake_active, stake_delinquent)
    return result


if __name__ == "__main__":
    load_dotenv()
    print(update_supply())
