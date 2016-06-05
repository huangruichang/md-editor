var electron = require('electron');
var remote = electron.remote;
var ipc = electron.ipcRenderer;
var BrowserWindow = remote.BrowserWindow;
window.$ = window.jQuery = require('./bower_components/jquery/dist/jquery.js');

var $ = window.$;

var openHelpModal = function () {
  $('#pagedown-help-modal').fadeIn(200);
};

var newFile = function () {
  ipc.send('md.file.create');
};

var openFile = function (target) {
  ipc.send('md.file.open', target);
};

var createMarkPPT = function () {
  ipc.send('md.markppt.create');
};

var saveFile = function (file_path, content) {
  var data = {
    file_path: file_path,
    content: content
  };
  ipc.send('md.file.save', data);
};

var newWindow = function (path) {
  var win = new BrowserWindow({
    "width": 1280,
    "height": 720,
    "center": true
  });
  var url = 'file://../' + __dirname + '/index.html' + (path ? '?filePath=' + path : '');
  win.loadUrl(url);
};

var closeWindow = function () {
  remote.getCurrentWindow().close();
};

ipc.on('md.file.read.finish', function (event, result) {
  console.log(result)
  $('#wmd-input').val(result.data);
  file_path = result.filePath;
  content = result.data;
  var $preview = $('#pagedown-preview');
  $preview.html(marked(result.data, {renderer: renderer}));
  var title = file_path;
  remote.getCurrentWindow().setTitle(title);
});

ipc.on('md.file.create.success', function (event, filePath) {
  if (file_path) {
    if (file_path === filePath) {
      openFile(filePath);
    } else {
      newWindow(filePath);
    }
  } else {
    openFile(filePath);
  }
});

ipc.on('menu.newFile.do', function () {
  newFile();
});

ipc.on('menu.openFile.do', function () {
  openFile();
});

ipc.on('menu.saveFile.do', function () {
  saveFile(file_path, $('#wmd-input').val());
});

ipc.on('menu.newWindow.do', function () {
  newWindow();
});

ipc.on('menu.closeWindow.do', function () {
  closeWindow();
});

ipc.on('menu.openHelpModal.do', function () {
  openHelpModal();
});

ipc.on('menu.redo.do', function () {
  document.execCommand('redo');
});

ipc.on('menu.undo.do', function () {
  document.execCommand('undo');
});

ipc.on('menu.cut.do', function () {
  document.execCommand('cut');
});

ipc.on('menu.copy.do', function () {
  document.execCommand('copy');
});

ipc.on('menu.paste.do', function () {
  document.execCommand('paste');
});

ipc.on('menu.selectAll.do', function () {
  document.execCommand('selectAll');
});

ipc.on('menu.createMarkPPT.do', function (event, filePath) {
  createMarkPPT();
});

// read md if filePath passed.
var url = window.location.href;
if (url.indexOf('?') > 0) {
  var index = url.indexOf('filePath=');
  var target = url.substring(index + 9, url.length);
  openFile(decodeURIComponent(target));
}
