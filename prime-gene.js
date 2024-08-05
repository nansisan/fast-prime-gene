function SieveOfAtkin(limit) {
    console.time("Total time");

    if (limit > 2**31 - 1) {
        throw new Error("The upper limit must be less than 2**31-1.");
    }

    console.time("Array generation time");
    let sieve = new Uint32Array(Math.ceil((limit + 31) / 32));
    let primes = new Int32Array(Math.ceil(1.25506 * limit / Math.log(limit))).fill(0);
    console.log("Memory size: " + Math.floor((sieve.length * 4 + primes.length * 4) / 1024) + " KB.");
    console.timeEnd("Array generation time");

    primes[0] = 2;
    primes[1] = 3;
    let index = 2;

    console.time("Calculation time");
    const limitSqrt = Math.floor(Math.sqrt(limit));

    for (let x = 1; 4 * x * x <= limit; x++) {
        for (let y = 1; y <= limitSqrt; y+=2) {
            let n = 4 * x * x + y * y
            if (n <= limit && (n % 12 === 1 || n % 12 === 5)) {
                sieve[n >> 5] ^= 1 << (31 & n);
            }
        }
	}
	for (let x = 1; 3 * x * x <= limit; x+=2) {
        for (let y = 2; y <= limitSqrt; y+=2) {
            n = 3 * x * x + y * y;
            if (n <= limit && n % 12 === 7) {
                sieve[n >> 5] ^= 1 << (31 & n);
            }
        }
	}
	for (let x = 1; 2 * x * x <= limit; x++) {
		for (let y = 1 + x & 1; y < x; y+=2) {
            n = 3 * x * x - y * y;
            if (n <= limit && n % 12 === 11) {
                sieve[n >> 5] ^= 1 << (31 & n);
            }
		}
    }
    for (let n = 5; n <= limitSqrt; n += 2) {
        if (sieve[n >> 5] & (1 << (31 & n))) {
            for (let k = n * n; k < limit; k += (n * n) << 1) {
                sieve[k >> 5] &= ~(1 << (31 & k));
            }
        }
    }
	console.timeEnd("Calculation time");

    console.time("Prime number array generation time");
    for (let n = 5; n < limit; n += 2) {
        if (sieve[n >> 5] & (1 << (31 & n))) {
            primes[index++] = n;
        }
    }
    console.timeEnd("Prime number array generation time");

    console.timeEnd("Total time");

    primes[index] = null;

    return primes.subarray(0, index);
}

console.log(SieveOfAtkin(1e8).length);
