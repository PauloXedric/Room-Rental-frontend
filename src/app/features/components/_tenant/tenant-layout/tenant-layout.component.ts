import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, RoutePathEnum, UserStatusEnum } from '@core';
import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-tenant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, ConfirmPopupModule],
  providers: [ConfirmationService, AuthService],
  templateUrl: './tenant-layout.component.html',
  styleUrl: './tenant-layout.component.scss',
})
export class TenantLayoutComponent implements OnInit {
  @Input() isLeftSidebarCollapsed!: boolean;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();
  items: any[] = [];

  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const status = this.authService.getAccountStatus();

    const isInactive = status === UserStatusEnum.Inactive;

    this.items = [
      {
        label: 'Dashboard',
        routeLink: [RoutePathEnum.Tenant, RoutePathEnum.TenantDashboard],
        icon: PrimeIcons.HOME,
        disabled: isInactive,
      },
      {
        label: 'My-Room',
        routeLink: [RoutePathEnum.Tenant, RoutePathEnum.TenantRoom],
        icon: PrimeIcons.BUILDING,
        disabled: isInactive,
      },
      {
        label: 'Payment',
        routeLink: [RoutePathEnum.Tenant, RoutePathEnum.TenantPayment],
        icon: PrimeIcons.CREDIT_CARD,
        disabled: isInactive,
      },
      {
        label: 'Profile',
        routeLink: [RoutePathEnum.Tenant, RoutePathEnum.TenantProfile],
        icon: PrimeIcons.USER,
        disabled: isInactive,
      },
      {
        label: 'Log out',
        icon: PrimeIcons.SIGN_OUT,
        command: (event: Event) => this.confirmLogout(event),
      },
    ];
  }

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
