# URL Shortener Service

A minimal URL shortening service built with Go, Echo framework, and Supabase (PostgreSQL) backend.

## Features

- **Batch URL Shortening**: Accept multiple URLs in a single request
- **Base62 Encoding**: Generate short, readable codes
- **Fast Redirects**: HTTP 301 redirects to original URLs
- **Supabase Integration**: PostgreSQL database with automatic ID generation
- **RESTful API**: Clean JSON API endpoints

## Prerequisites

- Go 1.19 or higher
- Supabase account and project
- Environment variables configured

## Database Setup

Run this SQL in your Supabase SQL editor to create the required table:

```sql
create table urls (
  id bigint generated always as identity primary key,
  long_url text not null,
  created_at timestamp with time zone default now()
);
```

## Installation

1. Clone the repository and navigate to the go-src directory
2. Install dependencies:
   ```bash
   go mod download
   ```

3. Copy the environment file and configure it:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your Supabase credentials:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon/service key
   - `PORT`: Server port (optional, defaults to 8080)

## Running the Service

```bash
# Load environment variables and start the server
export $(cat .env | xargs) && go run .
```

## API Endpoints

### POST /shorten
Shorten one or multiple URLs.

**Request:**
```json
{
  "urls": [
    "https://example.com/very-long-url-1",
    "https://example.com/very-long-url-2"
  ]
}
```

**Response:**
```json
{
  "shortened": [
    {
      "id": 1,
      "long_url": "https://example.com/very-long-url-1",
      "short_url": "http://localhost:8080/1"
    },
    {
      "id": 2,
      "long_url": "https://example.com/very-long-url-2", 
      "short_url": "http://localhost:8080/2"
    }
  ]
}
```

### GET /{shortCode}
Redirect to the original URL.

**Example:**
```
GET /1 → 301 Redirect to https://example.com/very-long-url-1
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Project Structure

```
go-src/
├── main.go           # Main application with all handlers
├── go.mod           # Go module dependencies
├── go.sum           # Dependency checksums
├── .env.example     # Environment variables template
├── README.md        # This file
└── schema.sql       # Database schema
```

## Dependencies

- **Echo v4**: Web framework for routing and middleware
- **Supabase Go**: Official Supabase client for Go
- **Base62**: Encoding library for generating short codes

## Future Enhancements

- Batch caching: Store batched URLs in memory for faster redirects
- Click tracking: Add click_count column and analytics
- URL expiry: Add expires_at column for temporary URLs
- Advanced analytics: Track IP, user agent, referrer data

## Development

To build the application:
```bash
go build -o url-shortener main.go
```

To run tests (when implemented):
```bash
go test ./...
```
