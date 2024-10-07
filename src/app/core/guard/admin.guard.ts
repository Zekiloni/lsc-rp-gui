import { firstValueFrom, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { selectIsAdministrator } from '../../stores/account/account.selector';

export const adminGuard: CanActivateFn = async  (route, state) => {
   const store = inject(Store);

   return await firstValueFrom(
      store.select(selectIsAdministrator).pipe(
         map(adminLevel => adminLevel != null && adminLevel > 0)
      )
   );
};
