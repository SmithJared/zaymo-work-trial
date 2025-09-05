# Review of URL Shortener Microservice (Go + Supabase)

## Backend

### Database

- Right now the server connects to supabase using the supabase-go client. If supabase was the ultimate choice for persistent storage then it would be beneficial to use a Direct Connection to the database. This would allow for faster access to the database and also allow for more control over the database.
- I think there are some real benefits to using an sqlite db for this type of application. It would reduce the network latency of hitting an external database and has a small footprint/complexity compared to postgres. 