import { Routes } from '@angular/router';
import { RoutePathEnum } from '@core/enums/route-path.enum';
import { AboutComponent } from '@features/components';
import { PublicLayoutComponent } from '@shared/components';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: RoutePathEnum.About, pathMatch: 'full' },
      { path: RoutePathEnum.About, component: AboutComponent },
    ],
  },
];
