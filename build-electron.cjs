process.noAsar = true;

const builder = require('electron-builder');
const Platform = builder.Platform;

console.log('Building Native Windows Desktop Application & Installer...');

builder.build({
  targets: Platform.WINDOWS.createTarget(['dir', 'nsis', 'portable']),
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
      target: ['dir', 'nsis', 'portable'],
      icon: 'build/icon.ico'
    },
    nsis: {
      oneClick: false,
      perMachine: false,
      allowToChangeInstallationDirectory: true,
      shortcutName: 'Word Hunt',
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      installerIcon: 'build/icon.ico',
      uninstallerIcon: 'build/icon.ico'
    }
  }
})
.then((result) => {
  console.log('Native Windows Build completed successfully!');
  console.log('Output artifacts:', result);
})
.catch((err) => {
  console.error('Windows build error:', err.message);
});
