import { HttpService } from './../../../../../../../http-service/http-service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from './../../../../../../../config/main-config';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CashFlowsPlanService {
    constructor(private http: HttpService) { }

    // income api calls 
    cashFlowAddIncome(data) {
        return this.http.post(apiConfig.MAIN_URL + appConfig.CASHFLOW_ADD_INCOME, data);
    }

    cashFlowDeleteIncome(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.CASHFLOW_DELETE_INCOME, data);
    }

    cashflowEditIncome(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.CASHFLOW_EDIT_INCOME, data);
    }

    cashflowEditMonthlyIncome(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.CASHFLOW_EDIT_MONTHLY_INCOME, data);
    }

    getCashflowYearlyIncomeValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.CASHFLOW_GET_INCOME, data);
    }

    getCashflowMonthlyIncomeValues(data) {
        return this.http.get('', data);
    }

    // expenses api calls 
    getCashflowYearlyExpensesValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.CASHFLOW_GET_YEARLY_EXPENSE, data)
    }

    getCashflowMonthlyExpensesValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.CASHFLOW_GET_MONTHLY_EXPENSE, data);
    }

    getCashflowYearlyAssetsValue(data) {
        return this.http.get('', data);
    }

    getCashflowMonthlyAssetsValues(data) {
        return this.http.get('', data);
    }

    getCashflowYearlyInsuranceValues(data) {
        return this.http.get('', data)
    }

    getCashflowMonthlyInsuranceValues(data) {
        return this.http.get('', data);
    }
    // cashflow expenses  
    cashflowAddExpenses(data) {
        return this.http.post(apiConfig.MAIN_URL + appConfig.CASHFLOW_ADD_EXPENSES, data);
    }

    cashflowEditExpenses(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.CASHFLOW_EDIT_EXPENSES, data);
    }

    cashflowDeleteExpenses(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.CASHFLOW_DELETE_EXPENSES, data);
    }

    cashflowExpensesMonthlyDistributionEdit(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.CASHFLOW_EDIT_MONTHLY_EXPENSE_DISTRIBUTION, data);
    }

    // liabilities api calls
    getCashflowYearlyLiabilitiesValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.CASHFLOW_GET_YEARLY_LIABILITIES, data);
    }

    getCashflowMonthlyLiabilitiesValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.CASHFLOW_GET_MONTHLY_LIABILITIES, data);
    }

    cashflowAddLiabilities(data) {
        return this.http.post(apiConfig.MAIN_URL + appConfig.CASHFLOW_ADD_LIABILITIES, data);
    }

    cashflowEditLiabilities(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.CASHFLOW_EDIT_LIABILITIES, data);
    }

    cashflowDeleteLiabilities(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.CASHFLOW_DELETE_LIABILITIES, data);
    }

    // surplus calls
    getCashflowYearlySurplusValues(data) {
        return this.http.get('', data);
    }

    getFamilyMemberData(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIST_FAMILY_MEMBER, data);
    }
}