export default {
  "*.js": ["npm run lint:js --"],
  "*.css": ["npm run lint:css --"],
  // TODO: '*.ts': ['npm run check --'],
  // https://github.com/AnalogStudiosRI/www.analogstudiosri.com/issues/26
  "*.*": ["npm run lint:ls --", "npm run format --"],
};
