# Local Development

### First time setup

From the project directory root:

1. `nvm use`
1. `pnpm install`
1. `pnpm package:build`

The source code for the package is in packages/nextjs-routes/.

There are examples that use the locally built package in examples/.

There is an e2e test that runs against a minimal nextjs application in packages/e2e/.

### Testing

Tests are run with jest.

From the project directory root:

`pnpm test`

### Linting

As part of installation, husky pre-commit hooks are installed to run linters against the repo.

### Publishing

There are CI and publishing GitHub workflows in ./github/workflows. These are named ci.yml and publish.yml.
