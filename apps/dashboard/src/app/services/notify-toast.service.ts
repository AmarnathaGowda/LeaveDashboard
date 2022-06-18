import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotifyToastService {
  constructor(private toastr: ToastrService) {}
  showSuccess(data?:any) {
    this.toastr.success(data);
  }
}
