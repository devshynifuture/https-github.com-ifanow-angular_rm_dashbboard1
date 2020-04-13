import { Injectable } from '@angular/core';
import { HttpService } from '../../../../http-service/http-service';
import { apiConfig } from '../../../../config/main-config';
import { appConfig } from '../../../../config/component-config';

@Injectable({
    providedIn: 'root'
})
export class SupportAumReconService {
    constructor(
        private http: HttpService
    ) { }

    // apis
    getRmUserInfo(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.RM_DASHBOARD_RM_MASTER_USER_GET, data);
    }


    // common functions


}