import { AuthService } from './../../../../../../auth-service/authService';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpService } from 'src/app/http-service/http-service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
        const subject = new BehaviorSubject<any>('');
        this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_ADV_GET_BROKER_LIST, data)
            .subscribe(res => {
                res.forEach(item => {
                    const { id } = item;
                    const { brokerCode } = item;
                    let brokerListArr = [];
                    brokerListArr.push({
                        id,
                        brokerCode
                    });
                    subject.next(brokerListArr);
                });
            });

        return subject.asObservable();
    }

    getRTListValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_RT_LIST, data);
    }

    getAumReconHistoryDataValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_AUM_RECON_HISTORY_LIST, data);
    }

    getDuplicateFolioDataValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_DUPLICATE_FOLIO_DATA, data);
    }

    getDuplicateDataValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_DUPLICATE_DATA_LIST, data);
    }

    getFoliowiseTransactionList(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_FOLIOWISE_LIST_GET, data)
    }

    getMutualFundFolioMasterValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_FOLIO_MASTER_DETAIL, data)
    }

    // post functions

    // put functions
    putBackofficeReconAdd(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_AUM_RECON_ADD, data);
    }

    putFileOrderRetry(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_FILE_ORDER_RETRY, data);
    }

    putFreezeFolioData(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_FREEZE_FOLIO_DATA, data)
    }

    putUnfreezeFolio(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_UNFREEZE_FOLIO_DATA, data)
    }

    putUnmapFolioTransaction(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_UNMAP_FOLIO, data);
    }

    // delete functions

    deleteAumTransaction(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_DELETE_AUM_TRANSACTION_SINGLE_MULTIPLE, data);
    }

    deleteAndReorder(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_DELETE_AND_REORDER, data);
    }

    // common functions


}