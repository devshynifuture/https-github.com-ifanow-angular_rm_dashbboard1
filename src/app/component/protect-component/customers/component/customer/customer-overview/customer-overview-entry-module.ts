import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddFamilyMemberComponent } from './overview-profile/add-family-member/add-family-member.component';


export const componentList = [AddFamilyMemberComponent];
@NgModule({
    declarations: [componentList],
    imports: [
        CommonModule,
        MaterialModule,
        ChartModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    entryComponents: [componentList]
})
export class CustomerOverviewEntryModule {
    static getComponentList() {
        return componentList;
    }
}