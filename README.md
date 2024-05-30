# Northcoders News API

#### Project Summary

- This project is a backend api akin to reddit, it serves information from a PSQL database by accessing specified endpoints, this include parametric endpoints and queries. The database is hosted using Supabase and the API itself is hosted using Render.

#### Getting Started

- To clone the repo, please use `git clone https://github.com/Burnlees/be-nc-news.git` in your terminal.
- Install the following DevDependencies using the provided commands:

  - `npm init`
  - jest: `npm i jest -D`
  - jest-extended: `npm i jest-extended -D`
  - jest-sorted: `npm i jest-sorted -D`
  - pg-format: `npm i pg-format -D`
  - supertest: `npm i supertest -D`

- Install the following Dependencies using the provided commands:

  - husky: `npm i husky`
  - dotenv: `npm i dotenv`
  - express: `npm i express`
  - pg: `npm i pg`

- In order to use the API locally, you will have to create two files - `.env.development` & `.env.test` these will be used to set environment variables for PGDATABASE allowing you to conenct to the appropriate database.

  - Inside `.env.test` you will need `PGDATABASE=nc_news_test`
  - inside `.env.development` you will need `PGDATABASE=nc_news`

- To create and seed the local database please run the following commands in your terminal:

  - `npm run setup-dbs`
  - `npm run seed`

- To run testing on the codebase please use the following commands in your terminal:

  - All tests: `npm test`
  - API tests: `npm test app`
  - Utility tests: `npm test utils`

- This API was built using Postgres 14.11 and Node 21.6.2, I suggest you use the same versions or higher.

- **Hosted Version:** https://burnlees-news.onrender.com/api/

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
