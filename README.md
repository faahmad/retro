# Retro
The retrospective tool for people who hate retros.

## Getting started
- Clone the repository.
- Install the versions of node needed. You will need 2 separate versions, one for `/web` and one for `/web/functions`. You can use `nvm` to manage multiple node versions.
- Install dependencies in `/web` and in `/web/functions`.
- Inside `/web/functions`, run `yarn config:get` to clone the environment variables.
- To run the code, you will need two separate tabs in your terminal.
  - Run `yarn emulate` inside `/web/functions`
  - Run `yarn dev` inside `/web`
- Your local environment should be ready to develop. Have fun breaking stuff!
