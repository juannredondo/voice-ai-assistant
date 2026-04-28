// Test: Check if electron module resolves properly
console.log('Module paths:', module.paths.slice(0, 3));
console.log('__dirname:', __dirname);

// Try deleting the require cache for 'electron' to force built-in resolution
const electronPath = require.resolve('electron');
console.log('electron resolves to:', electronPath);

// Check if the built-in electron module exists
try {
  // In proper Electron context, deleting the npm module cache should expose the built-in
  delete require.cache[electronPath];
  // Now try requiring the actual built-in 'electron' module
  const builtinElectron = process.electronBinding ? true : false;
  console.log('Has electronBinding:', builtinElectron);
  console.log('process.type:', process.type);
  console.log('process.versions.electron:', process.versions.electron);
} catch(e) {
  console.log('Error:', e.message);
}

process.exit(0);
