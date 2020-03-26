import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpService) { }

  addClientAddress(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CLIENT_ADDRESS, data);
  }
  addClientBank(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CLIENT_BANK, data)
  }
  addClientBasicDetails(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CLIENT_BASIC_DETAILS, data)
  }
  addClientDemat(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CLIENT_DEMAT, data)
  }
  addClientMoreInfo(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CLIENT_MORE_INFO, data)
  }
  addClientUpload(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CLIENT_UPLOAD, data)
  }
  getClientList(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_PEOPLE_CLIENT_LIST, data, 1)
  }
}
