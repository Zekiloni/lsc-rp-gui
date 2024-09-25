const administratorLabels: Record<number, string> = {
   1: 'Tester',
   2: 'Junior Administrator',
   3: 'Administrator',
   4: 'Senior Administrator',
   5: 'Lead Admin',
   6: 'Management',
   7: 'Developer',
};

export const getAdministratorLabel = (admin: number) => {
   return administratorLabels[admin] || 'None';
};

export const getAdministratorSeverity = (admin: number) => {
   if (admin == 1) {
      return 'success';
   } else if (admin > 1) {
      return 'danger';
   } else {
      return 'primary';
   }
};