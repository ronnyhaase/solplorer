from datetime import datetime

from dateutil.parser import parse as date_parse
from toolz import curry


def calc_change(old_val, new_val):
    if new_val == old_val or old_val == 0:
        return 0
    return -(((old_val - new_val) / old_val) * 100)


def s_to_ms(seconds):
    return int(seconds) * 1000


def isodate_ts(iso_date_str):
    return round(date_parse(iso_date_str).timestamp() * 1000)


def now():
    return round(datetime.utcnow().timestamp() * 1000)


def now_iso():
    return datetime.utcnow().isoformat() + "Z"


@curry
def pick(picks, source, enforce_unset=False):
    if not isinstance(picks, list) or not isinstance(source, dict):
        return source
    result = {}
    for src_key in source.keys():
        for pick_key in picks:
            if isinstance(pick_key, list):
                old_name = pick_key[0]
                new_name = pick_key[1] if len(pick_key) > 1 else None
                transform = pick_key[2] if len(pick_key) > 2 else None
                if src_key == old_name:
                    result[new_name or old_name] = (
                        transform(source[old_name])
                        if callable(transform)
                        else source[old_name]
                    )
                elif enforce_unset and not source.get(old_name):
                    result[new_name or old_name] = None
            elif enforce_unset and not source.get(pick_key):
                result[pick_key] = None
            else:
                if src_key == pick_key:
                    result[src_key] = source[src_key]
    return result


def safe_round(n, digits=None):
    """Rounds n but only when it is a float, otherwise returns it as is"""
    return round(n, digits) if type(n) == float else n


def str_format_money(str_number):
    return round(float(str_number), 2)
