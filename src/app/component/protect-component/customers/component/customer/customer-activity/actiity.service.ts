import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from 'src/app/config/main-config';

@Injectable({
  providedIn: 'root'
})
export class ActiityService {

  constructor(private http: HttpService) { }

  getAdviceFd(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_FD, data)
  }
  getAllAdviceByCategory(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ADVICE_BY_CATEGORY, data);
  }
  getAllAsset(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.ADVICE_GET_ALL, data);
  }
  getAllCategory(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ALL_CATEGORY, data);
  }
  suggestNewLifeInsurance(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.SUGGEST_NEW_INSURANCE, data)
  }
  deleteAdvice(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_ADVICE, data)
  }
}
