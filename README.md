# www.analogstudiosri.com

## Overview

Frontend website for [www.analogstudiosri.com](www.analogstudiosri.com) built with [Greenwood](https://www.greenwoodjs.io). It is deployed using Github Actions to AWS (S3 / Cloudfront / Lambda) using SST. The [backend](https://github.com/AnalogStudiosRI/api) uses and AWS (API Gateway / Lambda) with [Architect](https://arc.codes/).

## Setup

1. Clone the repo
1. Have the latest [NodeJS LTS](https://nodejs.org/) version installed or run `nvm use` if using [nvm](https://github.com/nvm-sh/nvm)
1. Run `npm ci`

## Environment Variables

A list of environment variables in a _.env_ file needed to run the project.

| Name                 | Description                          | Notes                                   |
| -------------------- | ------------------------------------ | --------------------------------------- |
| `AWS_REGION`         | AWS region for SST                   | Needed for running `npm run deploy:xxx` |
| `AWS_ROLE_TO_ASSUME` | IAM Role for running SST             | Needed for running `npm run deploy:xxx` |
| `CONTACT_EMAIL`      | The "to:" email for the contact form | Needed for running `npm run deploy:xxx` |
| `DATABASE_URL`       | Database                             | All APIs except Events                  |
| `DATABASE_TOKEN`     | Credentials needed for prod DB       | All APIs except Events                  |

## Tasks

After getting setup, you can run the following development commands:

- `npm run dev` - Starts **Greenwood**'s local development server
- `npm run story:dev` - Runs [**Storybook**](https://storybook.js.org/) in development mode
- `npm run test:tdd` - Runs unit tests in `watch` mode using [**@web/test-runner**](https://modern-web.dev/docs/test-runner/overview/)
- `npm run lint` - Lint all files in the project (TS / JS , CSS)
- `npm run format` - Format all files

> _See `package.json#scripts` for a full list of available commands._

## Contact Form

To test the contact form, you'll have to have a proper AWS config file setup and run the project with SST.

```sh
$ npm run build
$ npx sst dev
```

You can then open `localhost:1984` in the browser and send emails.

## Prisma Studio

To run Prisma studio locally:

1. Run `npx prisma db push`
1. In _.env_ update `DATABASE_URL` to _file:../sql/analogstudios-20240404.bak.db_
