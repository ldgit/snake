# template-svelte

Template for quick start with Svelte frontend library.

Requires:

- [Node.js](https://nodejs.org/en/download/) >= 14

Uses:

- [Svelte](https://svelte.dev/)
- [Jest](https://jestjs.io/) for testing
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/) & [prettier-plugin-svelte](https://github.com/sveltejs/prettier-plugin-svelte) for code style
- [lint-staged](https://github.com/okonet/lint-staged) & [husky](https://github.com/typicode/husky) to lint and fix code style before commit

## Usage

Just copy everything minus `.git` into a new project folder:

- Starting inside this folder: `rsync -r --exclude=.git ./. ../new-svelte-project`
- `cd ../new-svelte-project`
- `npm install`

To start development:

- `npm run dev`

Build and run production version of the app:

- `npm run build`
- `npm run start`
