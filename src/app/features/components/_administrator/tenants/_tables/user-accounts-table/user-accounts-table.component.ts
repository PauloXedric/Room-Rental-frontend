import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserStatusEnum } from '@core';
import {
  ReadAccountStatusModel,
  UpdateUserStatusModel,
} from '@features/_models';
import { ReadAccountStatusParam } from '@features/_params';
import { UserService } from '@features/_services';
import { enumToSelectOptions } from '@shared/_helpers';
import { PaginationResult } from '@shared/_models';
import { ConfirmationDialogService, ToastService } from '@shared/_services';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  of,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-user-accounts-table',
  imports: [
    CardModule,
    TableModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    SelectModule,
    FormsModule,
  ],
  templateUrl: './user-accounts-table.component.html',
  styleUrl: './user-accounts-table.component.scss',
})
export class UserAccountsTableComponent {
  accounts: ReadAccountStatusModel[] = [];
  totalRecords = 0;

  private pageSubject = new BehaviorSubject<number>(0);
  private pageSizeSubject = new BehaviorSubject<number>(10);
  private searchTermSubject = new BehaviorSubject<string>('');

  readonly rowsPerPageOptions = [5, 10, 15, 20, 25];

  get pageSize(): number {
    return this.pageSizeSubject.value;
  }

  statusOptions = enumToSelectOptions(UserStatusEnum);

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationDialogService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initAccountsStream();
  }

  private initAccountsStream() {
    combineLatest([
      this.pageSubject,
      this.pageSizeSubject,
      this.searchTermSubject.pipe(debounceTime(500)),
    ])
      .pipe(
        switchMap(([page, pageSize, searchTerm]) => {
          const params: ReadAccountStatusParam = {
            pageNumber: page + 1,
            pageSize,
            firstNameFilter: searchTerm ?? '',
          };

          return this.userService
            .userStatusList(params)
            .pipe(
              catchError(() =>
                of({ items: [], totalCount: 0, pageNumber: page + 1, pageSize })
              )
            );
        })
      )
      .subscribe((result: PaginationResult<ReadAccountStatusModel>) => {
        this.accounts = result.items;
        this.totalRecords = result.totalCount;
      });
  }

  onPageChange(event: { first: number; rows: number }) {
    this.pageSubject.next(event.first / event.rows);
    this.pageSizeSubject.next(event.rows);
  }

  onSearch(event: any) {
    this.pageSubject.next(0);
    this.searchTermSubject.next(event.target.value);
  }

  confirmStatusChange(
    selectedStatus: UserStatusEnum,
    account: ReadAccountStatusModel
  ) {
    const previousStatus = account.status;

    this.confirmationService
      .confirm$({
        header: 'Update User Status',
        message: `Are you sure you want to change status of ${account.firstName} to ${selectedStatus}?`,
        actionLabel: 'Update',
      })
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;

        const updateData: UpdateUserStatusModel = {
          userId: account.id,
          status: selectedStatus,
        };

        this.userService.updateUserStatus(updateData).subscribe({
          next: (res) => {
            account.status = selectedStatus;
            this.toastService.showSuccess(res.message);
          },
          error: (err) => {
            this.toastService.showError(
              err.error?.message || 'Error occurred while updating status.'
            );
            account.status = previousStatus;
          },
        });
      });
  }

  getStatusSeverity(status: UserStatusEnum): string {
    switch (status) {
      case UserStatusEnum.Active:
        return 'success';
      case UserStatusEnum.Inactive:
        return 'warn';
      case UserStatusEnum.Suspended:
        return 'danger';
      default:
        return 'info';
    }
  }
}
