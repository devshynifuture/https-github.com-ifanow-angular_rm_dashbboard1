import { Injectable } from '@angular/core';
import {HttpService} from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpService) { }

  addLifeInsurance(data)
  {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_LIFE_INSURANCE,data)
  }
}
