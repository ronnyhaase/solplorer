import os

from redis import Redis
from solana.rpc.api import Client


def get_redis_connection():
    redis_client = Redis.from_url(os.environ["REDIS_URL"])
    if not redis_client.ping():
        raise Exception("Connection to Redis failed")
    return redis_client


def get_solana_connection():
    solana_client = Client(os.environ["SOLANA_RPC_URL"])
    if not solana_client.is_connected():
        raise Exception("Connection to Solana RPC failed")
    return solana_client


def get_connections():
    redis_client = get_redis_connection()
    solana_client = get_solana_connection()

    return [redis_client, solana_client]
