(function ($) {

    "use strict";
    $.fn.transitionEnd = function (callback) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, dom = this;

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };

})($);


/* *
 * 对话框
 * */
+
function ($) {
    var defaults;

    $.modal = function (params, onOpen) {
        params = $.extend({}, defaults, params);


        var buttons = params.buttons;

        var buttonsHtml = buttons.map(function (d, i) {
            return '<button type="button" class="btn dialog_btn ' + (d.className || "") + '">' + d.text + '</button>';
        }).join("");

        var tpl = '<div class="dialog_box">' +
            '<div class="dialog_header"><h3>' + params.title + '</h3></div>' +
            (params.text ? '<div class="dialog_content"><p>' + params.text + '</p></div>' : '') +
            '<div class="dialog_footer">' + buttonsHtml + '</div>' +
            '</div>';

        var dialog = $.openModal(tpl, onOpen);

        dialog.find(".dialog_btn").each(function (i, e) {
            var el = $(e);
            el.click(function () {
                //先关闭对话框，再调用回调函数
                if (params.autoClose) $.closeModal();

                if (buttons[i].onClick) {
                    buttons[i].onClick.call(dialog);
                }
            });
        });

        return dialog;
    };

    $.openModal = function (tpl, onOpen) {
        var mask = $("<div class='dialog_mask'></div>").appendTo(document.body);
        mask.show();

        var dialog = $(tpl).appendTo(document.body);

        if (onOpen) {
            dialog.transitionEnd(function () {
                onOpen.call(dialog);
            });
        }

        dialog.show();
        mask.addClass("dialog_mask_visible");
        dialog.addClass("dialog_box_visible");

        return dialog;
    }

    $.closeModal = function () {
        $(".dialog_mask_visible").removeClass("dialog_mask_visible").transitionEnd(function () {
            $(this).remove();
        });
        $(".dialog_box_visible").removeClass("dialog_box_visible").transitionEnd(function () {
            $(this).remove();
        });
    };

    $.confirm = function (text, title, onOK, onCancel) {
        var config;
        if (typeof text === 'object') {
            config = text
        } else {
            if (typeof title === 'function') {
                onCancel = arguments[2];
                onOK = arguments[1];
                title = undefined;
            }

            config = {
                text: text,
                title: title,
                onOK: onOK,
                onCancel: onCancel
            }
        }
        return $.modal({
            text: config.text,
            title: config.title,
            buttons: [
                {
                    text: defaults.buttonCancel,
                    className: "btn-white",
                    onClick: config.onCancel
                },
                {
                    text: defaults.buttonOK,
                    className: "btn-primary",
                    onClick: config.onOK
      }]
        });
    };

    defaults = $.modal.prototype.defaults = {
        title: "提示",
        text: undefined,
        buttonOK: "确定",
        buttonCancel: "取消",
        buttons: [{
            text: "确定",
            className: "btn-primary"
    }],
        autoClose: true //点击按钮自动关闭对话框，如果你不希望点击按钮就关闭对话框，可以把这个设置为false
    };
}($);


/* *
 * 消息框
 * */
+
function ($) {
    var defaults;

    var show = function (html, className) {

        className = className || "";
        var tpl = '<div class=" toast ' + className + '">' + html + '</div>';
        var dialog = $(tpl).appendTo(document.body);

        dialog.show();
        dialog.addClass("toast_visible");
    };

    var hide = function (callback) {
        $(".toast_visible").removeClass("toast_visible").transitionEnd(function () {
            var $this = $(this);
            $this.remove();
            callback && callback($this);
        });
    }

    $.toast = function (style, text, callback) {
        if (typeof style === "function") {
            callback = style;
        }
        var className;
        if (style == "success") {
            className = "toast_success";
        } else if (style == "error") {
            className = "toast_error";
        }
        show('<i class="icon icon_toast"></i><p class="toast_content">' + (text || "已经完成") + '</p>', className);

        setTimeout(function () {
            hide(callback);
        }, toastDefaults.duration);
    }

    var toastDefaults = $.toast.prototype.defaults = {
        duration: 2000
    }

}($);

/* *
 * 加载框
 * */
+
function ($) {
    var defaults;

    var show = function (html, target) {

        var tpl = '<div class="loading_mask">' + html + '</div>';
        var dialog = $(tpl).insertAfter(target);

        dialog.show();
        dialog.addClass("loading_visible");
    };

    var hide = function (callback) {
        $(".loading_visible").removeClass("loading_visible").transitionEnd(function () {
            var $this = $(this);
            $this.remove();
            callback && callback($this);
        });
    }

    $.loading = function (text, target, callback) {
        show('<div class="loading_box"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><p>' + (text || "加载中") + '</p></div>', target);

        setTimeout(function () {
            hide(callback);
        }, toastDefaults.duration);
    }

    var toastDefaults = $.toast.prototype.defaults = {
        duration: 2000
    }

}($);