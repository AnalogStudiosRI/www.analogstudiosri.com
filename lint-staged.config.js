export default {
  "*.js": ["npm run lint:js --"],
  "*.css": ["npm run lint:css --"],
  "*.{ts,tsx}": ["npm run check --"],
  "*.*": ["npm run lint:ls --", "npm run format --"],
};
