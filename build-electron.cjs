process.noAsar = true;

const builder = require('electron-builder');
const Platform = builder.Platform;

console.log('Building portable single-file Windows executable...');

builder.build({
  targets: Platform.WINDOWS.createTarget(['dir', 'portable']),
  config: {
    appId: 'com.wordhunt.windows',
    productName: 'Word Hunt',
    copyright: '© 2026 Word Hunt Windows. All Rights Reserved.',
    npmRebuild: false,
    nodeGypRebuild: false,
    directories: {
      output: 'dist-electron'
    },
    files: [
      'dist/**/*',
      'electron/**/*',
      'build/**/*',
      'package.json'
    ],
    win: {
      target: ['dir', 'portable'],
      icon: 'build/icon.ico'
    }
  }
})
.then((result) => {
  console.log('Portable build completed successfully!');
  console.log('Output artifacts:', result);
})
.catch((err) => {
  console.error('Portable build note:', err.message);
});
