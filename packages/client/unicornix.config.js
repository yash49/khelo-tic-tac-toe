import { COLOR, OUTPUT_FORMAT, OUTPUT_COLOR } from 'unicornix';

export default {
  theme: {
    neutral: COLOR.gray_colder,
    accent: COLOR.blue,
    safe: COLOR.green,
    info: COLOR.sky,
    warning: COLOR.amber,
    alert: COLOR.red,
    content: COLOR.gray_cold,
    background: COLOR.gray_cold,
  },
  output: {
    color: OUTPUT_COLOR.hex,
    format: [OUTPUT_FORMAT.css, OUTPUT_FORMAT.cssref, OUTPUT_FORMAT.js],
  },
  options: {
    cssNamespace: 'ttt',
    cssColorPrefix: 'color',
    cssDataSelector: 'theme',
    cssSelector: '',
    scssVariableCase: 'kebab',
    twTheme: 'dark',
  },
  build: {
    outputPath: './.unicornix',
  },
};
