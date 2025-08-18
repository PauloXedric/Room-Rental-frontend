import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  of,
  switchMap,
  tap,
  catchError,
} from 'rxjs';
import { GenderRestrictionEnum, RoomTypeEnum } from '@shared/_enums';
import { enumToSelectOptions } from '@shared/_helpers';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import {
  CreateRoomModel,
  PatchRoomInfoModel,
  PatchRoomPricingModel,
  ReadRoomModel,
} from '@features/_models';
import { RoomService } from '@features/_services';
import { ReadRoomParam } from '@shared/_params';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { FluidModule } from 'primeng/fluid';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationDialogService, ToastService } from '@shared/_services';
import { UpdateRoomInfoComponent, UpdateRoomPricingComponent } from '..';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    ButtonModule,
    TagModule,
    DataViewModule,
    PaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DecimalPipe,
    InputGroupAddonModule,
    InputGroupModule,
    FloatLabelModule,
    InputNumberModule,
    SelectModule,
    FluidModule,
    DatePickerModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    UpdateRoomInfoComponent,
    UpdateRoomPricingComponent,
  ],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  addRoomForm!: FormGroup;
  rooms: ReadRoomModel[] = [];
  totalRecords = 0;

  editInfoDialogVisible = false;
  editPricingDialogVisible = false;

  currentRoom!: ReadRoomModel;

  private pageSubject = new BehaviorSubject<number>(0);
  private pageSizeSubject = new BehaviorSubject<number>(5);
  readonly rowsPerPageOptions = [5, 10, 15, 20, 25];

  get pageSize(): number {
    return this.pageSizeSubject.value;
  }

  roomTypeOptions = enumToSelectOptions(RoomTypeEnum);
  genderRestrictionOptions = enumToSelectOptions(GenderRestrictionEnum);

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private toastService: ToastService,
    private confirmationService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.initRoomsStream();

    this.addRoomForm = this.fb.group({
      roomName: ['', Validators.required],
      description: [''],
      roomType: [null, Validators.required],
      numberOfBeds: [null, Validators.required],
      maxOccupants: [null, Validators.required],
      genderRestriction: [null, Validators.required],
      roomAddress: [''],
      monthlyPrice: [null],
      depositAmount: [null],
      inquireFromDate: [null],
      inquireToDate: [null],
      availableStartDate: [null],
    });
  }

  private initRoomsStream() {
    combineLatest([this.pageSubject, this.pageSizeSubject])
      .pipe(
        switchMap(([page, pageSize]) => {
          const params: ReadRoomParam = {
            pageNumber: page + 1,
            pageSize,
          };

          return this.roomService
            .getAllRoomDetails(params)
            .pipe(
              catchError(() =>
                of({ items: [], totalCount: 0, pageNumber: page + 1, pageSize })
              )
            );
        }),
        tap((res) => {
          this.rooms = res.items;
          this.totalRecords = res.totalCount;
        })
      )
      .subscribe();
  }

  onPageChange(event: { first: number; rows: number }) {
    this.pageSubject.next(event.first / event.rows);
    this.pageSizeSubject.next(event.rows);
  }

  addNewRoom(): void {
    const newRoom: CreateRoomModel = this.addRoomForm.value;

    this.roomService.addNewRoom(newRoom).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
        this.addRoomForm.reset();
        this.pageSubject.next(this.pageSubject.value);
      },
      error: (err) => {
        if (err.status === 400) {
          this.toastService.showError(err.error.message);
        } else {
          this.toastService.showError(
            err.error?.message || 'Error occurred adding new room.'
          );
        }
      },
    });
  }

  openEditInfoDialog(room: ReadRoomModel) {
    this.currentRoom = room;
    this.editInfoDialogVisible = true;
  }

  openEditPricingDialog(room: ReadRoomModel) {
    this.currentRoom = room;
    this.editPricingDialogVisible = true;
  }

  updateRoomInfo(patch: PatchRoomInfoModel) {
    this.roomService.updateRoomInfo(patch).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
        this.editInfoDialogVisible = false;
        this.pageSubject.next(this.pageSubject.value);
      },
      error: (err) => {
        if (err.status === 404) {
          this.toastService.showWarn(err.error.message);
        } else {
          this.toastService.showError(
            err.error?.message || 'Error occurred while updating room info.'
          );
        }
      },
    });
  }

  updateRoomPrice(patch: PatchRoomPricingModel) {
    this.roomService.updateRoomPrice(patch).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
        this.editPricingDialogVisible = false;
        this.pageSubject.next(this.pageSubject.value);
      },
      error: (err) => {
        if (err.status === 404) {
          this.toastService.showWarn(err.error.message);
        } else {
          this.toastService.showError(
            err.error?.message || 'Error occurred while updating room price.'
          );
        }
      },
    });
  }

  confirmDeleteRoom(roomId: number) {
    this.confirmationService
      .confirm$({
        header: 'Delete Room',
        message: 'Are you sure you want to delete this room?',
        actionLabel: 'Delete',
      })
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.roomService.deleteRoom(roomId).subscribe({
            next: (res) => {
              this.toastService.showInfo(res.message);
              this.pageSubject.next(this.pageSubject.value);
            },
            error: (err) => {
              this.toastService.showError(
                err.error?.message || 'Error occurred while deleting a room.'
              );
            },
          });
        }
      });
  }
}
