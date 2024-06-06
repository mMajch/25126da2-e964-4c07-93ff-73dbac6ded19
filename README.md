This is an AI chatbot application created with [Next.js](https://nextjs.org/) and [Nest](https://github.com/nestjs/nest). The chatbot history is stored in a local sqlite database.
All responses are generated using the OpenAI API and enriched with a use case specific prompt.

Check out the [demo video](demo.mp4) to see it in action.

## Running the application

First, you need to provide the OpenAI token. Create an .env file inside the backend folder and add the token as following:

```bash
OPEN_AI_API_KEY=sk-proj-RwCkh...
```

Then run the backend application to start the API:
```bash
$ cd backend
$ yarn install
$ yarn run start:dev
```

It should now run on [http://localhost:3001](http://localhost:3001). The backend will create the database.sqlite file if it doesn't exist.

Second, run the development frontend application:

```bash
$ cd frontend
$ yarn install
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the webapp.

## General comments

All the requirements are met beside chat response streaming. I skipped it due to time constraints.

Note that this application is a proof of concept. It is built with good principles in mind but the code can be made much cleaner. Same applies for styling and UX.

A few things that should be worked on if the app would be deployed to users:

- database (it might be better to migrate to a more scalable solution, like a cloud database)
- authorization (user id is hardcoded on the backend side, it could be properly done with an OAuth token)
- error handling
- reusing models between frontend and backend
- loading states
- tests
