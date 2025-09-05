package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/jxskiss/base62"
	"github.com/labstack/echo/v4"
	"github.com/supabase-community/supabase-go"
)

type URLService struct {
	client *supabase.Client
}

type ShortenRequest struct {
	URLs []string `json:"urls"`
}

type URLRecord struct {
	ID      int64  `json:"id"`
	LongURL string `json:"long_url"`
}

type ShortenedURL struct {
	ID       int64  `json:"id"`
	LongURL  string `json:"long_url"`
	ShortURL string `json:"short_url"`
}

type ShortenResponse struct {
	Shortened []map[string]string `json:"shortened"`
}

func NewURLService() *URLService {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("SUPABASE_URL and SUPABASE_KEY environment variables are required")
	}

	client, err := supabase.NewClient(supabaseURL, supabaseKey, &supabase.ClientOptions{})
	if err != nil {
		log.Fatal("Failed to create Supabase client:", err)
	}

	return &URLService{client: client}
}

func (s *URLService) shortenHandler(c echo.Context) error {
	var req ShortenRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
	}

	if len(req.URLs) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "URLs array cannot be empty"})
	}

	// Prepare data for batch insert
	insertData := make([]map[string]interface{}, len(req.URLs))
	for i, url := range req.URLs {
		insertData[i] = map[string]interface{}{
			"long_url": url,
		}
	}

	// Batch insert into Supabase
	var results []URLRecord
	_, err := s.client.From("urls").Insert(insertData, false, "", "", "").ExecuteTo(&results)
	if err != nil {
		log.Printf("Database insert error: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to store URLs"})
	}

	// Convert IDs to Base62 short codes and build response
	baseURL := getBaseURL(c)
	shortened := make([]map[string]string, len(results))
	for i, record := range results {
		shortCode := base62.EncodeToString([]byte(fmt.Sprintf("%d", record.ID)))
		shortURL := fmt.Sprintf("%s/%s", baseURL, shortCode)
		shortened[i] = map[string]string{
			record.LongURL: shortURL,
		}
	}

	return c.JSON(http.StatusOK, ShortenResponse{Shortened: shortened})
}

func (s *URLService) redirectHandler(c echo.Context) error {
	shortCode := c.Param("shortCode")
	if shortCode == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Short code is required"})
	}

	// Decode Base62 to get the ID
	decoded, err := base62.DecodeString(shortCode)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid short code"})
	}

	// Convert decoded bytes back to ID
	id, err := strconv.ParseInt(string(decoded), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid short code format"})
	}

	// Query Supabase for the long URL
	var results []URLRecord
	_, err = s.client.From("urls").Select("id, long_url", "", false).Eq("id", fmt.Sprintf("%d", id)).ExecuteTo(&results)
	if err != nil {
		log.Printf("Database query error: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Database error"})
	}

	if len(results) == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Short URL not found"})
	}

	// Redirect to the long URL
	return c.Redirect(http.StatusMovedPermanently, results[0].LongURL)
}

func getBaseURL(c echo.Context) string {
	scheme := "http"
	if c.Request().TLS != nil {
		scheme = "https"
	}
	return fmt.Sprintf("%s://%s", scheme, c.Request().Host)
}
