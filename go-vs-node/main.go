package main

import "fmt"

// Function to check if a number is prime
func isPrime(n uint32) bool {
	if n <= 1 {
		return false
	}
	if n <= 3 {
		return true
	}
	if n%2 == 0 || n%3 == 0 {
		return false
	}
	for i := uint32(5); i*i <= n; i += 6 {
		if n%i == 0 || n%(i+2) == 0 {
			return false
		}
	}
	return true
}

type Range struct {
	From uint32 `json:"from"`
	To   uint32 `json:"to"`
}

func main() {
	// Read JSON input from stdin
	var r Range = Range{1, 100000000}

	primes := uint32(0)
	for num := r.From; num <= r.To; num++ {
		if prime := isPrime(num); prime {
			primes++
		}
	}

	fmt.Printf("Total primes %d\n", primes)
}
