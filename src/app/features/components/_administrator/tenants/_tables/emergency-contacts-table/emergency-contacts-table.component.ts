import { Component, OnInit } from '@angular/core';
import { UserEmergencyContactView, PaginationResult } from '@shared/_models';
import { ReadUserEmergencyContactParam } from '@shared/_params';
import { ViewService } from '@shared/_services';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  switchMap,
  catchError,
  of,
} from 'rxjs';

@Component({
  selector: 'app-emergency-contacts-table',
  standalone: true,
  imports: [
    CardModule,
    TableModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
  ],
  templateUrl: './emergency-contacts-table.component.html',
  styleUrl: './emergency-contacts-table.component.scss',
})
export class EmergencyContactsTableComponent implements OnInit {
  emergencyContacts: UserEmergencyContactView[] = [];
  totalRecords = 0;

  private pageSubject = new BehaviorSubject<number>(0);
  private pageSizeSubject = new BehaviorSubject<number>(10);
  private searchTermSubject = new BehaviorSubject<string>('');

  readonly rowsPerPageOptions = [5, 10, 15, 20, 25];

  get pageSize(): number {
    return this.pageSizeSubject.value;
  }

  constructor(private viewService: ViewService) {}

  ngOnInit(): void {
    this.initContactsStream();
  }

  private initContactsStream() {
    combineLatest([
      this.pageSubject,
      this.pageSizeSubject,
      this.searchTermSubject.pipe(debounceTime(500)),
    ])
      .pipe(
        switchMap(([page, pageSize, searchTerm]) => {
          const params: ReadUserEmergencyContactParam = {
            pageNumber: page + 1,
            pageSize,
            firstNameFilter: searchTerm ?? '',
          };
          return this.viewService
            .userEmergencyContactList(params)
            .pipe(
              catchError(() =>
                of({ items: [], totalCount: 0, pageNumber: page + 1, pageSize })
              )
            );
        })
      )
      .subscribe((result: PaginationResult<UserEmergencyContactView>) => {
        this.emergencyContacts = result.items;
        this.totalRecords = result.totalCount;
      });
  }

  onPageChange(event: any) {
    this.pageSubject.next(event.page);
    this.pageSizeSubject.next(event.rows);
  }

  onSearch(event: any) {
    this.pageSubject.next(0);
    this.searchTermSubject.next(event.target.value);
  }
}
