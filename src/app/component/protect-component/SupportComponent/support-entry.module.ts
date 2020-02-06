import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IfasDetailsComponent } from './my-ifas/ifas-details/ifas-details.component';
import { IfaBoradingHistoryComponent } from './ifa-onboarding/ifa-borading-history/ifa-borading-history.component';
import { AdminDetailsComponent } from './ifa-onboarding/admin-details/admin-details.component';

export const componentList = [
  IfasDetailsComponent, IfaBoradingHistoryComponent, AdminDetailsComponent

];

@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule
  ]
})
export class SupportEntryModule {
  static getComponentList() {
    return componentList;
  }
}
