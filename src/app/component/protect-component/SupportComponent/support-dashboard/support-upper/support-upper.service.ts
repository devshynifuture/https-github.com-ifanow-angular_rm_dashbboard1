import { EventService } from './../../../../../Data-service/event.service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from 'src/app/config/main-config';
import { HttpService } from 'src/app/http-service/http-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupportUpperService {

  constructor(
    private http: HttpService,
    private eventService: EventService
  ) { }

  // get apis for NJ
  getAllSchemesNj(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_ALL_SCHEMES_NJ, data)
  }

  getUnmappedSchemesNj(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_UNMAPPED_SCHEMES_NJ_PRUDENT, data)
  }

  // get apis for prudent
  getAllSchemesPrudent(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_ALL_SCHEMES_PRUDENT, data)
  }


  getUnmappedSchemesPrudent(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_UNMAPPED_SCHEMES_NJ_PRUDENT, data)
  }

  getFilteredSchemes(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_FILTERED_SCHEMES, data)
  }
  getSchemesDetails(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SCHEMES_DETAILS, data)
  }
  // common functions

  getThreeWordsOfSchemeName(element) {
    let copyElement = element.name.split(" ").slice();
    console.log("this is some copied ELement", copyElement);

    copyElement = copyElement.filter((item, index) => {
      if (index <= 2) {
        return item;
      }
    });
    return copyElement.join(" ").toLowerCase();
  }

  checkIfDataNotPresentAndShowError(data) {
    if (data && data.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  getMappedUnmappedCount(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.RM_MAPPED_UNMAPPED_SCHEME_COUNT_NJ_PRUDENT, data);
  }

  postUnmapUnmappedNjPrudentScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.RM_UNMAP_MAPPED_NJPRUDENT_SCHEMES, data);
  }

  postMapUnmappedNjPrudentScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.RM_MAP_UNMAPPED_NJPRUDENT_SCHEMES, data);
  }

}
