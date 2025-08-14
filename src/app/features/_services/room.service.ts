import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import {
  CreateRoomModel,
  PatchRoomAvailabilityModel,
  PatchRoomInfoModel,
  PatchRoomPricingModel,
  ReadRoomModel,
} from '@features/_models';
import { ApiResponse, PaginationResult } from '@shared/_models';
import { ReadRoomParam } from '@shared/_params';
import { Observable } from 'rxjs';

Injectable({ providedIn: 'root' });

export class RoomService {
  constructor(private apiService: ApiService) {}

  getAllRoomDetails(
    param: ReadRoomParam
  ): Observable<PaginationResult<ReadRoomModel>> {
    return this.apiService.get<PaginationResult<ReadRoomModel>>('Room', param);
  }

  addNewRoom(data: CreateRoomModel): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>('Room', data);
  }

  updateRoomInfo(data: PatchRoomInfoModel): Observable<ApiResponse> {
    return this.apiService.patch<ApiResponse>('Room/update-information', data);
  }

  updateRoomPrice(data: PatchRoomPricingModel): Observable<ApiResponse> {
    return this.apiService.patch<ApiResponse>('Room/update-pricing', data);
  }

  UpdateRoomAvailability(
    data: PatchRoomAvailabilityModel
  ): Observable<ApiResponse> {
    return this.apiService.patch<ApiResponse>('Room/update-availability', data);
  }

  deleteRoom(roomId: number): Observable<ApiResponse> {
    return this.apiService.delete<ApiResponse>(`Room/${roomId}`);
  }
}
