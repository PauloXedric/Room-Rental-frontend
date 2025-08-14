import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import { RegisterUserModel } from '@features/_models';
import { ApiResponse } from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: ApiService) {}

  registerUser(data: RegisterUserModel): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>('UserAccount/register', data);
  }
}
