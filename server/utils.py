import pytest
import re
from flask import request as req

# @pytest.fixture
def unserialize(x: list, keys=[]) -> list:
    data = []
    for el in x:
        el = el.__dict__
        el_to_add = {}
        for key in keys:
            el_to_add[key] = el[key]
        data.append(el_to_add)
    return data

# @pytest.fixture
def validate_email(email: str) -> bool:
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)