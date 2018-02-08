/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const php = require('gulp-connect-php');

const phpServer = new php();

require('electron-debug')({ showDevTools: false });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });

  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
  } = require('electron-devtools-installer');

  installExtension(REACT_DEVELOPER_TOOLS)
    // eslint-disable-next-line no-console
    .then(name => console.log(`Added Extension:  ${name}`))
    // eslint-disable-next-line no-console
    .catch(err => console.log('An error occurred: ', err));

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '../html/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;

    phpServer.closeServer();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// php ruleZ

phpServer.server({
  port: 8105,
  base: path.resolve(__dirname) + '/../../webserver',
});
