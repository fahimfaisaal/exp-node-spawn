package main

import (
	"fmt"
	"os"
	"time"
)

// Function to check if a number is prime
func isPrime(n int) bool {
	if n <= 1 {
		return false
	}
	if n <= 3 {
		return true
	}
	if n%2 == 0 || n%3 == 0 {
		return false
	}
	for i := 5; i*i <= n; i += 6 {
		if n%i == 0 || n%(i+2) == 0 {
			return false
		}
	}
	return true
}

// 100000000

type Range struct {
	From int `json:"from"`
	To   int `json:"to"`
}

type Output struct {
	Took  float32 `json:"took"`
	Count int     `json:"count"`
}

func (r *Range) Generate() ([]int, error) {
	if r.From > r.To {
		return nil, fmt.Errorf("invalid range: From (%d) is greater than To (%d)", r.From, r.To)
	}

	numbers := make([]int, 0, r.To-r.From+1)
	for i := r.From; i <= r.To; i++ {
		numbers = append(numbers, i)
	}
	return numbers, nil
}

func main() {
	startTime := time.Now()

	// Read JSON input from stdin
	var r Range = Range{From: 1, To: 100000000}

	// Generate numbers in the range
	numbers, err := r.Generate()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error generating range: %v\n", err)
		os.Exit(1)
	}

	count := 0

	for _, num := range numbers {
		if prime := isPrime(num); prime {
			count++
		}
	}

	output := Output{
		Took:  float32(time.Since(startTime).Seconds()),
		Count: count,
	}

	fmt.Printf("Took %fs\n", output.Took)
}
