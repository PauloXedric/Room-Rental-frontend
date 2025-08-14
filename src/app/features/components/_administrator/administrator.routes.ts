import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { authGuard, roleGuard, RoutePathEnum, UserRoleEnum } from '@core';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { PaymentsComponent } from './payments/payments.component';
import { RoomsComponent } from './rooms/rooms.component';
import { TenantsComponent } from './tenants/tenants.component';

export default [
  {
    path: '',
    redirectTo: RoutePathEnum.AdminDashboard,
    pathMatch: 'full',
  },
  {
    path: RoutePathEnum.AdminDashboard,
    component: AdminDashboardComponent,
  },
  {
    path: RoutePathEnum.AdminPayments,
    component: PaymentsComponent,
  },
  {
    path: RoutePathEnum.AdminRooms,
    component: RoomsComponent,
  },
  {
    path: RoutePathEnum.AdminTenants,
    component: TenantsComponent,
  },
] as Routes;
