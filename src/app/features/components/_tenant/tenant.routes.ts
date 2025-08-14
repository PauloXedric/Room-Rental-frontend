import { Routes } from '@angular/router';
import { TenantLayoutComponent } from './tenant-layout/tenant-layout.component';
import { RoutePathEnum } from '@core';
import { TenantDashboardComponent } from './tenant-dashboard/tenant-dashboard.component';
import { MyRoomComponent } from './my-room/my-room.component';
import { TenantPaymentComponent } from './tenant-payment/tenant-payment.component';
import { TenantProfileComponent } from './tenant-profile/tenant-profile.component';

export default [
  {
    path: '',
    redirectTo: RoutePathEnum.TenantDashboard,
    pathMatch: 'full',
  },
  {
    path: RoutePathEnum.TenantDashboard,
    component: TenantDashboardComponent,
  },
  {
    path: RoutePathEnum.TenantRoom,
    component: MyRoomComponent,
  },
  {
    path: RoutePathEnum.TenantPayment,
    component: TenantPaymentComponent,
  },
  {
    path: RoutePathEnum.TenantProfile,
    component: TenantProfileComponent,
  },
] as Routes;
