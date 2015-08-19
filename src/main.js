var app = require('app'); 
var BrowserWindow = require('browser-window');  
var ipc = require('ipc');
var dialog = require('dialog');
var fs = require('fs');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
  	"width": 1280,
  	"height": 800,
  	"center": true
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipc.on('md.file.open', function (event, arg) {
  openFile(event, arg);
});

ipc.on('md.file.create', function (event, arg) {
  newFile(event, arg);
});

ipc.on('md.file.save', function (event, arg) {
  saveFile(event, arg);
});

ipc.on('md.app.exit', function (event, arg) {
  app.quit();
});

var filters = [
    {
      name: 'Markdown',
      extensions: ['md']
    }
];

var openFile = function (event, arg) {
  var filePath = '';
  if (arg) {
    filePath = arg;
  } else {
    filePath = dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
      properties: ['openFile'],
      filters
    });
  }
  if (filePath) {
    if (!(filePath instanceof Array)) {
      filePath = [filePath];
    }
    fs.readFile(filePath[0], function (err, data) {
      if (err) throw err;
      var result = {
        filePath: filePath[0],
        data: data ? data.toString() : ''
      };
      event.sender.send('md.file.read.finish', '', result);
    });
  }
};

var newFile = function (event, arg) {
  var filePath = dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
    filters
  });
  if (filePath) {
      var content = arg || '';
      fs.writeFile(filePath, content, function (err, data) {
        if (err) throw err;
        event.sender.send('md.file.create.success', '', filePath);
      });
  }
};

var saveFile = function (event, data) {
  if (!data) return;
  if (data.file_path) {
    var file_path = data.file_path;
    var content = data.content ? data.content : '';
    fs.writeFile(file_path, content, function (err, data) {
      if (err) {
        dialog.showErrorBox('save failed! :(');
      }
    });
  } else {
    newFile(event, data.content);
  }
};