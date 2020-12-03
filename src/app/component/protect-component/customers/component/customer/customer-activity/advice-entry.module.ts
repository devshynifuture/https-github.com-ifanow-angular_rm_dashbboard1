import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailAdviceComponent } from './advice-activity/email-advice/email-advice.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { SuggestAdviceComponent } from './advice-activity/suggest-advice/suggest-advice.component';
import { MaterialModule } from 'src/app/material/material';
import { GiveAdviceComponent } from './advice-activity/give-advice/give-advice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdviceSIPComponent } from './advice-activity/advice-sip/advice-sip.component';
import { MiscellaneousAdviceComponent } from './advice-activity/miscellaneous-advice/miscellaneous-advice.component';
import { CommonComponentModule } from 'src/app/component/protect-component/common-component/common-component.module';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { EditSuggestedAdviceComponent } from './advice-activity/edit-suggested-advice/edit-suggested-advice.component';

export const componentList = [
  EmailAdviceComponent,
  SuggestAdviceComponent,
  GiveAdviceComponent, AdviceSIPComponent, MiscellaneousAdviceComponent,
  EditSuggestedAdviceComponent
];


@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    CustomCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    MaterialModule,
    CommonComponentModule
  ]
})
export class AdviceEntryModule {
  static getComponentList() {
    return componentList;
  }
}
