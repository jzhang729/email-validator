# E-mail Validator

A side project written in Typescript that uses the Kickbox API to validate e-mail addresses typed in by the user.

## Instructions

Before you begin, make sure you have the latest versions of Node JS and NPM.

Inside the project folder, run the following command in the terminal. This will install project dependencies on the client and server.

```
npm run setup
```

The project has a `.env.sample` file that requires a [Kickbox.io](http://kickbox.io) API key. Replace where it says `[insert Kickbox.io API key here]` with a test or production API key, otherwise use my test key:

```
test_8d71abca3d95acad9ac7e26ac6317714de975a6afef3fef200ed1a980d4fffd0
```

Rename `.env.sample` to `.env`.

The included default typeahead e-mail suggestions are:

```
apple.com
gmail.com
gmail.co.uk
hotmail.com
icloud.com
me.com
yahoo.com
yahoo.ca
```

These can be modified inside of the `client/src/config.js` file as desired.

Run the npm 'dev' script to start the local development server.

**Please note: Any time you change the .env file, you must restart the server for changes to take effect.**

```
npm run dev
```

Visit http://localhost:3000 in your browser.

## Authors

**Jordan Zhang**

* [Github](https://github.com/jzhang729)
* [Email](mailto:jordanzhang@gmail.com)
