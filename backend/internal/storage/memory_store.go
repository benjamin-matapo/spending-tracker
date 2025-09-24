package storage

import (
	"sort"
	"sync"

	"spending-tracker/backend/internal/models"
)

type MemoryStore struct {
	mu           sync.RWMutex
	transactions []models.Transaction
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{transactions: make([]models.Transaction, 0)}
}

func (s *MemoryStore) AddTransaction(t models.Transaction) models.Transaction {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.transactions = append(s.transactions, t)
	return t
}

func (s *MemoryStore) GetAll() []models.Transaction {
	s.mu.RLock()
	defer s.mu.RUnlock()
	// return a copy to avoid data races
	out := make([]models.Transaction, len(s.transactions))
	copy(out, s.transactions)
	// sort by date desc then insertion order
	sort.SliceStable(out, func(i, j int) bool { return out[i].Date > out[j].Date })
	return out
}

func (s *MemoryStore) GetByCategory(category string) []models.Transaction {
	s.mu.RLock()
	defer s.mu.RUnlock()
	res := make([]models.Transaction, 0)
	for _, t := range s.transactions {
		if t.Category == category {
			res = append(res, t)
		}
	}
	// sort by date desc
	sort.SliceStable(res, func(i, j int) bool { return res[i].Date > res[j].Date })
	return res
}

func (s *MemoryStore) TotalsByCategory() map[string]float64 {
	s.mu.RLock()
	defer s.mu.RUnlock()
	totals := make(map[string]float64)
	for _, t := range s.transactions {
		totals[t.Category] += t.Amount
	}
	return totals
}
