package main

import (
	"encoding/json"
	"fmt"
	"os"
)

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

type Output struct {
	Primes []uint32 `json:"primes"`
	Total  uint32   `json:"total"`
}

func main() {
	// Read JSON input from stdin
	var r Range
	decoder := json.NewDecoder(os.Stdin)
	if err := decoder.Decode(&r); err != nil {
		fmt.Fprintf(os.Stderr, "Error decoding JSON input: %v\n", err)
		os.Exit(1)
	}
	primes := uint32(0)
	for num := r.From; num <= r.To; num++ {
		if prime := isPrime(num); prime {
			primes++
		}
	}

	output := Output{
		// Primes: primes,
		Total: primes,
	}

	// Encode the output as JSON and write it to stdout
	encoder := json.NewEncoder(os.Stdout)
	if err := encoder.Encode(output); err != nil {
		fmt.Fprintf(os.Stderr, "Error encoding output: %v\n", err)
		os.Exit(1)
	}
}
