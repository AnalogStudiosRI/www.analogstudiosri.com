export default {
  "*.js": ["npm run lint:js --"],
  "*.ts": ["npm run lint:ts --"],
  "*.css": ["npm run lint:css --"],
  // TODO: '*.ts': ['npm run check --'],
  // https://github.com/AnalogStudiosRI/www.analogstudiosri.com/issues/26
  "*.*": ["npm run lint:ls --", "npm run format --"],
};
