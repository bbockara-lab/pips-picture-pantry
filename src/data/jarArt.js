import strawberryJam from "../assets/jars/jar-strawberry-jam-v1.webp";
import blueberryJam from "../assets/jars/jar-blueberry-jam-v1.webp";
import cherryJam from "../assets/jars/jar-cherry-jam-v1.webp";
import orangeMarmalade from "../assets/jars/jar-orange-marmalade-v1.webp";
import lemonCurd from "../assets/jars/jar-lemon-curd-v1.webp";
import peachPreserve from "../assets/jars/jar-peach-preserve-v1.webp";
import acaciaHoney from "../assets/jars/jar-acacia-honey-v1.webp";
import mapleSyrup from "../assets/jars/jar-maple-syrup-v1.webp";
import yuzuSyrup from "../assets/jars/jar-yuzu-syrup-v1.webp";
import gingerSyrup from "../assets/jars/jar-ginger-syrup-v1.webp";
import maesilSyrup from "../assets/jars/jar-maesil-syrup-v1.webp";
import lavenderHoney from "../assets/jars/jar-lavender-honey-v1.webp";
import rosemary from "../assets/jars/jar-rosemary-v1.webp";
import chamomile from "../assets/jars/jar-chamomile-v1.webp";
import driedLavender from "../assets/jars/jar-dried-lavender-v1.webp";
import driedMint from "../assets/jars/jar-dried-mint-v1.webp";
import rosePetals from "../assets/jars/jar-rose-petals-v1.webp";
import hibiscus from "../assets/jars/jar-hibiscus-v1.webp";
import seaSalt from "../assets/jars/jar-sea-salt-v1.webp";
import blackPepper from "../assets/jars/jar-black-pepper-v1.webp";
import cinnamon from "../assets/jars/jar-cinnamon-v1.webp";
import blackSesame from "../assets/jars/jar-black-sesame-v1.webp";
import pumpkinSeeds from "../assets/jars/jar-pumpkin-seeds-v1.webp";
import redBean from "../assets/jars/jar-red-bean-v1.webp";

export const JAR_ART = Object.freeze({
  "strawberry-jam": strawberryJam,
  "blueberry-jam": blueberryJam,
  "cherry-jam": cherryJam,
  "orange-marmalade": orangeMarmalade,
  "lemon-curd": lemonCurd,
  "peach-preserve": peachPreserve,
  "acacia-honey": acaciaHoney,
  "maple-syrup": mapleSyrup,
  "yuzu-syrup": yuzuSyrup,
  "ginger-syrup": gingerSyrup,
  "maesil-syrup": maesilSyrup,
  "lavender-honey": lavenderHoney,
  "rosemary": rosemary,
  "chamomile": chamomile,
  "dried-lavender": driedLavender,
  "dried-mint": driedMint,
  "rose-petals": rosePetals,
  "hibiscus": hibiscus,
  "sea-salt": seaSalt,
  "black-pepper": blackPepper,
  "cinnamon": cinnamon,
  "black-sesame": blackSesame,
  "pumpkin-seeds": pumpkinSeeds,
  "red-bean": redBean
});

export function getJarArtUrl(jarId) {
  return JAR_ART[jarId] || "";
}
