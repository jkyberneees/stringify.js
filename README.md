# stringify.js
PoC implementation of a faster pure JavaScript `JSON stringify` alternative. 

## Can we actually have a JSON stringifier library that performs faster than JSON.stringify?
Although this is still a work in progress, results are great so far.  

Benchmarks using latest node v10:
```bash
Running 500000 iterations each:
> Payload size: big
. Using JSON.stringify
... elapsed time AVG:  0.02305 ms
. Using stringify.js
... elapsed time AVG:  0.018 ms

> Payload size: small
. Using JSON.stringify
... elapsed time AVG:  0.00354 ms
. Using stringify.js
... elapsed time AVG:  0.002494 ms

> Payload size: very-small
. Using JSON.stringify
... elapsed time AVG:  0.001614 ms
. Using stringify.js
... elapsed time AVG:  0.001136 ms
```

# Want to contribute?
This is your repo ;)