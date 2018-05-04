const debug = require('debug');
const { Menu } = require('electron');

const logger = debug('headset:tray');

const executeMediaKey = (win, key) => {
  logger('Executing %o command from tray', key);
  win.webContents.executeJavaScript(`
    window.electronConnector.emit('${key}')
  `);
};

const executeLikeClick = (win) => {
  logger('Liking song');
  win.webContents.executeJavaScript(`
    window.likeClick()
  `);
};

module.exports = (tray, win, player) => {
  logger('Setting tray');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Minimize to tray',
      click: () => {
        logger('Minimizing to tray');
        win.isVisible() ? win.hide() : win.show();
        player.isVisible() ? player.hide() : player.show();
      },
    },
    { type: 'separator' },
    { label: 'Play/Pause', click: () => { executeMediaKey(win, 'play-pause'); } },
    { label: 'Next', click: () => { executeMediaKey(win, 'play-next'); } },
    { label: 'Previous', click: () => { executeMediaKey(win, 'play-previous'); } },
    { type: 'separator' },
    { label: 'Like', click: () => { executeLikeClick(win); } },
    { type: 'separator' },
    { role: 'quit' },
  ]);

  tray.setToolTip('Headset');
  tray.setContextMenu(contextMenu);
};
