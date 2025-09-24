package models

import "errors"

var (
	ErrInvalidAmount   = errors.New("amount must be greater than 0")
	ErrInvalidCategory = errors.New("category is required")
	ErrInvalidDate     = errors.New("date must be in YYYY-MM-DD format")
)
