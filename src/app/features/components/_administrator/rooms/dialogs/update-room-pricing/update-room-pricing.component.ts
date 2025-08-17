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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReadRoomModel, PatchRoomPricingModel } from '@features/_models';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { mapRoomToPatchPricing } from '../../room-form-mapper';

@Component({
  selector: 'app-update-room-pricing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
  ],
  templateUrl: './update-room-pricing.component.html',
  styleUrls: ['./update-room-pricing.component.scss'],
})
export class UpdateRoomPricingComponent implements OnInit {
  @Input() room?: ReadRoomModel;
  @Input() visible = false;
  @Output() saveUpdateRoomPricing = new EventEmitter<PatchRoomPricingModel>();
  @Output() cancelUpdateRoomPricing = new EventEmitter<void>();

  form!: FormGroup;

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
      monthlyPrice: [0, Validators.required],
      depositAmount: [0, Validators.required],
    });
  }

  private patchForm(room: ReadRoomModel) {
    const patch = mapRoomToPatchPricing(room);
    this.form.patchValue(patch);
  }

  onSave() {
    if (this.form.valid) {
      this.saveUpdateRoomPricing.emit(this.form.value);
    }
  }

  onCancel() {
    this.cancelUpdateRoomPricing.emit();
  }
}
