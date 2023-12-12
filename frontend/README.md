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

## EaseMind

If you haven't already, you need to install prop-types in your project. Run `npm i -S prop-types` in your project directory.
