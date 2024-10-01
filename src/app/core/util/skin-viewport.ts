import * as THREE from 'three';

import { DFFLoader } from './gta-3d/dff-loader';
import { environment } from '../../../environments/environment';

// TODO: This is hardcoded, but I hope it can be fixed.
// Models from this array have a strange rotation on the x-axis, causing the models to lie on the ground.
// I tried to find a property with which it would be possible to understand this, but I failed.
// Maybe something is wrong with skeletons or maybe I need to add idle-animation for the models.
// I don't know how it works in the game.
const NEED_ROTATE_X = [
   'truth',
   'bbthin',
   'bb',
   'emmet',
   'bfori',
   'dwmolc1',
   'dwmolc2',
   'swmotr1',
   'ryder3',
   'wmori',
   'dnfolc2',
   'dnmolc1',
   'suzie',
   'ryder',
   'wuzimu',
   'ryder2',
];

export async function loadSkinModel(
   model: number,
): Promise<THREE.Mesh> {
   return await new Promise<THREE.Mesh>((resolve) => {
      new DFFLoader().load(`${environment.staticUrl}/models/skins/${model}.dff`, resolve);
   });
}