const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const pkg = require('./package.json');

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'react/jsx-runtime'
];

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: './dist',
    exclude: ['**/*.test.ts', '**/*.test.tsx']
  })
];

module.exports = [
  // CommonJS (for Node) and ES module (for bundlers) build
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      }
    ],
    external,
    plugins
  },
  // Minified browser-ready UMD build
  {
    input: 'src/index.ts',
    output: {
      name: 'EncStream',
      file: 'dist/index.umd.min.js',
      format: 'umd',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      }
    },
    external: ['react', 'react-dom'],
    plugins: [...plugins, terser()]
  }
];
