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
    value: "",
    capsLock: false,
    shift: false,
    alt: false,
    ctrl: false,
  },


  setCursor(position) {
    this.elements.input.focus();
    this.elements.input.selectionStart = position;
    this.elements.input.selectionEnd = position;
  },

  init() {
    console.log("init");

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

    this.elements.input.addEventListener("focus", () => {
      this.open(this.elements.input.value, currentValue => {
        this.elements.input.value = currentValue;
      });
    });

    this.elements.input.focus();
    addEventListener("keyup", function (e) {
      Keyboard._keyUpDownButton(e, true);
    });

    addEventListener("keydown", function (e) {
      Keyboard._keyUpDownButton(e, false);
      if (this != null & this.elements != null) this.elements.input.focus();
    });
  },

  getLanguageAfterLoadPage() {
    const langUserInterface = (navigator.language || navigator.systemLanguage || navigator.userLanguage).substr(0, 2).toLowerCase();
    return localStorage.lang != null ? localStorage.lang : langUserInterface;
  },

  setSelection() {
    this.properties.value = this.elements.input.value;
    this.selection.start = this.elements.input.selectionStart;
    this.selection.end = this.elements.input.selectionEnd;
  },

  changeLanguage() {
    localStorage.lang = localStorage.lang != null && localStorage.lang == "en" ? "ru" : "en";
    console.log("change_lang" + localStorage.lang);
  },

  isSimple(key) {
    return (key.length === 1)
  },

  _findSpecialButton(key, isKeyUp) {
    switch (key) {
      case "Shift":
        this._toggleShift();
        break;
      case "CapsLock":
        if (!isKeyUp) this._toggleCapsLock();
        break;
      case "Control":
        this._toggleCtrl();
        break;
      case "Alt":
        this._toggleAlt();
        break;
      default:
        console.log("it is not specific button")
        return false;
    }
    this.elements.input.focus();
    return true;
  },

  _keyUpDownButton(e, isKeyUp) {
    console.log("нажата" + e.key);
    console.log("элементы");
    console.log(this.elements);
    if (!this._findSpecialButton(e.key, isKeyUp)) {
      this.elements.keys.forEach((element) => {
        if (isKeyUp)
          element.classList.remove("active-key");
        else {
          if (e.key.toLowerCase() === element.textContent.toLowerCase()) {

            //simple number or letter
            element.classList.add("active-key");
            if (element.getAttribute("defaultKey"))
              this.properties.value += (this.properties.capsLock && !this.properties.shift) || (!this.properties.capsLock && this.properties.shift) ? e.key.toUpperCase() : e.key.toLowerCase();
            //this.elements.input.value = this.properties.value;

            if (e.key === 'Tab') {
              e.preventDefault();
              document.querySelector('#Tab').click();
            }
            console.log("после нажатия");
            console.log(this);
            return;
          }
        }
      });
    }
  },

  _clickKeyButton(key) {
    console.log("click");
    console.log(this.properties.value);
    this.properties.value += (this.properties.capsLock && !this.properties.shift) || (!this.properties.capsLock && this.properties.shift) ? key.toUpperCase() : key.toLowerCase();
    this._triggerEvent("oninput");
    this.elements.input.focus();
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayoutEn = [
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "delete",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
      "shift", "\\", "z", "x", "c", "v", "b", "n", "m", ".", ",", "/", "▲", "shift_r",
      "control", "win", "alt", "space", "alt", "ctrl_r", "◄", "▼", "►"
    ];

    const keyLayoutRu = [
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\", "delete",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "shift", "\\", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "▲", "shift_r",
      "control", "win", "alt", "space", "alt", "ctrl_r", "◄", "▼", "►"
    ];

    let keyLayout = Keyboard.getLanguageAfterLoadPage() == "ru" ? keyLayoutRu : keyLayoutEn;
    console.log("язык" + keyLayout);

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "delete", "enter", "shift_r", "?"].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        //impelement delete not last char
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = 'Backspace';

          keyElement.addEventListener("click", () => {
            this.setSelection();
            if (this.selection.start !== this.selection.end) {
              this.properties.value = `${this.properties.value.slice(0, this.selection.start)}${this.properties.value.slice(this.selection.end)}`;
            } else if (this.selection.start !== 0) {
              this.properties.value = `${this.properties.value.slice(0, this.selection.start - 1)}${this.properties.value.slice(this.selection.start)}`;
              --this.selection.start;
            } else {
              this.setCursor(this.selection.start);
            }
            this.elements.input.value = this.properties.value;
            this.setCursor(this.selection.start);
          });

          break;

        case "delete":
          keyElement.innerHTML = 'Delete';
          keyElement.addEventListener("click", () => {
            this.setSelection();
            if (this.selection.start !== this.selection.end) {
              this.properties.value = `${this.properties.value.slice(0, this.selection.start)}${this.properties.value.slice(this.selection.end)}`;
            } else if (this.selection.end !== this.properties.value.length) {
              this.properties.value = `${this.properties.value.slice(0, this.selection.start)}${this.properties.value.slice(this.selection.start + 1)}`;
            }
            this.elements.input.value = this.properties.value;
            this.setCursor(this.selection.start);
          });
          break;

        case "tab":
          keyElement.innerHTML = 'Tab';
          keyElement.id = 'Tab';
          keyElement.addEventListener("click", () => {
            this.setSelection();
            //this.properties.value = `${this.properties.value.substring(0, this.selection.start)}\t${this.properties.value.substring(this.selection.end)}`;
            this.properties.value = `${this.properties.value.slice(0, this.selection.start)}\t${this.properties.value.slice(this.selection.end)}`;

            this.elements.input.value = this.properties.value;
            this.setCursor(this.selection.start + 1);
          });
          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "activatable__key");
          keyElement.innerHTML = 'Caps Lock';

          keyElement.addEventListener("click", () => {
            this._findSpecialButton("CapsLock");
          });
          break;

        case "win":
          keyElement.innerHTML = 'Win';
          keyElement.addEventListener("click", () => {
            alert('System button');
          });
          break;

        case "shift":
        case "shift_l":

          keyElement.innerHTML = 'Shift';

          keyElement.addEventListener("mousedown", () => {
            console.log(this.properties);

            this._findSpecialButton("Shift");
            console.log("mousedownShift");
            console.log(this.properties);

          });

          keyElement.addEventListener("mouseup", () => {
            console.log(this.properties);

            this._findSpecialButton("Shift");
            console.log("mouseUpshift");
            console.log(this.properties);

          });
          break;

        case "control":
        case "ctrl_r":
          keyElement.innerHTML = 'Ctrl';

          keyElement.addEventListener("click", () => {
            this._toggleCtrl();
            console.log("clickCtrl");

          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = 'ENTER';

          keyElement.addEventListener("click", () => {
            //this.elements.input.value = `${this.elements.input.value.substring(0, start)}${this.elements.input.value.substring(end)}`;

            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });

          break;


        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = "Space";

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.setAttribute("defaultKey", true);

          keyElement.addEventListener("click", () => {
            this._clickKeyButton(key);
            /*
            console.log("click");
            console.log(this.properties.value);
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this._triggerEvent("oninput");*/
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

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      console.log("triggered" + handlerName);
      this.eventHandlers[handlerName](this.properties.value);
    }
  },
  _colorBackspace(keyClass) {
    // document.querySelector("." + keyClass).classList.toggle("active-key");
  },

  __setButtonUpperCase() {
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && Keyboard.isSimple(key.textContent)) {
        key.textContent = (this.properties.capsLock && !this.properties.shift) || (!this.properties.capsLock && this.properties.shift) ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    this.__setButtonUpperCase();
    document.querySelector(".activatable__key").classList.toggle("activatable__key--active", this.properties.capsLock);
  },

  _toggleShift() {
    console.log("_toggleShift");
    this.properties.shift = !this.properties.shift;
    this.__setButtonUpperCase();
  },

  _toggleAlt() {
    this.properties.alt = !this.properties.alt;
    if (this.properties.shift) {
      this.changeLanguage();
      this.init();
    }
  },

  _toggleCtrl() {
    this.properties.ctrl = !this.properties.ctrl;
  },


  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
  },
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
  //Keyboard.changeLanguage("en");
  //Keyboard.init();
});