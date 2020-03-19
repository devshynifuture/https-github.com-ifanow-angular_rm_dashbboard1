import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpService } from 'src/app/http-service/http-service';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class ReconciliationService {
    constructor(
        private http: HttpService
    ) { }

    // api calling functions 

    // get functions

    getBrokerListValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_ADV_GET_BROKER_LIST, data);
    }

    getRTListValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_RT_LIST, data);
    }

    getAumReconHistoryDataValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_AUM_RECON_HISTORY_LIST, data);
    }

    // post functions

    // put functions
    putBackofficeReconAdd(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_AUM_RECON_ADD, data);
    }

    putFileOrderRetry(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_FILE_ORDER_RETRY, data);
    }

    // delete functions

    deleteAumTransaction(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_DELETE_AUM_TRANSACTION_SINGLE_MULTIPLE, data);
    }


}