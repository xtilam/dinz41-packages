# @dinz41/safe-promise

A utility library for handling promises safely in JavaScript.

## Installation

```sh
npm install @dinz41/safe-promise
```

## Usage

### Safe Promise

The `safe` method allows you to handle promises without using `try/catch` blocks.

```javascript
import '@dinz41/safe-promise';

const promise = new Promise((resolve, reject) => {
  // ...some async operation...
});

(async () => {
  const [value, error] = await promise.safe();
  if (error) {
    console.error(error);
  } else {
    console.log(value);
  }
})();
```

### Safe All

The `safeAll` method allows you to handle multiple promises safely.

```javascript
import '@dinz41/safe-promise';

const promises = [
  Promise.resolve(1),
  Promise.reject(new Error('Failed')),
  Promise.resolve(3)
];

Promise.safeAll(promises).then(results => {
  results.forEach(result => {
    if (result.isFailed) {
      console.error(result.error);
    } else {
      console.log(result.value);
    }
  });
});
```


### Promise.safe

Static method that takes a promise and returns a `SafePromiseResult`.

### Promise.safeAll

Static method that takes an array of promises and returns an array of `SafePromiseResult`.

## License

MIT
