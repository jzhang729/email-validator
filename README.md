# E-mail Validator

Technical assessment submission for the role of Web Engineer at Invoice Simple.

Job Posting:

https://www.invoicesimple.com/careers/web-engineer-front-end?utm_source=recruiterflow&utm_medium=email&utm_campaign=web-engineer&utm_content=career

Specs:

https://share.nuclino.com/p/Web-coding-challange-O9Lo1q9x3x27es4PU2KenP

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

The project has the sandbox key from my account by default, but feel free to replace with your own to get actual API responses.

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

Run the npm 'dev' script.

```
npm run dev
```

Visit http://localhost:3000 in your browser.

## Authors

**Jordan Zhang**

* [Github](https://github.com/jzhang729)
* [Email](mailto:jordanzhang@gmail.com)
* Phone: +1-514-924-5123
