import url from 'url';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  entry: `${dirname}/client/src/app.js`,
  output: {
    path: `${dirname}/client/public/js`,
    filename: 'bundle.js',
  },
  mode: 'development',
};
