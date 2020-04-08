const Keyboard = {

  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    input: null,
  },

  selection: {
    start: null,
    end: null,
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    capsLock: false,
    shift: false,
    alt: false,
    ctrl: false
  },

  symbols: {

    keyLayoutEn: [
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "delete",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
      "shift_l", "\\", "z", "x", "c", "v", "b", "n", "m", ".", ",", "/", "▲", "shift_r",
      "control_l", "win", "alt_l", "space", "alt_r", "control_r", "◄", "▼", "►"
    ],
    keyLayoutRu: [
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\", "delete",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "shift_l", "\\", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "▲", "shift_r",
      "control_l", "win", "alt_l", "space", "alt_r", "control_r", "◄", "▼", "►"
    ],
    specialSymbolsRu: {
      "`": "~",
      "1": "!",
      "2": "\"",
      "3": "№",
      "4": ";",
      "5": "%",
      "6": ":",
      "7": "?",
      "8": "*",
      "9": "(",
      "0": ")",
      "-": "_",
      "=": "+",
      "\\": "/",
      ".": ",",
    },
    specialSymbolsEn: {
      "`": "~",
      "1": "!",
      "2": "@",
      "3": "#",
      "4": "$",
      "5": "%",
      "6": "^",
      "7": "&",
      "8": "*",
      "9": "(",
      "0": ")",
      "-": "_",
      "=": "+",
      "[": "{",
      "]": "}",
      "\\": "|",
      ";": ":",
      "'": "\"",
      ",": "<",
      ".": ">",
      "/": "?",
    }
  },

  setCursor(position) {
    this.elements.input.focus();
    this.elements.input.selectionStart = position;
    this.elements.input.selectionEnd = position;
  },

  _createElementsHtml() {
    const paragraph = document.createElement("p");
    paragraph.textContent = "Написано в ОС Windows.";

    this.elements.input = document.createElement("textarea");
    this.elements.input.classList.add("use-keyboard-input");

    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");
    this.elements.main.classList.add("keyboard");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(paragraph);
    document.body.appendChild(this.elements.input);
    document.body.appendChild(this.elements.main);
  },

  init() {
    this._createElementsHtml();
    this.elements.input.focus();
    addEventListener("keyup", function (e) {
      e.preventDefault();
      Keyboard._keyUpDownButton(e, true);
    });

    addEventListener("keydown", function (e) {
      e.preventDefault();
      Keyboard._keyUpDownButton(e, false);
    });
  },

  getSpecialSymbolsSet() {
    return localStorage.lang != null && localStorage.lang == "en" ? this.symbols.specialSymbolsEn : this.symbols.specialSymbolsRu;
  },

  getLanguageAfterLoadPage() {
    const langUserInterface = (navigator.language || navigator.systemLanguage || navigator.userLanguage).substr(0, 2).toLowerCase();
    return localStorage.lang != null ? localStorage.lang : langUserInterface;
  },

  setSelection() {
    this.selection.start = this.elements.input.selectionStart;
    this.selection.end = this.elements.input.selectionEnd;
  },

  changeLanguage() {
    localStorage.lang = localStorage.lang != null && localStorage.lang == "en" ? "ru" : "en";
    return localStorage.lang;
  },

  isSimple(key) {
    return (key.length === 1)
  },

  _findSpecialButton(key, isKeyUp, e) {
    switch (key) {
      case "ArrowUp":
        this._toggleElemByContent("▲", isKeyUp);
        break;

      case "ArrowDown":
        this._toggleElemByContent("▼", isKeyUp);
        break;

      case "ArrowLeft":
        this._toggleElemByContent("◄", isKeyUp);
        break;

      case "ArrowRight":
        this._toggleElemByContent("►", isKeyUp);
        break;
      case "Tab":
        this._toggleElemByContent("Tab", isKeyUp, true);
        e.preventDefault();
        break;

      case "ShiftLeft":
      case "ShiftRight":
        this._toggleShift(key);
        break;

      case "CapsLock":
        if (!isKeyUp) this._toggleCapsLock();
        break;
      case "ControlLeft":
      case "ControlRight":
        this._toggleCtrl(key, !isKeyUp);
        break;
      case "AltLeft":
      case "AltRight":
        this._toggleAlt(key);
        break;
      default:
        return false;
    }
    return true;
  },

  _keyUpDownButton(e, isKeyUp) {
    if (!this._findSpecialButton(e.code, isKeyUp, e)) {
      this._toggleElemByContent(e.key, isKeyUp, true);
    }
  },

  _createMouseUpAndDownEvents(keyElement, key) {
    keyElement.addEventListener("mousedown", () => {
      this._findSpecialButton(key, false);
    });

    keyElement.addEventListener("mouseup", () => {
      this._findSpecialButton(key, true);
    });

  },

  _insertSymbolInSelection(symbol) {
    this.setSelection();
    this.elements.input.value = `${this.elements.input.value.slice(0, this.selection.start)}${symbol}${this.elements.input.value.slice(this.selection.end)}`;
    this.setCursor(this.selection.start + 1);
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();

    let keyLayout = Keyboard.getLanguageAfterLoadPage() == "ru" ? Keyboard.symbols.keyLayoutRu : Keyboard.symbols.keyLayoutEn;

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "delete", "enter", "shift_r", "?"].indexOf(key) !== -1;

      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = 'Backspace';

          keyElement.addEventListener("click", () => {
            this.setSelection();
            if (this.selection.start !== this.selection.end) {
              this.elements.input.value = `${this.elements.input.value.slice(0, this.selection.start)}${this.elements.input.value.slice(this.selection.end)}`;
            } else if (this.selection.start !== 0) {
              this.elements.input.value = `${this.elements.input.value.slice(0, this.selection.start - 1)}${this.elements.input.value.slice(this.selection.start)}`;
              --this.selection.start;
            }
            this.setCursor(this.selection.start);
          });

          break;

        case "delete":
          keyElement.innerHTML = 'Delete';
          keyElement.addEventListener("click", () => {
            this.setSelection();
            if (this.selection.start !== this.selection.end) {
              this.elements.input.value = `${this.elements.input.value.slice(0, this.selection.start)}${this.elements.input.value.slice(this.selection.end)}`;
            } else if (this.selection.end !== this.elements.input.value.length) {
              this.elements.input.value = `${this.elements.input.value.slice(0, this.selection.start)}${this.elements.input.value.slice(this.selection.start + 1)}`;
            }
            this.setCursor(this.selection.start);
          });
          break;

        case "tab":
          keyElement.innerHTML = 'Tab';
          keyElement.addEventListener("click", () => {
            this._insertSymbolInSelection("\t");
          });
          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = 'ENTER';

          keyElement.addEventListener("click", () => {
            this._insertSymbolInSelection("\n");
          });
          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = "Space";

          keyElement.addEventListener("click", () => {
            this._insertSymbolInSelection(" ");
          });
          break;

        case "win":
          keyElement.innerHTML = 'Win';
          keyElement.addEventListener("click", () => {
            alert('System button');
          });
          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "activatable__key");
          keyElement.innerHTML = 'Caps Lock';

          keyElement.addEventListener("click", () => {
            this._findSpecialButton("CapsLock");
          });
          break;

        case "shift_l":
          keyElement.classList.add("ShiftLeft");
          keyElement.innerHTML = 'Shift';
          this._createMouseUpAndDownEvents(keyElement, "ShiftLeft");
          break;

        case "shift_r":
          keyElement.classList.add("ShiftRight");
          keyElement.innerHTML = 'Shift';
          this._createMouseUpAndDownEvents(keyElement, "ShiftRight");
          break;

        case "alt_l":
          keyElement.classList.add("AltLeft");
          keyElement.innerHTML = 'Alt';
          this._createMouseUpAndDownEvents(keyElement, "AltLeft");
          break;
        case "alt_r":
          keyElement.classList.add("AltRight");
          keyElement.innerHTML = 'Alt';
          this._createMouseUpAndDownEvents(keyElement, "AltRight");
          break;

        case "control_l":
          keyElement.classList.add("ControlLeft");
          keyElement.innerHTML = 'Ctrl';
          this._createMouseUpAndDownEvents(keyElement, "ControlLeft");
          break;
        case "control_r":
          keyElement.classList.add("ControlRight");
          keyElement.innerHTML = 'Ctrl';
          this._createMouseUpAndDownEvents(keyElement, "ControlRight");
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.setAttribute("defaultKey", true);

          this._addSpecialKeysAttribute(keyElement, key);

          keyElement.addEventListener("click", () => {
            const currentLetter = keyElement.getAttribute("keyWithShift") && this.properties.shift ? Keyboard.getSpecialSymbolsSet()[key] :
              (this.properties.capsLock && !this.properties.shift) || (!this.properties.capsLock && this.properties.shift) ?
              key.toUpperCase() : key.toLowerCase();
            this.setSelection();
            this.elements.input.value = `${this.elements.input.value.slice(0, this.selection.start)}${currentLetter}${this.elements.input.value.slice(this.selection.end)}`;
            this.setCursor(this.selection.start + 1);
          });
          break;
      }

      fragment.appendChild(keyElement);
      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });
    return fragment;
  },

  _addSpecialKeysAttribute(keyElement, key) {
    if (Keyboard.getSpecialSymbolsSet()[key]) {
      keyElement.setAttribute("keyWithoutShift", key);
      keyElement.setAttribute("keyWithShift", Keyboard.getSpecialSymbolsSet()[key]);
    }
  },
  __setButtonUpperCase(shift) {
    for (const key of this.elements.keys) {
      let currentSymbol = key.getAttribute("keyWithShift") ?
        (shift ? key.getAttribute("keyWithShift") : key.getAttribute("keyWithoutShift")) : key.textContent;

      if (key.childElementCount === 0 && Keyboard.isSimple(key.textContent)) {
        key.textContent = (this.properties.capsLock && !this.properties.shift) || (!this.properties.capsLock && this.properties.shift) ?
          currentSymbol.toUpperCase() : currentSymbol.toLowerCase();
      }

    }
  },

  __setButtonLanguage(lang) {
    let keyLayout = lang == "ru" ? Keyboard.symbols.keyLayoutRu : Keyboard.symbols.keyLayoutEn;
    let i = 0;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && Keyboard.isSimple(key.textContent)) {
        key.textContent = (this.properties.capsLock && !this.properties.shift) || (!this.properties.capsLock && this.properties.shift) ? keyLayout[i].toUpperCase() : keyLayout[i].toLowerCase();
      }
      i++;
    }
    Keyboard.changeSpecialSymbolsAttributes();
  },

  changeSpecialSymbolsAttributes() {
    for (const key of this.elements.keys) {
      if (key.getAttribute("keyWithShift")) {
        Keyboard._addSpecialKeysAttribute(key, key.textContent)
      }
    }
  },
  _toggleElemByContent(key, isKeyUp, isClick) {
    let elem = Array.from(document.querySelectorAll('button')).filter(el =>
      (Keyboard.getSpecialSymbolsSet()[key] == el.textContent.toLowerCase() && this.properties.shift) || el.textContent.toLowerCase() == key.toLowerCase())[0];
    if (elem != null) {
      if (isKeyUp) {
        if (isClick || this.properties.shift) elem.click();
        elem.classList.remove("active-key");
      } else
        elem.classList.add("active-key");
    }

  },
  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    this.__setButtonUpperCase();
    document.querySelector(".activatable__key").classList.toggle("activatable__key--active", this.properties.capsLock);
  },

  _toggleShift(code) {
    this.properties.shift = !this.properties.shift;
    this.__setButtonUpperCase(this.properties.shift);
    if (this.properties.shift && this.properties.alt) {
      this.__setButtonLanguage(this.changeLanguage());
    }
    document.querySelector("." + code).classList.toggle("active-key", this.properties.shift);
  },

  _toggleAlt(code) {
    this.properties.alt = !this.properties.alt;
    if (this.properties.shift && this.properties.alt) {
      this.__setButtonLanguage(this.changeLanguage());
    }
    document.querySelector("." + code).classList.toggle("active-key", this.properties.alt);
  },

  _toggleCtrl(code, addClass) {
    this.properties.ctrl = !this.properties.ctrl;
    if (addClass)
      document.querySelector("." + code).classList.add("active-key");
    else document.querySelector("." + code).classList.remove("active-key");


  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.elements.input.value);
    }
  },
  open(initialValue, oninput, onclose) {
    this.elements.input.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
  },
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});