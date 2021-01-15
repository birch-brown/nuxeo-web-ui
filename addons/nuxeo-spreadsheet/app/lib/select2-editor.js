/* eslint-disable max-len */
const Select2Editor = Handsontable.editors.TextEditor.prototype.extend();

const onEntryDelete = function(event) {
  const instance = this;
  const keyCodes = Handsontable.helper.keyCode;
  if (event.keyCode === keyCodes.BACKSPACE || event.keyCode === keyCodes.DELETE) {
    event.stopImmediatePropagation();
    // XXX - kind of overrides the empty function
    const selectedRange = instance.getSelectedRange();
    let topLeft = selectedRange.getTopLeftCorner();
    let bottomRight = selectedRange.getBottomRightCorner();
    let r;
      let c;
      let changes = [];
    for (r = topLeft.row; r <= bottomRight.row; r++) {
      for (c = topLeft.col; c <= bottomRight.col; c++) {
        if (!instance.getCellMeta(r, c).readOnly) {
          changes.push([r, c, null]);
        }
      }
    }
    instance.setDataAtCell(changes);
  }
};

Select2Editor.prototype.prepare = function(td, row, col, prop, value, cellProperties) {
  Handsontable.editors.TextEditor.prototype.prepare.apply(this, arguments);

  this.options = {};

  if (this.cellProperties.select2Options) {
    this.options = $.extend(this.options, cellProperties.select2Options);
  }
};

Select2Editor.prototype.createElements = function() {
  this.$body = $(document.body);
  this.wtDom = Handsontable.Dom;

  this.TEXTAREA = document.createElement('input');
  this.TEXTAREA.setAttribute('type', 'text');
  this.$textarea = $(this.TEXTAREA);

  this.wtDom.addClass(this.TEXTAREA, 'handsontableInput');

  this.textareaStyle = this.TEXTAREA.style;
  this.textareaStyle.width = 0;
  this.textareaStyle.height = 0;

  this.TEXTAREA_PARENT = document.createElement('DIV');
  this.wtDom.addClass(this.TEXTAREA_PARENT, 'handsontableInputHolder');

  this.textareaParentStyle = this.TEXTAREA_PARENT.style;
  this.textareaParentStyle.top = 0;
  this.textareaParentStyle.left = 0;
  this.textareaParentStyle.display = 'none';

  this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);

  this.instance.rootElement[0].appendChild(this.TEXTAREA_PARENT);

  const that = this;
  Handsontable.hooks.add('afterRender', () => {
    // TODO(nfgs) - was that.instance.registerTimeout
    that.instance._registerTimeout(
      'refresh_editor_dimensions',
      () => {
        that.refreshDimensions();
      },
      0,
    );
  });
  this.instance.addHook('beforeKeyDown', onEntryDelete);
};

const onSelect2Changed = function() {
  this.close();
  this.finishEditing();
};
const onSelect2Closed = function() {
  this.close();
  this.finishEditing();
};
const onBeforeKeyDown = function onBeforeKeyDown(event) {
  const instance = this;
  const that = instance.getActiveEditor();

  const keyCodes = Handsontable.helper.keyCode;
  const ctrlDown = (event.ctrlKey || event.metaKey) && !event.altKey; // catch CTRL but not right ALT (which in some systems triggers ALT+CTRL)

  // Process only events that have been fired in the editor
  if (event.target !== that.TEXTAREA || event.isImmediatePropagationStopped()) {
    return;
  }

  if (event.keyCode === 17 || event.keyCode === 224 || event.keyCode === 91 || event.keyCode === 93) {
    // when CTRL or its equivalent is pressed and cell is edited, don't prepare selectable text in textarea
    event.stopImmediatePropagation();
    return;
  }

  // eslint-disable-next-line default-case
  switch (event.keyCode) {
    case keyCodes.ENTER:
      const selected = that.instance.getSelected();
      const isMultipleSelection = !(selected[0] === selected[2] && selected[1] === selected[3]);
      if ((ctrlDown && !isMultipleSelection) || event.altKey) {
        // if ctrl+enter or alt+enter, add new line
        if (that.isOpened()) {
          that.val(`${that.val()}\n`);
          that.focus();
        } else {
          that.beginEditing(`${that.originalValue}\n`);
        }
        event.stopImmediatePropagation();
      }
      event.preventDefault(); // don't add newline to field
      break;

    case keyCodes.A:
    case keyCodes.X:
    case keyCodes.C:
    case keyCodes.V:
      if (ctrlDown) {
        event.stopImmediatePropagation(); // CTRL+A, CTRL+C, CTRL+V, CTRL+X should only work locally when cell is edited (not in table context)
        break;
      }
    case keyCodes.HOME:
    case keyCodes.END:
      event.stopImmediatePropagation(); // home, end should only work locally when cell is edited (not in table context)
      break;
  }
};

Select2Editor.prototype.open = function() {
  this.refreshDimensions();
  this.textareaParentStyle.display = 'block';
  this.instance.addHook('beforeKeyDown', onBeforeKeyDown);

  this.$textarea.css({
    height: $(this.TD).height(),
    'min-width': $(this.TD).outerWidth(),
  });

  // display the list
  this.$textarea.show();

  this.$textarea
    .select2(this.options)
    .on('change', onSelect2Changed.bind(this))
    .on('select2-close', onSelect2Closed.bind(this));
};

Select2Editor.prototype.close = function() {
  this.instance.listen();
  this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
  this.$textarea.off();
  this.$textarea.hide();
  Handsontable.editors.TextEditor.prototype.close.apply(this, arguments);
};

Select2Editor.prototype.val = function(value) {
  if (typeof value == 'undefined') {
    return this.$textarea.val();
  }
  this.$textarea.val(value);
};

Select2Editor.prototype.focus = function() {
  this.instance.listen();

  // DO NOT CALL THE BASE TEXTEDITOR FOCUS METHOD HERE, IT CAN MAKE THIS EDITOR BEHAVE POORLY AND HAS NO PURPOSE WITHIN THE CONTEXT OF THIS EDITOR
  // Handsontable.editors.TextEditor.prototype.focus.apply(this, arguments);
};

Select2Editor.prototype.beginEditing = function(...params) {
  const { onBeginEditing } = this.instance.getSettings();
  if (onBeginEditing && onBeginEditing() === false) {
    return;
  }

  Handsontable.editors.TextEditor.prototype.beginEditing.apply(this, params);
};

Select2Editor.prototype.finishEditing = function(...params) {
  this.instance.listen();
  return Handsontable.editors.TextEditor.prototype.finishEditing.apply(this, params);
};

Select2Editor.prototype.destroyElements = function() {
  this.instance.removeHook(onEntryDelete);
};

Handsontable.editors.Select2Editor = Select2Editor;
Handsontable.editors.registerEditor('select2', Select2Editor);
