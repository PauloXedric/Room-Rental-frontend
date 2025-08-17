import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ReadRoomModel, PatchRoomInfoModel } from '@features/_models';
import { RoomTypeEnum, GenderRestrictionEnum } from '@shared/_enums';
import { enumToSelectOptions } from '@shared/_helpers';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { mapRoomToPatchInfo } from '../../room-form-mapper';

@Component({
  selector: 'app-update-room-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    FloatLabelModule,
    DialogModule,
  ],
  templateUrl: './update-room-info.component.html',
  styleUrls: ['./update-room-info.component.scss'],
})
export class UpdateRoomInfoComponent implements OnInit {
  @Input() room?: ReadRoomModel;
  @Input() visible = false;
  @Output() saveUpdateRoomInfo = new EventEmitter<PatchRoomInfoModel>();
  @Output() cancelUpdateRoomInfo = new EventEmitter<void>();

  form!: FormGroup;

  roomTypeOptions = enumToSelectOptions(RoomTypeEnum);
  genderRestrictionOptions = enumToSelectOptions(GenderRestrictionEnum);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['room'] && this.room) {
      this.patchForm(this.room);
    }
  }

  private initForm() {
    this.form = this.fb.group({
      roomId: [null, Validators.required],
      roomName: ['', Validators.required],
      description: [''],
      roomType: [RoomTypeEnum.None, Validators.required],
      numberOfBeds: [0, Validators.required],
      maxOccupants: [0, Validators.required],
      genderRestriction: [GenderRestrictionEnum.None, Validators.required],
      roomAddress: [''],
    });
  }

  private patchForm(room: ReadRoomModel) {
    const patch = mapRoomToPatchInfo(room);
    this.form.patchValue(patch);
  }

  onSave() {
    if (this.form.valid) {
      this.saveUpdateRoomInfo.emit(this.form.value);
    }
  }

  onCancel() {
    this.cancelUpdateRoomInfo.emit();
  }
}
