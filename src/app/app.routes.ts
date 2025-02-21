import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./contract-ui/contract-ui.module').then(
        (m) => m.ContractUiModule
      ),
  },

  { path: '**', redirectTo: '' },
];
