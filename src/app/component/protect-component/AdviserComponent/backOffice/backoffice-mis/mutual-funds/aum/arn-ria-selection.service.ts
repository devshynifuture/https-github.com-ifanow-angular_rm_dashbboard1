import { AuthService } from 'src/app/auth-service/authService';
import { Injectable } from '@angular/core';
import { BackOfficeService } from '../../../back-office.service';

@Injectable({
    providedIn: 'root'
})
export class ArnRiaSelectionService {
    advisorId: any;
    constructor(
        private backoffice: BackOfficeService
    ) {
        this.advisorId = AuthService.getAdvisorId();
    }
    arnRiaList = [];

    getArnRiaList() {
        this.backoffice.getArnRiaList(this.advisorId).subscribe(
            data => {
                if (data) {
                    this.arnRiaList = data;
                    const obj = {
                        number: 'All',
                        value: -1
                    }
                    this.arnRiaList.unshift(obj);
                }
            },
        )
    }
    sorting(data, filterId) {
        if (data) {
          data.sort((a, b) =>
            a[filterId] > b[filterId] ? 1 : (a[filterId] === b[filterId] ? 0 : -1)
          );
        }
        return data;
      }
}