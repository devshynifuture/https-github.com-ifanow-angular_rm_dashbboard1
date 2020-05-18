import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'src/app/material/material';
import {ChartModule} from 'angular-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddFamilyMemberComponent} from './overview-profile/add-family-member/add-family-member.component';
import {HistoryViewComponent} from './overview-profile/history-view/history-view.component';
import {ViewActivityComponent} from './overview-documents/view-activity/view-activity.component';
import {DocumentNewFolderComponent} from '../../common-component/document-new-folder/document-new-folder.component';
import {PeopleEntryModule} from 'src/app/component/protect-component/PeopleComponent/people/people-entry-module';
import {CustomDirectiveModule} from 'src/app/common/directives/common-directive.module';
import {CustomCommonModule} from 'src/app/common/custom.common.module';
import {MergeClientFamilyMemberComponent} from './overview-profile/merge-client-family-member/merge-client-family-member.component';


export const componentList = [AddFamilyMemberComponent, HistoryViewComponent, ViewActivityComponent,
  DocumentNewFolderComponent, MergeClientFamilyMemberComponent];

@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    CustomCommonModule,
    PeopleEntryModule
  ],
  entryComponents: [componentList]
})
export class CustomerOverviewEntryModule {
  static getComponentList() {
    return componentList;
  }
}
