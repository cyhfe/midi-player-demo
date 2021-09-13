import { SUSTAINED_NOTE_DURATION } from "../utils/constants";
import { EVENT_TYPES } from "../midi";

const PIANO_KEYS_COUNT = 88;
const FIRST_KEY_NOTE_NUMBER = 21;

export class FancyPiano {
  constructor(document) {
    this.keys = new Array(PIANO_KEYS_COUNT);
    this.isSustainPedalPressed = false;
    this.setKey = this.setKey.bind(this);
    this.svg = document.getElementById("piano-keyboard");
  }

  repaintKeys() {
    for (let i = 21; i < FIRST_KEY_NOTE_NUMBER + PIANO_KEYS_COUNT; i++) {
      this.paintReleasedKey(i);
    }
  }

  paintPressedKey(noteNumber) {
    this.svg.getElementById(noteNumber).classList.add("pressed");
  }

  paintReleasedKey(noteNumber) {
    try {
      this.svg.getElementById(noteNumber).removeAttribute("style");
      this.svg.getElementById(noteNumber).classList.remove("pressed");
    } catch {
      console.error("Could not repaint key " + noteNumber);
    }
  }

  setKey(number, event) {
    this.keys[number] = event;
    this.paintPressedKey(number);
  }

  setSustainPedal(intensity) {
    this.isSustainPedalPressed = intensity >= 64;
  }

  getSustainedKeys() {
    return this.keys.filter(
      (keyEvent) => keyEvent.duration === SUSTAINED_NOTE_DURATION
    );
  }

  stopKey(number) {
    this.paintReleasedKey(number);
    return this.isSustainPedalPressed ? null : this.keys[number];
  }

  handle(event = {}) {
    const { type, context } = event;
    if (type === EVENT_TYPES.SUSTAIN_PEDAL_PRESSED) {
      this.setSustainPedal(true);
    } else if (type === EVENT_TYPES.SUSTAIN_PEDAL_RELEASED) {
      this.setSustainPedal(false);
      this.getSustainedKeys().forEach((sustainedKey) => sustainedKey.stop());
    } else if (type === EVENT_TYPES.KEY_PRESSED) {
      this.setKey(context.noteNumber, context.keyEvent);
    } else if (type === EVENT_TYPES.KEY_RELEASED) {
      this.stopKey(context.noteNumber);
    } else if (type === EVENT_TYPES.MIDI_STOPPED) {
      this.repaintKeys();
    }
  }
}
