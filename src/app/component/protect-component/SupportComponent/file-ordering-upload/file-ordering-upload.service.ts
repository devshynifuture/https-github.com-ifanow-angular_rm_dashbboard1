import { Injectable } from '@angular/core';
import { apiConfig } from '../../../../config/main-config';
import { appConfig } from '../../../../config/component-config';
import { HttpService } from '../../../../http-service/http-service';

@Injectable({
    providedIn: 'root'
})
export class FileOrderingUploadService {
    constructor(
        private http: HttpService
    ) { }

    // get apis

    getHistoryOfFileOrdering(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig, data);
    }

    getRmMasterUserData(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.RM_DASHBOARD_RM_MASTER_USER_GET, data);
    }

    getFileOrderHistoryListData(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.GET_FILE_ORDER_HISTORICAL_LIST_DATA, data);
    }

    getFileOrderHistoricalUpperListData(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.GET_FILE_ORDER_UPPER_LIST_DATA, data);
    }

    getBulkFileOrderListData(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BULK_FILE_ORDER_LIST, data);
    }

    // post apis



    // upt 

}