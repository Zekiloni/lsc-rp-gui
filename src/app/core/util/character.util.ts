
export const getSkinImage = (skinId: number, top: boolean = false) => {
   return `../assets/images/skins/skin-${skinId}${top ? '_top' : ''}.png`;
};

export const beautifyName = (name: string) => {
   return name.replace("_", " ");
}

export const getCharacterStatusLabel = (isApproved?: boolean) => {
   switch (isApproved) {
      case true:
         return 'Odobren';
      case false:
         return 'Odbijen';
      default:
         return 'Na čekanju';
   }
};

export const getCharacterStatusClass = (isApproved?: boolean) => {
   switch (isApproved) {
      case true:
         return 'text-green-500';
      case false:
         return 'text-red-500';
      default:
         return 'text-yellow-400';
   }
};

export const getCharacterStatusSeverity = (isApproved?: boolean) => {
   switch (isApproved) {
      case true:
         return 'success';
      case false:
         return 'error';
      default:
         return 'warn';
   }
}