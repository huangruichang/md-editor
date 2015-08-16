var remote = require('remote');
var Menu = remote.require('menu');
var ipc = require('ipc');
var BrowserWindow = remote.require('browser-window');

var file_path = '';

var template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New File',
        click: function () {
          newFile();
        }
      },
      {
        label: 'Open File',
        click: function () {
          openFile();
        }
      },
      {
        label: 'Save',
        click: function () {
          saveFile(file_path, $('#wmd-input').val());
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'New Window',
        click: function () {
          newWindow();
        }
      },
      {
        label: 'Close Window',
        click: function () {
          closeWindow();
        }
      },
      {
        type: 'separator'
      },{
        label: 'Exit',
        click: function () {
          exit();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        click: function () {
          document.execCommand('undo');
        }
      },
      {
        label: 'Redo',
        click: function () {
          document.execCommand('redo');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        click: function () {
          document.execCommand('cut');
        }
      },
      {
        label: 'Copy',
        click: function () {
          document.execCommand('copy');
        }
      },
      {
        label: 'Paste',
        click: function () {
          document.execCommand('paste');
        }
      },
      {
        label: 'Select All',
        click: function () {
          document.execCommand('selectAll');
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        click: function() { 
          remote.getCurrentWindow().reload(); 
        }
      },
      {
        label: 'Toggle DevTools',
        click: function() {
         remote.getCurrentWindow().toggleDevTools();
        }
      },
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Documentation',
        click: function () {
          openHelpModal();
        }
      }
    ]
  }
];

menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);

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
    "height": 800,
    "center": true
  });
  var url = 'file://../' + __dirname + '/index.html' + (path ? '?filePath=' + path : '');
  win.loadUrl(url);
};

var closeWindow = function () {
  remote.getCurrentWindow().close();
};

var exit = function () {
  ipc.send('md.app.exit');
};

ipc.on('md.file.read.finish', function (event, result) {
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
    newWindow(filePath);
  } else {
    openFile(filePath);
  }
});

// read md if filePath passed.
var url = window.location.href;
if (url.indexOf('?') > 0) {
  var index = url.indexOf('filePath=');
  var target = url.substring(index + 9, url.length);
  openFile(target);
}