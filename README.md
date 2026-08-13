# www.analogstudiosri.com

## Overview

Frontend website for [www.analogstudiosri.com](www.analogstudiosri.com) built with [Greenwood](https://www.greenwoodjs.io). It is deployed using Github Actions to AWS (S3 / Cloudfront / Lambda) using SST. The [backend](https://github.com/AnalogStudiosRI/api) uses and AWS (API Gateway / Lambda) with [Architect](https://arc.codes/).

## Contributing

### Setup

You'll need the latest [NodeJS LTS](https://nodejs.org/) version installed to run and contribute to this project. Or run `nvm use` if using [nvm](https://github.com/nvm-sh/nvm).

You can confirm by running the following:

```sh
$ node -v
24.4.0
```

Then run `npm ci` to install the project's dependencies.

### Environment Variables

A list of environment variables in a _.env_ file needed to run the project.

| Name                   | Description                             | Notes                                   |
| ---------------------- | --------------------------------------- | --------------------------------------- |
| `API_BACKEND_HOSTNAME` | Hostname for the standalone API backend |                                         |
| `AWS_REGION`           | AWS region for SST                      | Needed for running `npm run deploy:xxx` |
| `AWS_ROLE_TO_ASSUME`   | IAM Role for running SST                | Needed for running `npm run deploy:xxx` |

### Tasks

After installing the above, you can run the following key development commands:

- `npm run dev` - Starts **Greenwood**'s local development server
- `npm run story:dev` - Runs [**Storybook**](https://storybook.js.org/) in development mode
- `npm run test:tdd` - Runs unit tests in `watch` mode using [**@web/test-runner**](https://modern-web.dev/docs/test-runner/overview/)
- `npm run lint` - Lint all files in the project (TS / JS , CSS)
- `npm run format` - Format all files

> _See `package.json#scripts` for a full list of available commands._
