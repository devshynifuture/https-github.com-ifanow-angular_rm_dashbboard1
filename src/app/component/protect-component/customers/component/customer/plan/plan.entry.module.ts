import { AddProfilePlanComponent } from './profile-plan/add-profile-plan/add-profile-plan.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../../material/material';
import { PreferencesComponent } from './goals-plan/preferences/preferences.component';
import { AddGoalComponent } from './goals-plan/add-goal/add-goal.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CashflowUpperSliderComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-slider.component';

export const componentList = [
  PreferencesComponent,
  AddGoalComponent,
  AddProfilePlanComponent,
  CashflowUpperSliderComponent
];
// import { AddPlaninsuranceComponent } from './insurance-plan/add-planinsurance/add-planinsurance.component';

// export const componentList = [
//   AddPlaninsuranceComponent

// ];

@NgModule({
  declarations: componentList,
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule],
  entryComponents: [componentList]
  , providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})

export class PlanEntryModule {
  static getComponentList() {
    return componentList;
  }
}
