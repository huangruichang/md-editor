var autoScroll = function (editor, preview) {
    editor
        .on('scroll', function () {
            if (editor.is('.hovered')) {
                preview.stop().animate({
                    scrollTop: preview[0].scrollHeight * (editor[0].scrollTop / editor[0].scrollHeight)
                });
            }
        })
        .on('mouseenter', function () {
            editor.addClass('hovered');
        })
        .on('mouseleave', function () {
            editor.removeClass('hovered');
        });

    preview
        .on('scroll', function () {
            if (preview.is('.hovered')) {
                editor.stop().animate({
                    scrollTop: editor[0].scrollHeight * (preview[0].scrollTop / preview[0].scrollHeight)
                });
            }
        })
        .on('mouseenter', function () {
            preview.addClass('hovered');
        })
        .on('mouseleave', function () {
            preview.removeClass('hovered');
        });
};