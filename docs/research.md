# Research

- Using a base62 encoding is effective for short urls because its encodes the normal url alphabet [0-9][a-z][A-Z]


## Initial Thoughts/Reqs

**Frontend**
- Clean ui, easy to import a html file
- Need to extract all the urls. Would prefer to do this client side to keep backend logic contained to url shortening/serving. Can just send an array of links to be shortened to a backend route.
- Needs to display some sort of waiting/progress
- Needs to put the shortened links back into the original html. I am thinking of a map, [long-url: short]
- Notify user of completion and allow download of new html file

**Backend**
- Storing a long url in a database, getting it's id, then using base62 encoding it gives a short link
- Whenever a short link hits the server it just converts it back to the db id and can search the db for it.
- Need a route that can take in long urls stored in an array
- Returns an array of key-val pairs [long-url: short]


### Barriers/Questions

[ ] Can I use sqlite or will I need to use supabase?
[x] What base62 library will be the best bet on the backend? (I decided "https://pkg.go.dev/github.com/jxskiss/base62#section-readme" is a good library. It's fast and the readme explains how the algorithms works which is nice)
[x] How will I:
[ ] [x] Parse out all urls (I am thinking doing a string search for "https" but that could be time/memory expensive)
[ ] [x] Retain where in the html those urls exist for replacing them with the shortening links 
[x] Can I make a single round trip to the database inserting all of the long urls and receiving the indexs for each on of them and retain which index maps to which urls?
[x] The current DOMParser works great for finding the urls however it missed on in a css import "url()". I am not sure how to find all of those.

## Tech Stack

**Frontend**
- React/Typescript Frontend
- May use Zod for type validations (if I have time)
- Use vercel to host the static site because it is so dead simple
- Use the DOMParser to parse the html file and find all intances of a url

**Backend**
- Would really like to use sqlite for something like this. Avoids the round trip latency for an external service like supabase but I've never deployed sqlite to a hosting service before and so supabase might be the easier pick here?
- Golang server because go is the best ;)
- Two options for a base62 library, need to research which has the better api, ease of implementation, and speed
- Deploy to the render service I have under the lever domain

