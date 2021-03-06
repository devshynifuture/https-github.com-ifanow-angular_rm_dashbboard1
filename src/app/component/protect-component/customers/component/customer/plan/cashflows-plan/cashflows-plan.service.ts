import { HttpService } from './../../../../../../../http-service/http-service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from './../../../../../../../config/main-config';
import { Injectable } from '@angular/core';
import { UpperTableBox, Group } from './cashflow.interface';

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

    cashflowEditMonthlyIncomeValues(data) {
        return this.http.put(apiConfig.MAIN_URL + appConfig.CASHFLOW_EDIT_MONTHLY_INCOME, data);
    }

    getCashflowYearlyIncomeValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.CASHFLOW_GET_INCOME, data);
    }

    getCashflowMonthlyIncomeValues(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.CASHFLOW_GET_MONTHLY_DISTRIBUTION_INCOME, data);
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

    getCashflowMonthlySurplusValues(data) {
        return this.http.get('', data);
    }

    cashflowAddSurplusData(data) {
        return this.http.post('', data);
    }

    cashflowEditSurplusData(data) {
        return this.http.post('', data);
    }

    getFamilyMemberData(data) {
        return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIST_FAMILY_MEMBER, data);
    }


    // =============== common functions ==================
    // ===================================================

    alterTable(table: (UpperTableBox | Group)[], field: string, value: string, index: number): (UpperTableBox | Group)[] {
        table[index][field]['value'] = value;

        console.log('value field index', value, field, index);
        console.log('table :', table);
        console.log('table index: ', table[index]);
        console.log('table index field', table[index][field])
        console.log('table index field value', table[index][field]['value']);

        table[index][field]['isAdHocChangesDone'] = true;
        this.updateTotal(table[index]);
        return table;
    }

    updateTotal(object: UpperTableBox | Group) {
        let sum = 0;
        for (let i = 1; i <= 12; i++) {
            if (object[`month${i}`].value !== '') {
                sum = sum + parseInt(object[`month${i}`].value);
            }
        }
        object['total'] = String(sum);
    }
}