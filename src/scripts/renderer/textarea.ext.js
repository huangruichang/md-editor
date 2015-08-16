var TextareaBuilder = function ($textarea) {
	var editable = {
		getCaretPosition: function () {
			return this.selectionStart;
		},
		setCaretPosition: function (position) {
			this.selectionStart = position;
			this.selectionEnd = position;
			this.focus();
		},
		hasSelection: function () {
			return this.selectionStart !== this.selectionEnd;
		},
		setSelection: function (start, end) {
			this.selectionStart = start;
			this.selectionEnd = end;
			this.focus();
		},
		insertContent: function (content, fn) {
			var newCaretPosition = this.getCaretPosition() + content.length;
			this.value = this.value || "";
			this.value = this.value.substring(0, this.getCaretPosition()) + content + this.value.substring(this.getCaretPosition(), this.value.length);
			this.setCaretPosition(newCaretPosition);
			if (fn) {
				fn(this);
			}
		},
		removeContent: function (content, fn) {
			var newCaretPosition = this.getCaretPosition() - content.length;
			this.value = this.value || "";
			var pre = this.value.substring(0, this.getCaretPosition() - content.length);
			var next = this.value.substring(this.getCaretPosition(), this.value.length);
			this.value = pre + next;
			this.setCaretPosition(newCaretPosition);
			if (fn) {
				fn(this);
			}
		},
		setContent: function (content, fn) {
			this.value = content;
			this.setCaretPosition(content.length);
			this.setCaretPosition(content.length);
			if (fn) {
				fn(this);
			}
		}
	};
	$.extend($textarea.__proto__, editable);
}

