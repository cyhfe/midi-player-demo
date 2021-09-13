import { FancyMidiPlayer } from "./midi";
import MusicPiece from "./midi/MusicPiece";
import { repertoire } from "../assets/music_repertoire.json";
import { ASSETS_PATH, INSTRUMENT_URL } from "./utils/constants";
import { FancyPiano } from "./piano";

const getFilePath = (filename) => `${ASSETS_PATH}/${filename}`;
const pieces = repertoire.map(
  ({ title, filename }, idx) =>
    new MusicPiece(idx, title, getFilePath(filename))
);

const setAppBusy = (isBusy) => {
  const playButton = document.querySelector("#play-piece");
  const stopButton = document.querySelector("#stop-piece");
  const musicalPiecesSelect = document.querySelector("#musical-pieces");

  if (isBusy) {
    playButton.setAttribute("disabled", true);
    stopButton.setAttribute("disabled", true);
    musicalPiecesSelect.setAttribute("disabled", true);
  } else {
    playButton.removeAttribute("disabled");
    stopButton.removeAttribute("disabled");
    musicalPiecesSelect.removeAttribute("disabled");
  }
};

const piano = new FancyPiano(document);
const cp = new FancyMidiPlayer(piano);
cp.subscribe(piano);
setAppBusy(true);

const changePiece = (pieceId) => {
  setAppBusy(true);
  cp.stopMidi();
  cp.setMidi(pieces[pieceId].path).then(() => setAppBusy(false));
};

cp.setInstrument(INSTRUMENT_URL).then(() => {
  const playButton = document.querySelector("#play-piece");
  const stopButton = document.querySelector("#stop-piece");
  playButton.onclick = cp.playMidi.bind(cp);
  stopButton.onclick = cp.stopMidi.bind(cp);
  changePiece(pieces[0].id);
});

const musicalPiecesSelect = document.querySelector("#musical-pieces");
musicalPiecesSelect.onchange = (evt) => changePiece(evt.target.value);

pieces
  .map((piece) => {
    const option = document.createElement("option");
    option.id = piece.id;
    option.value = piece.id;
    option.innerHTML = piece.name;
    option.selected = piece.id === 0;
    return option;
  })
  .forEach((pieceOption) => musicalPiecesSelect.append(pieceOption));
