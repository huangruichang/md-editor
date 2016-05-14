$(document).ready(function () {

	var editor = $('.pagedown-editor textarea');

	var setting = {
        strings: {
            bold: "粗体 <strong> Ctrl+B",
            boldexample: "在此输入文字",

            italic: "斜体 <em> Ctrl+I",
            italicexample: "在此输入文字",

            link: "链接 <a> Ctrl+L",
            linkdescription: "在此输入链接内容",
            linkdialog: "<h2>插入链接</h2>",

            quote: "引用 <blockquote> Ctrl+Q",
            quoteexample: "这里输入引用文字",

            code: "代码片段 <pre><code> Ctrl+K",
            codeexample: "在此输入代码片段",

            image: "图片 <img> Ctrl+G",
            imagedescription: "在这里输入图片描述",
            imagedialog: "<h2>插入图片</h2>",

            olist: "数字列表 <ol> Ctrl+O",
            ulist: "符号列表 <ul> Ctrl+U",
            litem: "列表项",

            heading: "标题 <h1>/<h2> Ctrl+H",
            headingexample: "这里输入标题",

            hr: "水平分割线 <hr> Ctrl+R",

            undo: "撤销 - Ctrl+Z",
            redo: "重做 - Ctrl+Y",
            redomac: "重做 - Ctrl+Shift+Z",

            help: "需要帮助"
        }
    };

    var doPreview = _.throttle(function () {
        var $preview = $('#pagedown-preview');
        var $textarea = $('#wmd-input');
        $preview.html(marked($textarea.val(), {renderer: renderer, breaks: true}));
    }, 1000);

    //init preview area
    doPreview();

    var converter = Markdown.getSanitizingConverter();

    converter.hooks.chain('preConversion', function (text) {
        doPreview(text);
        return '';
    });

    converter.hooks.chain('postConversion', function (text) {
        var $preview = $('#pagedodwn-preview');
        return $preview.html();
    });

    Markdown.Extra.init(converter);

	var wmd_editor = new Markdown.Editor(converter, '', setting);

	wmd_editor.run();

    wmd_editor.hooks.chain('onChange', function () {
        doPreview();
    });

	editor.map(function (i, textarea) {
		TextareaBuilder(textarea);
	});

    $(window).on('keydown', function () {
        if (event.keyCode == 27) {
            closeHelpModal();
        }
    });

	//enable tab
	editor.on('keydown', function (event) {
		if (event.keyCode == 9) {
            if (!event.shiftKey) {
                var textarea = editor[0].insertContent("    ");
                event.preventDefault && event.preventDefault();
                return false;
            } else {
                var content = $(editor[0]).val().substring(0, editor[0].getCaretPosition());
                if (content.lastIndexOf("    ") === content.length - 4) {
                    editor[0].removeContent("    ");
                }
                event.preventDefault && event.preventDefault();
                return false;
            }
		}
        if (event.keyCode == 83) {
            if (event.ctrlKey || event.metaKey) {
                saveFile(file_path, $('#wmd-input').val());
            }
        }
	});

    //help button
    $('.fa.fa-question-circle').on('click', function () {
        toggleHelpModal();
    });

    $('.pagedown-help-modal').on('click', function (event) {
        if ($(event.target).is('.pagedown-help-modal.content') || $(event.target).parents('.pagedown-help-modal').length > 0) {
            return;
        }
        closeHelpModal();
    });

    $('#wmd-input').on('change keydown', function () {
        doPreview();
    });

    var closeHelpModal = function () {
        $('#pagedown-help-modal').fadeOut(200);
    };

    var toggleHelpModal = function () {
        var $helpModal = $('#pagedown-help-modal');
        var hidden = $helpModal.css('display') && $helpModal.css('display') === 'none';
        if (hidden) {
            $helpModal.fadeIn(200);
        } else {
            $helpModal.fadeOut(200);
        }
    };


    var replaceButtons = function (id) {
        var row = $('#wmd-button-row' + id);
        var bar = $("#wmd-button-bar" + id);
        var buttons = bar.find('.wmd-button');

        var btn_regex = new RegExp('wmd\\-(.*)\\-button' + (id ? '\\' + id : ''));

        var replace_ids = {
            'redo': 'fa fa-rotate-right',
            'undo': 'fa fa-rotate-left',
            'link': 'fa fa-link',
            'quote': 'fa fa-quote-left',
            'image': 'fa fa-picture-o',
            'olist': 'fa fa-list-ol',
            'ulist': 'fa fa-list',
            'hr': 'fa fa-ellipsis-h',
            'bold': 'fa fa-bold',
            'italic': 'fa fa-italic'
        };

        buttons.each(function (i, button) {
            var self = $(button);
            var id = self.attr('id').replace("-" + id, '');
            id = id.match(btn_regex);
            if (id && id.length == 2) {
                id = id[1];
            }
            id = replace_ids[id] || id;
            var icon = '<i class="' + id + ' icon"></i>';
            self.find('span').hide();
            self.append(icon);
        });

        return bar;
    };

    var bar = replaceButtons("");

    var togglePreview = function () {
        var $preview = $('#pagedown-preview');
        var $textarea = $('#wmd-input');
        if ($preview) {
            if ($preview.hasClass('show')) {
                $preview.removeClass('show');
                if ($textarea && $textarea.hasClass && $textarea.hasClass('preview-show')) {
                    $textarea.removeClass('preview-show');
                }
            } else {
                $preview.addClass('show');
                if ($textarea && $textarea.hasClass && !$textarea.hasClass('preview-show')) {
                    $textarea.addClass('preview-show');
                }
            }
        }
        
    };

    //preview button
    var $open_preview_button = $('.wmd-panel .pagedown-editor .extend-wmd-button.open-preview-button');
    var $close_preview_button = $('.wmd-panel .pagedown-editor .extend-wmd-button.close-preview-button');

    $open_preview_button.on('click', function () {
        wmd_editor.refreshPreview();
        togglePreview();
        $open_preview_button.hide();
        $close_preview_button.show();
    });

    $close_preview_button.on('click', function () {
        togglePreview();
        $open_preview_button.show();
        $close_preview_button.hide();
    });

    //preview mode button
    var $expand_mode_button = $('.wmd-panel .pagedown-editor .extend-wmd-button.expand-mode-button');
    var $compress_mode_button = $('.wmd-panel .pagedown-editor .extend-wmd-button.compress-mode-button');

    $expand_mode_button.on('click', function () {
        $expand_mode_button.hide();
        $compress_mode_button.show();
        var $textarea = $('#wmd-input');
        var $preview = $('#pagedown-preview');
        if ($textarea && $textarea.hasClass && !$textarea.hasClass('expand')) {
            $textarea.addClass('expand');
        }
        if ($preview && $preview.hasClass && !$preview.hasClass('expand')) {
            $preview.addClass('expand');
        }
    });

    $compress_mode_button.on('click', function () {
        $expand_mode_button.show();
        $compress_mode_button.hide();
        var $textarea = $('#wmd-input');
        var $preview = $('#pagedown-preview');
        if ($textarea && $textarea.hasClass && $textarea.hasClass('expand')) {
            $textarea.removeClass('expand');
        }
        if ($preview && $preview.hasClass && $preview.hasClass('expand')) {
            $preview.removeClass('expand');
        }
    });

    //synchronize scroll
    autoScroll(editor, $('#pagedown-preview'));
});
