import logging
import os
import atexit

import pytest

from pact import Consumer, Like, Provider, Term, Format
from Gate.src.gate import request_wd

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

PACT_BROKER_URL = "http://localhost/"
PACT_BROKER_USERNAME = "pactbroker"
PACT_BROKER_PASSWORD = "PoC_P4CT!"

PACT_MOCK_HOST = 'localhost'
PACT_MOCK_PORT = 8080
PACT_DIR = './'  # temporary fix: issue on macOS
# os.path.dirname(os.path.realpath(__file__))

URL = f"http://{PACT_MOCK_HOST}:{PACT_MOCK_PORT}/user"

test_tag = "expectations_from_gate_0.0.2c"
gate_version = "0.0.2c"  # as consumer
pact_specification = "2.0.0"


@pytest.fixture(scope='session')
def pact(request):
    version = request.config.getoption('--publish-pact')
    publish = True if version else False

    pact = Consumer('Gate', tags=[test_tag], version=pact_specification).has_pact_with(
        Provider('WD'), host_name=PACT_MOCK_HOST, port=PACT_MOCK_PORT,
        pact_dir=PACT_DIR, publish_to_broker=True, broker_base_url=PACT_BROKER_URL,
        broker_username=PACT_BROKER_USERNAME, broker_password=PACT_BROKER_PASSWORD, version=gate_version)
    pact.start_service()
    yield pact
    pact.stop_service()


def test_old_user(pact):
    expected = {
        'age': 'old',
        'name': 'Doe',
    }

    (pact
     .given('User Doe is 123 years old')
     .upon_receiving('a request for User Doe')
     .with_request(
        method='POST',
        path='/user',
        body={'name': 'Doe', 'age': 123},
        headers={'Content-Type': 'application/json'})
     .will_respond_with(200, body=expected))

    with pact:
        result = request_wd('Doe', 123)
        assert ('old' in result)


def test_young_user(pact):
    expected = {
        'age': 'young',
        'name': 'Smith',
    }

    (pact
     # .given('User Smith is 10 years old')
     .upon_receiving('a request for User Smith')
     .with_request(
        method='POST',
        path='/user',
        body={'name': 'Smith', 'age': 10},
        headers={'Content-Type': 'application/json'})
     .will_respond_with(200, body=expected))

    with pact:
        result = request_wd('Smith', 10)
        assert ('young' in result)


def test_young_user_uppercase(pact):
    expected = {
        'age': 'young',
        'name': 'ALICE',
    }

    (pact
     # .given('User ALICE is 20 years old')
     .upon_receiving('a request for User ALICE')
     .with_request(
        method='POST',
        path='/user',
        body={'name': 'ALICE', 'age': 20},
        headers={'Content-Type': 'application/json'})
     .will_respond_with(200, body=expected))

    with pact:
        result = request_wd('ALICE', 20)
        assert ('young' in result)
