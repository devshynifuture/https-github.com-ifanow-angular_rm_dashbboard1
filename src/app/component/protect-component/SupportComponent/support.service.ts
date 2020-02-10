import { Injectable } from '@angular/core';

import { HttpService } from './../../../http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private http: HttpService) { }

  getMyIFAValues(data) {

  }
}
