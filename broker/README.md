(From: https://github.com/pact-foundation/pact-python/tree/master/examples/broker)

### Postgresql (for testing purposes)
Username: `postgres`
Password: `Just_for_t3st1ng`

### Broker (for testing purposes)
Username: `pactbroker`
Password: `PoC_P4CT!`

### Run

```
$ cd broker
$ docker-compose up
```

### Ensure that the pact has been published:
http://localhost/pacts/provider/wd/consumer/gate/latest
