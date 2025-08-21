import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, RoutePathEnum } from '@core';
import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, ConfirmPopupModule],
  providers: [ConfirmationService, AuthService],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  @Input() isLeftSidebarCollapsed!: boolean;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  items = [
    {
      label: 'Dashboard',
      routeLink: [RoutePathEnum.Admin, RoutePathEnum.AdminDashboard],
      icon: PrimeIcons.HOME,
    },

    {
      label: 'Rooms',
      routeLink: [RoutePathEnum.Admin, RoutePathEnum.AdminRooms],
      icon: PrimeIcons.BUILDING,
    },
    {
      label: 'Tenants',
      routeLink: [RoutePathEnum.Admin, RoutePathEnum.AdminTenants],
      icon: PrimeIcons.USERS,
    },
    {
      label: 'Payments',
      routeLink: [RoutePathEnum.Admin, RoutePathEnum.AdminPayments],
      icon: PrimeIcons.CREDIT_CARD,
    },
    {
      label: 'Log out',
      icon: PrimeIcons.SIGN_OUT,
      command: (event: Event) => this.confirmLogout(event),
    },
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed);
  }

  confirmLogout(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to logout?',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Logout',
      rejectLabel: 'Cancel',
      acceptButtonProps: {
        severity: 'danger',
        outlined: true,
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {
        this.authService.logout();
      },
      reject: () => {},
    });
  }
}
