# Larks Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

- `npm start` Runs the app in the development mode.
- `npm test` Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
- `npm run build` Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
- `npm run eject` - Irreversibly removes the react-scripts build dependency. (Don't do this)
- `npm run lint` - Runs the ESLinter.

## Note on ESLint

The `.eslintrc.json` file in the frontend directory is setup to look for
`tsconfig.json` at the same directory level, however your editor (VSCode in
this example) may give lint warnings based on the root directory.
eg. `could not find ...\larks\tsconfig.json` error.
This can be solved by adding the following setting to your
`frontend/.vscode/settings.json` file - (or other editor equivalent).
```json
{
  "eslint.workingDirectories": [
    "./frontend"
  ]
}
```

## Running Tests

### Unit Tests

`npm run test` to run unit tests.

### Functional Tests

In one terminal open the application on localhost by running:

`npm start`

Now you can either run the tests in another terminal using:

`npx cypress run`

Or you can run it on a chromium browser using:

`npx cypress open`

## Deploying to S3

First you need to rebuild the app using

`npm run build`

Then you need to sync what you have locally with the S3 bucket using:

`npm run client-s3-deploy`

After that, you need to create an invalidation for ther cloudront which will clear it's cache for the app build and allow the changes made to the S3 to be visible. For this run:

`npm run create-cloudfront-invalidation`



## Writing and Running Tests with Jest

### 1. Installing Jest
- Installing Node.js and npm.
- Creating a new Node.js project (`npm init`).
- Installing Jest in your project (`npm install --save-dev jest`).

### 2. Running Tests with `npx`
- Using `npx jest` to run all tests.
- Running specific tests with `npx jest [test-name-or-pattern]`.

### 3. Coverage Reports with `npx`
- Generating test coverage reports (`npx jest --coverage`).

## Best Practices, Tips, and `npx`
- Effective use of `npx` with Jest.
- Structuring and organizing test files.
- Running tests in watch mode (`npx jest --watch`).
