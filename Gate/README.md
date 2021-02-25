# Gate (Provider and Consumer)

## Setup

```
pip3 install -r requirements.txt
```

## Run

```
python3 src/gate.py
```

## Generate Pact File (as the Consumer)

```
$ cd tests # important, due to an issue with the pacts directory (to be solved)
$ python -m pytest pact_wd.py
```

## Verify Provider

### External Method: Using pact-provider-verifier

```
$ pact-provider-verifier --provider-base-url=http://localhost:5000 --pact-broker-base-url=http://localhost --broker-username=pactbroker --broker-password=PoC_P4CT! --provider="Gate" --consumer-version-tag="expectations_from_UI_0.0.1c" --publish-verification-results --provider-app-version="0.0.2p"
```

### Internal Method

TODO

## Issues

On macOS Big Sur:

- Had to uninstall Python that had been installed via Brew
- Install Python 3.9 from installer
- `/Applications/Python\ 3.9/Install\ Certificates.command`

Then:

- `python -m pip install -r requirements.txt`

To run the test (to generate the contract)

- `python -m pytest tests/pact_wd.py`