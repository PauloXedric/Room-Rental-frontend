import { Routes } from '@angular/router';
import { authGuard, roleGuard, UserRoleEnum } from '@core';
import { RoutePathEnum } from '@core/enums/route-path.enum';
import {
  AboutComponent,
  LoginComponent,
  SignupComponent,
} from '@features/components';
import { AdminDashboardComponent } from '@features/components/_administrator';
import {
  PrivateLayoutComponent,
  PublicLayoutComponent,
} from '@shared/components';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: RoutePathEnum.Signup, pathMatch: 'full' },
      { path: RoutePathEnum.Login, component: LoginComponent },
      { path: RoutePathEnum.Signup, component: SignupComponent },
      { path: RoutePathEnum.Unauthorized, component: LoginComponent },
    ],
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivateChild: [authGuard, roleGuard],
    children: [
      {
        path: RoutePathEnum.Admin,
        data: { roles: [UserRoleEnum.Admin] },
        loadChildren: () =>
          import(
            '@features/components/_administrator/administrator.routes'
          ).then((m) => m.default),
      },
      {
        path: RoutePathEnum.Tenant,
        data: { roles: [UserRoleEnum.Tenant] },
        loadChildren: () =>
          import('@features/components/_tenant/tenant.routes').then(
            (m) => m.default
          ),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
