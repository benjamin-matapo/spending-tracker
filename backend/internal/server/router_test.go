package server

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"spending-tracker/backend/internal/storage"
)

func TestAddAndGetTransactions(t *testing.T) {
	store := storage.NewMemoryStore()
	h := NewRouter(store)

	// Add transaction
	payload := map[string]any{
		"amount":      25.50,
		"category":    "Food",
		"date":        "2024-01-10",
		"description": "Lunch",
	}
	b, _ := json.Marshal(payload)
	req := httptest.NewRequest(http.MethodPost, "/api/transactions", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", rec.Code, rec.Body.String())
	}

	// Get all
	req2 := httptest.NewRequest(http.MethodGet, "/api/transactions", nil)
	rec2 := httptest.NewRecorder()
	h.ServeHTTP(rec2, req2)
	if rec2.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec2.Code)
	}
	var list []map[string]any
	if err := json.Unmarshal(rec2.Body.Bytes(), &list); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if len(list) != 1 {
		t.Fatalf("expected 1 transaction, got %d", len(list))
	}
}

func TestValidation(t *testing.T) {
	store := storage.NewMemoryStore()
	h := NewRouter(store)

	payload := map[string]any{
		"amount":      -1,
		"category":    "",
		"date":        "not-a-date",
		"description": "Bad",
	}
	b, _ := json.Marshal(payload)
	req := httptest.NewRequest(http.MethodPost, "/api/transactions", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
}
