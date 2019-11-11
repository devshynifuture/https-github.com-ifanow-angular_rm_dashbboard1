import { Injectable } from '@angular/core';
import {HttpService} from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpService) { }

  addLifeInsurance(data)
  {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_LIFE_INSURANCE,data)
  }
  addFixedDeposit(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_FIXEDDEPOSIT,data)
  }
  getLifeInsuranceData(data)
  {
    let httpParams=new HttpParams().set('advisorId',data.advisorId).set('clientId',data.clientId).set('insuranceTypeId',data.insuranceTypeId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIFE_INSURANCE,httpParams)
  }
}
