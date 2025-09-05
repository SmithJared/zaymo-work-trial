# Review of URL Shortener Microservice (Go + Supabase)

Overall this went pretty well. If you don't include the time it took for me to write this review document then my total time was 4 hours 20 minutes. I started by doing about 1 hour and 20 minutes of research/prep. I utilized ChatGpt and Gemini as well as some web surfing to outline how url shortening works, barriers to consider, and libraries to use. I had ai generate the implementation plans then I edited them for some small changes. The backend took 50 minutes to implement and the deployment process took 15 minutes. The frontend took the rest of that time. 

There are several features and things that would be on my roadmap to keep fleshing this project out. I organized them roughly by domain. 

## Frontend

- Biggest change to the frontend would be stylistically. The design is almost entirely stock ai generated in terms of colors and layout. I did reduce the number of components and position by hand. I didn't spend the time to make a custom theme/palette or invest heavily is building out a strong user ux flow. Would definitly be a big subject of future development.
- For the sake of time I didn't implement a formatter/linter for the code. I like to use Biome for both. That would be a big must for future development.
- I don't have any form of type validation. Right now the types being passed back in forth is pretty basic so its not an issue but as types blow up id like to use a type validator like Zod.

## Backend

### Server

- Right now the server accepts requests from any origin. It would be beneficial to limit this to only accept requests from the frontend.
- The logging is default and a little gross to read. Would be nice to setup strong logging capabilites. 
- I'd love to implement a in memory cache to hold urls. I included a batch id/index in my database schema but didn't get around to implementing this on the server side. The idea is whenever a batch of urls is shortened it would be given a batch id/index. Then whenever one of those urls is retrieved the server would grab the whole batch and cache it. This would allow for faster access for the rest of the urls. Would be helpful if the email's urls are lazy loaded.

### Database

- Right now the server connects to supabase using the supabase-go client. If supabase was the ultimate choice for persistent storage then it would be beneficial to use a Direct Connection to the database. This would allow for faster access to the database and also allow for more control over the database.
- I think there are some real benefits to using an sqlite db for this type of application. It would reduce the network latency of hitting an external database and has a small footprint/complexity compared to postgres. 
- I included a expiry date field in the db but didn't build the application logic for it. I'm not sure how long a url would need to support shortening. Is someone really going to open an email from two years ago? It would help to keep the size of the db down which in turn helps with performance.

### QA

- I don't have any form of QA so anything would be nice here.
- I did include a number of times checked field in the db so it would be relativly easy to implement how many times a url has been clicked.