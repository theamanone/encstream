const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

async function runBuild() {
  try {
    // Build CommonJS version
    await build({
      entryPoints: ['src/index.ts'],
      outfile: 'dist/index.js',
      bundle: true,
      platform: 'node',
      target: ['node14'],
      format: 'cjs',
      plugins: [nodeExternalsPlugin()],
    });

    // Build ESM version
    await build({
      entryPoints: ['src/index.ts'],
      outfile: 'dist/index.esm.js',
      bundle: true,
      platform: 'neutral',
      target: ['es2018'],
      format: 'esm',
      plugins: [nodeExternalsPlugin()],
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

runBuild();
