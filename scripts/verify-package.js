const fs = require('fs');
const path = require('path');

function verifyPackage() {
  const errors = [];

  // Check dist directory
  if (!fs.existsSync('dist')) {
    errors.push('dist directory is missing. Run npm run build first.');
  }

  // Check package.json
  const pkg = require('../package.json');
  const requiredFields = ['name', 'version', 'main', 'types'];
  
  requiredFields.forEach(field => {
    if (!pkg[field]) {
      errors.push(`Missing required field in package.json: ${field}`);
    }
  });

  // Check TypeScript types
  if (!fs.existsSync('dist/index.d.ts')) {
    errors.push('TypeScript declarations are missing');
  }

  // Report results
  if (errors.length > 0) {
    console.error('Package verification failed:');
    errors.forEach(err => console.error(`- ${err}`));
    process.exit(1);
  } else {
    console.log('Package verification passed!');
  }
}

verifyPackage();
