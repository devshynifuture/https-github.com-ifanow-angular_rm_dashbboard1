import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddFamilyMemberComponent } from './overview-profile/add-family-member/add-family-member.component';
import { HistoryViewComponent } from './overview-profile/history-view/history-view.component';
import { ViewActivityComponent } from './overview-documents/view-activity/view-activity.component';
import { DocumentNewFolderComponent } from '../../common-component/document-new-folder/document-new-folder.component';
import { PeopleEntryModule } from 'src/app/component/protect-component/PeopleComponent/people/people-entry-module';
import { BottomSheetComponent } from '../../common-component/bottom-sheet/bottom-sheet.component';


export const componentList = [AddFamilyMemberComponent, HistoryViewComponent, ViewActivityComponent, DocumentNewFolderComponent];
@NgModule({
    declarations: [componentList],
    imports: [
        CommonModule,
        MaterialModule,
        ChartModule,
        FormsModule,
        ReactiveFormsModule,
        PeopleEntryModule
    ],
    entryComponents: [componentList]
})
export class CustomerOverviewEntryModule {
    static getComponentList() {
        return componentList;
    }
}