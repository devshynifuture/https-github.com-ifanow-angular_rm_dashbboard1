import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailAdviceComponent } from './advice-activity/email-advice/email-advice.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { SuggestAdviceComponent } from './advice-activity/suggest-advice/suggest-advice.component';
import { MaterialModule } from 'src/app/material/material';

export const componentList = [
  EmailAdviceComponent,
  SuggestAdviceComponent
];


@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    CustomDirectiveModule,
    MaterialModule
  ]
})
export class AdviceEntryModule {
  static getComponentList() {
    return componentList;
  }
}
