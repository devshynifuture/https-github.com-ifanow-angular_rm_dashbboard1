import { Injectable } from '@angular/core';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from 'src/app/config/main-config';
import { HttpService } from 'src/app/http-service/http-service';

@Injectable({
  providedIn: 'root'
})
export class ReferEarnService {

  constructor(private httpService: HttpService) { }
  getReferredusersData(data) {
    return this.httpService.getEncoded(apiConfig.USER + appConfig.REFERRED_USERS, data, 1);
  }
}
