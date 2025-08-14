import { Inject } from '@angular/core';
import { ApiService } from '@core';
import {
  CreateEmergencyContactModel,
  PatchEmergencyContactModel,
} from '@features/_models';
import { ApiResponse, ReadEmergencyContactModel } from '@shared/_models';
import { Observable } from 'rxjs';

Inject({ providedIn: 'root' });

export class EmergencyContactService {
  constructor(private apiService: ApiService) {}

  getUserEmergencyInfoByUser(): Observable<ReadEmergencyContactModel> {
    return this.apiService.get<ReadEmergencyContactModel>('EmergencyContact');
  }

  addEmergencyContact(
    data: CreateEmergencyContactModel
  ): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>('EmergencyContact', data);
  }

  patchEmergencyContact(
    data: PatchEmergencyContactModel
  ): Observable<ApiResponse> {
    return this.apiService.patch<ApiResponse>('EmergencyContact', data);
  }
}
