import { AuthService } from './../../../../../../auth-service/authService';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpService } from 'src/app/http-service/http-service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventService } from '../../../../../../Data-service/event.service';
import { HttpParams } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class ReconciliationService {
    constructor(
        private http: HttpService,
        private eventService: EventService
    ) { }

    routeOnObs = new BehaviorSubject(null);

    // api calling functions 

    // get functions

    getBrokerListValues(data) {
        const subject = new BehaviorSubject<any>('');
        let brokerListArr = [];
        this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_ADV_GET_BROKER_LIST, data)
            .subscribe(res => {
                if (res) {
                    res.forEach(item => {
                        const { id } = item;
                        let brokerCode = item.number;
                        brokerListArr.push({
                            id,
                            brokerCode
                        });
                    });
                    subject.next(brokerListArr);
                } else {
                    this.eventService.openSnackBar('No Broker List Found', "Dismiss");
                }
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
        return this.http.post(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_DUPLICATE_FOLIO_DATA + '?advisorIds=' + data.advisorIds + '&parentId=' + data.parentId + '&isParent=' + data.isParent + '&aumDate=' + data.aumDate, data.aum);
    }

    getDuplicateDataValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_DUPLICATE_DATA_LIST, data);
    }

    getFoliowiseTransactionList(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_FOLIOWISE_LIST_GET, data)
    }

    getMutualFundFolioMasterValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.FOLIO_MASTER_DETAILS, data)
    }

    getAumReportListValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_AUM_REPORT_LIST, data);
    }

    getFolioQueryDataListValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_FOLIO_BASED_SEARCH_LIST, data);
    }

    getGroupHeadNameValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.FOLIO_GROUP_HEAD_LIST, data);
    }

    getInvestorNameValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.FOLIO_APPLICANT_NAME_LIST, data);
    }

    getTeamMemberListValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BACKOFFICE_TEAM_MEMBER_LIST, data);
    }

    getSubAdvisorListValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUB_ADVISOR_LIST, data);
    }
    // post functions

    postBackOfficeUnmatchedFoliosData(data) {
        return this.http.post(apiConfig.MAIN_URL + appConfig.BACKOFFICE_POST_UNMATCHED_FOLIOS_ADD, data);
    }

    // put functions
    putBackofficeReconAdd(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_AUM_RECON_ADD, data);
    }

    getBackOfficeFileUploadFileType(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_FILE_UPLOAD_TYPE, data);
    }

    getBackOfficeFilter(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_FILTER, data);
    }

    getBackOfficeFileToUpload(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_FILE_TO_UPLOAD, data);
    }
    uploadNJFile(data) {
        return this.http.post(apiConfig.MAIN_URL + appConfig.UPLOAD_NJ_FILE, data);
    }
    uploadStock(data) {
        return this.http.post(apiConfig.MAIN_URL + appConfig.UPLOAD_STOCK, data);
    }
    transactionUpload(data) {
        const httpParams = new HttpParams().set('advisorId', data.advisorId).set('fileNameInS3', data.fileNameInS3);
        return this.http.get(apiConfig.MAIN_URL + appConfig.TRANSACTION_UPLOAD, httpParams);
    }
    holdingUpload(data) {
        const httpParams = new HttpParams().set('advisorId', data.advisorId).set('fileNameInS3', data.fileNameInS3);
        return this.http.get(apiConfig.MAIN_URL + appConfig.HOLDING_UPLOAD, httpParams);
    }
    getBackOfficeTransactions(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_TRANSACTIONS, data);
    }

    getBackOfficeSipStp(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_SIP_STP, data);
    }

    getBackOfficeFolio(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_FOLIO, data);
    }

    getBackofficeFolioAumList(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_FILEUPLOAD_AUM_LIST_GET, data);
    }

    successBackOfficeFileToUpload(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_SUCCESS_FILE_UPLOAD, data)
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
    unmappedFolio(data) {
        //  const httpParams = new HttpParams().set('mutualFundId', data.mutualFundId);
        return this.http.putParam(apiConfig.MAIN_URL + appConfig.BACKOFFICE_UNMAPPED_FOLIO, '', data);
    }
    // delete functions

    deleteUnfreezeTransaction(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_DELETE_UNFREEZE_TRANSACTION, data)
    }

    deleteAumTransaction(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_DELETE_AUM_TRANSACTION_SINGLE_MULTIPLE, data);
    }

    deleteAndReorder(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_DELETE_AND_REORDER, data);
    }

    mfListUnfreeze(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.MF_LIST_UNFREEZE, data);
    }

    // common functions

    getRoutedOn() {
        return this.routeOnObs.asObservable();
    }

    setRoutedOn(data): void {
        this.routeOnObs.next(data);
    }
}