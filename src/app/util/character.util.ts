
export const getSkinImage = (skinId: number, top: boolean = false) => {
   return `./assets/images/skins/skin-${skinId}${top ? '_top' : ''}.png`;
};

export const beautifyName = (name: string) => {
   return name.replace("_", " ");
}