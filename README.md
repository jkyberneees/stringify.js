# stringify.js
PoC implementation of a faster pure JavaScript `JSON stringify` alternative. 

> "It may be that reaching a faster implementation in pure JS results impossible due to `string's escaping` needs..."

## Can we actually have a JSON stringifier library that performs faster than JSON.stringify?
Although this is still a work in progress, results are great so far.  

Benchmarks using latest node v10:
```bash
Running 100000 iterations each:
> Payload size: big
Using JSON.stringify:  0.0228 ms
Using stringify.js:  0.01914 ms
Using stable-fast-stringify:  0.0569 ms
> Payload size: small
Using JSON.stringify:  0.00369 ms
Using stringify.js:  0.00271 ms
Using stable-fast-stringify:  0.00522 ms
> Payload size: very-small
Using JSON.stringify:  0.00201 ms
Using stringify.js:  0.00149 ms
Using stable-fast-stringify:  0.00182 ms
```

# TODOs:
- String escape (really hard to introduce w/o degrading performance in JS) 
- Circular Reference Detection

# Want to contribute?
This is your repo ;)