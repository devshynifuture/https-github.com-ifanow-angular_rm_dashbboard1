import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from 'src/app/config/main-config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http:HttpService) { }
   
  getIncomeData(data)
  {
    let httpParams=new HttpParams().set('advisorId',data.advisorId).set('clientId',data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_INCOME_LIST,httpParams)
  }
  addIncomeData(data)
  {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_INCOME_LIST,data)
  }
  editIncomeData(data)
  {
    return this.http.post(apiConfig.MAIN_URL + appConfig.EDIT_INCOME_LIST,data)
  }
}
