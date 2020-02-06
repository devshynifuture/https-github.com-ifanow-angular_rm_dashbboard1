import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailAdviceComponent } from './advice-activity/email-advice/email-advice.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';

export const componentList = [
  EmailAdviceComponent,
];


@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    CustomDirectiveModule
  ]
})
export class AdviceEntryModule {
  static getComponentList() {
    return componentList;
  }
}
