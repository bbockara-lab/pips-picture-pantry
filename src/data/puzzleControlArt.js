import fillUrl from "../assets/icons/puzzle-controls-v1/puzzle-control-fill-v1.png";
import markUrl from "../assets/icons/puzzle-controls-v1/puzzle-control-mark-v1.png";
import undoUrl from "../assets/icons/puzzle-controls-v1/puzzle-control-undo-v1.png";
import hintUrl from "../assets/icons/puzzle-controls-v1/puzzle-control-hint-v1.png";
import settingsUrl from "../assets/icons/puzzle-controls-v1/puzzle-control-settings-v1.png";
import resetUrl from "../assets/icons/puzzle-controls-v1/puzzle-control-reset-v1.png";
import { isRuntimePuzzleControlArtApproved } from "./runtimeArt.js";

const PUZZLE_CONTROL_ART = {
  fill: { assetId: "puzzle-control-fill-v1", src: fillUrl },
  mark: { assetId: "puzzle-control-mark-v1", src: markUrl },
  undo: { assetId: "puzzle-control-undo-v1", src: undoUrl },
  hint: { assetId: "puzzle-control-hint-v1", src: hintUrl },
  settings: { assetId: "puzzle-control-settings-v1", src: settingsUrl },
  reset: { assetId: "puzzle-control-reset-v1", src: resetUrl }
};

export function getPuzzleControlArt(control) {
  const art = PUZZLE_CONTROL_ART[control];
  return art && isRuntimePuzzleControlArtApproved(art.assetId) ? art : null;
}
