import { HttpService } from './../../../../../../../http-service/http-service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from './../../../../../../../config/main-config';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CashFlowsPlanService {
    constructor(private http: HttpService) { }

    cashFlowAddIncome(data) {
        return this.http.post(apiConfig.MAIN_URL + appConfig.CASHFLOW_ADD_INCOME, data);
    }

    getCashflowIncomeValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.CASHFLOW_GET_INCOME, data);
    }

    getCashflowExpenseValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.CASHFLOW_GET_EXPENSE, data)
    }

    getMonthlyExpenseValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.CASHFLOW_GET_MONTHLY_EXPENSE, data);
    }

    getFamilyMemberData(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIST_FAMILY_MEMBER, data);
    }
}