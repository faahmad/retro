# Retro

The retrospective tool for people who hate retros.

## Onboarding checklist

- Join the Discord server
- Get added to the Firebase projects
- Get access to the Shared Google Drive
- Get access to the Figma designs
- Get added to the Amplitude dashboard
- Get access to the Google Analytics dashboard
- Get access to the Stripe dashboard
- Get access to the CustomerIO workspace
- Get added to Retro's workspace (for team-fooding)

## Development environment setup

### Prereqs

#

You'll need node v14 and node v10. We recommend using a tool like [nvm](https://github.com/nvm-sh/nvm) to manage multiple node versions.

```
nvm install 14
```

```
nvm install 10
```

After you've installed both node versions, you'll need to install [yarn](https://classic.yarnpkg.com/en/). We use yarn version `1.22.17`.

```
# We can install on node v14
nvm use 14
npm i -g yarn@1.22.17
```

Once you have finished installing the correct versions of node & yarn, you can set up the repository.

### Setting up the repo

#

Clone the repository.

```
git clone https://github.com/retro-code/retro.git
```

> There are two "apps" in this project, the React app and the Firebase cloud functions. You will need to install dependencies separately for each app.

The React app is at /retro/web and uses node v14

```
# Change directories
cd /retro/web

# Make sure you're using node v14
nvm use 14

# Install deps
yarn
```

The Firebase cloud functions are at /retro/web/functions and use node v10

```
# Change directories (assuming you are already at /retro/web)
cd /functions

# Make sure you're using node v10
nvm use 10

# Install deps
yarn
```

Before you can run the code, you'll need to get the environment variables. Please ask Faraz for access.

There are 3 environment variable files. 2 of them are for the React app, and 1 is for the Firebase cloud functions. Paste them in the following places:

```
/web
  .env.development
  .env.production
  /functions
    .runtimeconfig.json
```

### Running the project locally

After you've followed the steps above, you should be ready to run the project.

Open 2 tabs. In one of the tabs you will run the local firebase emulator, and the other will run the React app.

**Tab 1: run the emulator**

```
# Change directories
cd /retro/web

# Make sure you're using node v14
nvm use 14

# run the emulator
yarn emulate
```

> The emulator is now running on `localhost:4000`

#

**Tab 2: run the React app**

```
# Change directories
cd /retro/web

# Make sure you're using node v14
nvm use 14

# run the React app
yarn dev
```

> the React app is now running on `localhost:3000`

At this point, you should be ready to start development. Have fun breaking stuff!

#

### Learning material

Here is a bunch of helpful learning materal you can use to get familiar with our tech stack

**Docs**

- [React](https://reactjs.org/docs/getting-started.html)
- [Firebase](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)

**Videos**

- [The beginnner's guide to React](https://egghead.io/courses/the-beginner-s-guide-to-react)
- [Firebase back to the basics](https://www.youtube.com/watch?v=q5J5ho7YUhA)
- [Use Tailwind to build a Discord-inspired Animated Navbar](https://www.youtube.com/watch?v=pfaSUYaSgRo)
