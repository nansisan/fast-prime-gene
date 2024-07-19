function SieveOfAtkin(limit) {
    console.time("Total time");

    if (limit > 2**31 - 1) {
        throw new Error("The upper limit must be less than 2**31-1.");
    }

    console.time("Array generation time");
    let sieve = new Uint8Array(Math.ceil((limit + 1) / 8));
    let primes = new Int32Array(Math.ceil(1.25506 * limit / Math.log(limit))).fill(0);
    console.log("Memory size: " + Math.floor((sieve.length + primes.length * 4) / 1024) + " KB.");
    console.timeEnd("Array generation time");

    primes[0] = 2;
    primes[1] = 3;
    let index = 2;

    console.time("Calculation time");
    const limitSqrt = Math.floor(Math.sqrt(limit));

    for (let x = 1; x <= limitSqrt; x++) {
        const xSqr = x * x;
        for (let y = 1; y <= limitSqrt; y++) {
            const ySqr = y * y;

            let n = (xSqr << 2) + ySqr;//n = 4 * xSqr + ySqr
            if (n <= limit && (n % 12 == 1 || n % 12 == 5)) {
                sieve[n >> 3] ^= 1 << (7 & n);
            }

            n -= xSqr;//n = 3 * xSqr + ySqr
            if (n <= limit && n % 12 == 7) {
                sieve[n >> 3] ^= 1 << (7 & n);
            }

            if (x > y) {
                n = 3 * xSqr - ySqr;
                if (n <= limit && n % 12 == 11) {
                    sieve[n >> 3] ^= 1 << (7 & n);
                }
            }
        }
    }
    console.timeEnd("Calculation time");

    console.time("Prime number array generation time");
    for (let n = 5; n <= limitSqrt; n++) {
        if (sieve[n >> 3] & (1 << (7 & n))) {
            const nSqr = n * n;
            for (let k = nSqr; k < limit; k += nSqr) {
                sieve[k >> 3] &= ~(1 << (7 & k));
            }
        }
    }

    for (let n = 5; n < limit; n += 2) {
        if (sieve[n >> 3] & (1 << (7 & n))) {
            primes[index++] = n;
        }
    }
    console.timeEnd("Prime number array generation time");

    console.timeEnd("Total time");

    primes[index] = null;

    return primes.subarray(0, index);
}

SieveOfAtkin(1e8)
