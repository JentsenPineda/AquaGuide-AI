import { goldfishGallery } from "./goldfishGallery";

import { bettaGallery } from "./bettaGallery";
import { danioGallery } from "./danioGallery";
import { guppyGallery } from "./guppyGallery";
import { platyGallery } from "./platyGallery";

import { angelfishGallery } from "./angelfishGallery";
import { gouramiGallery } from "./gouramiGallery";
import { mollyGallery } from "./mollyGallery";
import { swordtailGallery } from "./swordtailGallery";
import { tigerBarbGallery } from "./tigerBarbGallery";

import { arowanaGallery } from "./arowanaGallery";
import { discusGallery } from "./discusGallery";
import { flowerhornGallery } from "./flowerhornGallery";
import { koiGallery } from "./koiGallery";
import { oscarGallery } from "./oscarGallery";

export const allGalleries: Record<string, any> = {
  goldfish: [
    ...goldfishGallery.common,
    ...goldfishGallery.comet,
    ...goldfishGallery.shubunkin,
  ],

  betta: bettaGallery,
  guppy: guppyGallery,
  platy: platyGallery,
  danio: danioGallery,

  angelfish: angelfishGallery,
  gourami: gouramiGallery,
  molly: mollyGallery,
  swordtail: swordtailGallery,
  tigerbarb: tigerBarbGallery,

  discus: discusGallery,
  arowana: arowanaGallery,
  flowerhorn: flowerhornGallery,
  oscar: oscarGallery,
  koi: koiGallery,
};
