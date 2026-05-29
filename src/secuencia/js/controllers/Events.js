export function bindEvents(_p5) {
  _p5.mousePressed = function(event) {
    if (!document.getElementById('app-secuencia').classList.contains('active')) return;
    if (_p5.mouseButton == "right" || event.ctrlKey) {
      if (_p5.env.glyphEditor.isHovered == true) {
        _p5.env.glyphEditor.handleRightClick();
      }
    }
  };

  _p5.mouseDragged = function() {
    if (!document.getElementById('app-secuencia').classList.contains('active')) return;
    _p5.env.glyphEditor.handleDrag();
  };

  _p5.mouseReleased = function() {
    if (!document.getElementById('app-secuencia').classList.contains('active')) return;
  };

  // --- TOUCH HANDLERS ---
  _p5.touchStarted = function() {
    if (!document.getElementById('app-secuencia').classList.contains('active')) return;
    _p5.mousePressed();
    if (_p5.mouseX >= 0 && _p5.mouseX <= _p5.width && _p5.mouseY >= 0 && _p5.mouseY <= _p5.height) return false;
  };

  _p5.touchMoved = function() {
    if (!document.getElementById('app-secuencia').classList.contains('active')) return;
    _p5.mouseDragged();
    if (_p5.mouseX >= 0 && _p5.mouseX <= _p5.width && _p5.mouseY >= 0 && _p5.mouseY <= _p5.height) return false;
  };

  _p5.touchEnded = function() {
    if (!document.getElementById('app-secuencia').classList.contains('active')) return;
    _p5.mouseReleased();
    if (_p5.mouseX >= 0 && _p5.mouseX <= _p5.width && _p5.mouseY >= 0 && _p5.mouseY <= _p5.height) return false;
  };

  _p5.mouseClicked = function(event) {
    if (!document.getElementById('app-secuencia').classList.contains('active')) return;
    if (_p5.env.glyphEditor.isHovered == true && event.ctrlKey == false) {
      _p5.env.glyphEditor.handleClick();
    }
  };

  _p5.doubleClicked = function() {
    if (!document.getElementById('app-secuencia').classList.contains('active')) return;
    if (_p5.env.glyphEditor.isHovered == true) {
      _p5.env.glyphEditor.handleDoubleClick();
    }
  };

  _p5.keyPressed = function() {
    if (!document.getElementById('app-secuencia').classList.contains('active')) return;
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }

    if (_p5.key == 'Alt') {
      if (_p5.env.glyphEditor) _p5.env.glyphEditor.handleAlt('pressed');
    }

    // Vector editing mode keyboard hotkeys
    if (_p5.key === 'v' || _p5.key === 'V') {
      _p5.env.switchMode('editPath');
    } else if (_p5.key === 'a' || _p5.key === 'A') {
      _p5.env.switchMode('editAnchor');
    } else if (_p5.key === 'h' || _p5.key === 'H') {
      _p5.env.switchMode('editHandle');
    } else if (_p5.key === 'p' || _p5.key === 'P') {
      _p5.env.switchMode('drawPath');
    }
  };

  _p5.keyReleased = function() {
    if (!document.getElementById('app-secuencia').classList.contains('active')) return;
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }

    if (_p5.key == 'Backspace') {
      if (_p5.env.glyphEditor) _p5.env.glyphEditor.handleDelete();
    } else if (_p5.key == 'Escape') {
      if (_p5.env.glyphEditor) _p5.env.glyphEditor.handleEscape();
    } else if (_p5.key == 'Alt') {
      if (_p5.env.glyphEditor) _p5.env.glyphEditor.handleAlt('released');
    } else if ((_p5.key === 'z' || _p5.key === 'Z') && _p5.keyIsDown(_p5.CONTROL)) {
      _p5.env.glyphEditor.handleCmdZ();
    }
  };

  // Handle global document keydown for specific cases
  document.addEventListener('keydown', (event) => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }

    // Cmd+Z or Ctrl+Z for undo
    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      event.preventDefault(); // Prevent browser undo
      if (_p5.env.glyphEditor) {
        _p5.env.glyphEditor.handleCmdZ();
      }
    }
  });
}
