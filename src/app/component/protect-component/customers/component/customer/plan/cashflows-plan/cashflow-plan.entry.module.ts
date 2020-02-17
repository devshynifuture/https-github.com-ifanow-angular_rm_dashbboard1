import { CashflowUpperSliderComponent } from './cashflow-upper-slider/cashflow-upper-slider.component';
import { CashflowAddComponent } from './cashflow-upper-slider/cashflow-add/cashflow-add.component';
import { CashflowUpperAssetComponent } from './cashflow-upper-slider/cashflow-upper-asset/cashflow-upper-asset.component';
import { CashflowUpperInsuranceComponent } from './cashflow-upper-slider/cashflow-upper-insurance/cashflow-upper-insurance.component';
import { CashflowUpperSurplusComponent } from './cashflow-upper-slider/cashflow-upper-surplus/cashflow-upper-surplus.component';
import { CashflowAddIncomeComponent } from './cashflow-upper-slider/cashflow-add/cashflow-add-income/cashflow-add-income.component';
import { CashflowAddExpensesComponent } from './cashflow-upper-slider/cashflow-add/cashflow-add-expenses/cashflow-add-expenses.component';
import { CashflowAddLiabilitiesComponent } from './cashflow-upper-slider/cashflow-add/cashflow-add-liabilities/cashflow-add-liabilities.component';
import { CashflowAddSurplusComponent } from './cashflow-upper-slider/cashflow-add/cashflow-add-surplus/cashflow-add-surplus.component';
import { CashflowUpperLiabilitiesComponent } from './cashflow-upper-slider/cashflow-upper-liabilities/cashflow-upper-liabilities.component';
import { CashflowUpperExpenseComponent } from './cashflow-upper-slider/cashflow-upper-expense/cashflow-upper-expense.component';
import { CashflowUpperIncomeComponent } from './cashflow-upper-slider/cashflow-upper-income/cashflow-upper-income.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const componentList = [
    CashflowUpperSliderComponent,
    CashflowAddComponent,
    CashflowAddIncomeComponent,
    CashflowAddExpensesComponent,
    CashflowAddLiabilitiesComponent,
    CashflowAddSurplusComponent,
    CashflowUpperAssetComponent,
    CashflowUpperInsuranceComponent,
    CashflowUpperSurplusComponent,
    CashflowUpperIncomeComponent,
    CashflowUpperExpenseComponent,
    CashflowUpperLiabilitiesComponent,
]

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    entryComponents: componentList,
})
export class CashflowPlanEntryModule {
    static getComponentList() {
        return componentList;
    }
}
