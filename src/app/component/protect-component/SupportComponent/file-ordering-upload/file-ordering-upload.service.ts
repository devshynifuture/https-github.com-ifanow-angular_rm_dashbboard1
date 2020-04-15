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

    // post apis



    // upt 

}