package main

import (
	"encoding/json"
	"fmt"
	"os"
)

func calculatePrimesInRange(from, to uint) []uint {
	if from < 2 {
		from = 2
	}
	primes, primeNumbers := make([]bool, to+1), make([]uint, 0)

	for i := range to + 1 {
		primes[i] = true
	}

	for i := uint(2); i*i <= to; i++ {
		if primes[i] {
			for j := i * i; j <= to; j += i {
				primes[j] = false
			}
		}
	}

	for i := uint(from); i <= to; i++ {
		if primes[i] {
			primeNumbers = append(primeNumbers, i)
		}
	}

	return primeNumbers
}

type Range struct {
	From uint `json:"from"`
	To   uint `json:"to"`
}

type Output struct {
	Primes []uint `json:"primes"`
	Total  uint   `json:"total"`
}

func main() {
	// Read JSON input from stdin
	var r Range
	decoder := json.NewDecoder(os.Stdin)
	if err := decoder.Decode(&r); err != nil {
		fmt.Fprintf(os.Stderr, "Error decoding JSON input: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("%d", len(calculatePrimesInRange(r.From, r.To)))
}
