import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from 'src/app/config/main-config';
import { HttpService } from 'src/app/http-service/http-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupportUpperService {

  constructor(private http: HttpService) { }

  // get apis for NJ
  getAllSchemesNj(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_ALL_SCHEMES_NJ, data)
  }

  getUnmappedSchemesNj(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_UNMAPPED_SCHEMES_NJ, data)
  }

  // get apis for prudent
  getAllSchemesPrudent(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_ALL_SCHEMES_PRUDENT, data)
  }


  getUnmappedSchemesPrudent(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_UNMAPPED_SCHEMES_NJ, data)
  }

  getFilteredSchemes(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_FILTERED_SCHEMES, data)
  }


}
