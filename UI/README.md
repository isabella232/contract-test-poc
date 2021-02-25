Source: https://github.com/pact-foundation/pact-js

# Install

```
$ npm i
```

# Run API Client

## 1. Run the Gate Provider

```
$ cd Gate
$ python3 src/gate.py
```

## 2. Run the WD Provider

```
$ cd WD
$ sbt run
```

## 3. Perform the request

```
$ node node src/consumer.js 
```

# Run tests (ensure that the providers are not up)

```
$ npm test
```

