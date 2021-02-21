# terra

Frontend project

## Local development

1. Copy example of env file `cp .env.example .env.local`
2. Change var `PROXY_HOST` if necessary
3. Run `yarn` (or `npm install`) to install dependencies
4. Run `yarn dev` (or `npm run dev`) to launch developement server on  [http://localhost:3000](http://localhost:3000)

## Project structure
- `pages` directory is solely for routing 
  (no react code here, except for auxiliary files, like `_app.js`, `_document.js`, `404.js`)
  
- `public` - static assets here
- `src` - source code for pages
    - `components` - components shared between multiple pages
    - `gql` - graphql queries and mutations
    - `acitonCreators`, `reducer`, `constants` - redux related directories
    - `pages` - each page should have its own directory here and export default 
    from `index.js` the page component.