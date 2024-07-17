import { environment } from '../../environments/environment';

export const getSkinImage = (skinId: number, top: boolean = false) => {
   return `${environment.staticUrl}/images/skins/skin-${skinId}${top ? '_top' : ''}.png`;
};

export const beautifyName = (name: string) => {
   return name.replace("_", " ");
}