import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/gestion des utilisateurs/routes/user.routing').then(m => m.UserRoutes)
  },
];
