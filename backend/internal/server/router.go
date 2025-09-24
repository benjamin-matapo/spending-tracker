package server

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/google/uuid"

	"spending-tracker/backend/internal/models"
	"spending-tracker/backend/internal/storage"
)

type Server struct {
	store *storage.MemoryStore
}

func NewRouter(store *storage.MemoryStore) http.Handler {
	s := &Server{store: store}
	r := chi.NewRouter()

	// CORS for local dev and typical frontend deploys
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Route("/api", func(r chi.Router) {
		r.Post("/transactions", s.handleAddTransaction)
		r.Get("/transactions", s.handleGetAllTransactions)
		r.Get("/transactions/category/{category}", s.handleGetByCategory)
		r.Get("/summary/category", s.handleGetTotalsByCategory)
	})

	// health check
	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	return r
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func (s *Server) handleAddTransaction(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Amount      float64 `json:"amount"`
		Category    string  `json:"category"`
		Date        string  `json:"date"`
		Description string  `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
		return
	}

	t := models.Transaction{
		ID:          uuid.NewString(),
		Amount:      payload.Amount,
		Category:    strings.TrimSpace(payload.Category),
		Date:        strings.TrimSpace(payload.Date),
		Description: strings.TrimSpace(payload.Description),
	}
	if err := t.Validate(); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	s.store.AddTransaction(t)
	writeJSON(w, http.StatusCreated, t)
}

func (s *Server) handleGetAllTransactions(w http.ResponseWriter, r *http.Request) {
	trs := s.store.GetAll()
	writeJSON(w, http.StatusOK, trs)
}

func (s *Server) handleGetByCategory(w http.ResponseWriter, r *http.Request) {
	category := chi.URLParam(r, "category")
	if category == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "category is required"})
		return
	}
	trs := s.store.GetByCategory(category)
	writeJSON(w, http.StatusOK, trs)
}

func (s *Server) handleGetTotalsByCategory(w http.ResponseWriter, r *http.Request) {
	totals := s.store.TotalsByCategory()
	writeJSON(w, http.StatusOK, totals)
}
