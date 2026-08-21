import type { Configuration } from "lint-staged";

export default {
  "*.js": ["npm run lint:js --"],
  "*.css": ["npm run lint:css --"],
  // https://github.com/lint-staged/lint-staged#example-run-tsc-on-changes-to-typescript-files-but-do-not-pass-any-filename-arguments
  "*.{ts,tsx}": [() => "npm run check"],
  "*.*": ["npm run lint:ls --", "npm run format --"],
} satisfies Configuration;
