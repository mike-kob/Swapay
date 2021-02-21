# juno

This is the repository with the backend and logic.

## Local development

### Requirements

You need the docker on your machine and PostgresQL server 11+.

### Configuration

1. Copy example env file `cp .env.example .env` and fill in the variables values.
2. Run `docker-compose up -d web`. This command should run development server
on your machine.

`http://localhost:8000/teammates/` - admin interface \
`http://localhost:8000/gql/` - graphql endpoint \
`http://localhost:8000/giql/` - graphql endpoint with Graph*i*QL for debugging

## Project structure
Settings: `juno`

Apps

- `chat` - logic for messaging
- `exchanges` - the app with main logic of domain (games, game photos, game tags, etc)
- `gqlapi` - only GraphQL configuration
- `support` - blog articles (not active in demo)
- `users` - custom user model
- `utils` - helping tools used throughout the project

Each app contains models and logic related to them. There's also `graphql`
folder that containes definition and resolvers for types, queries and 
mutations relative to this app.