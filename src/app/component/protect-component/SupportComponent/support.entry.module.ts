import { MaterialModule } from './../../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentModule } from '../common-component/common-component.module';
import { AdminDetailsComponent } from './ifa-onboarding/admin-details/admin-details.component';
import { IfasDetailsComponent } from './my-ifas/ifas-details/ifas-details.component';
import { IfaBoardingHistoryComponent } from './ifa-onboarding/ifa-boarding-history/ifa-boarding-history.component';
import { UpperSliderBackofficeComponent } from './common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { ReconciliationDetailsViewComponent } from './common-component/reconciliation-details-view/reconciliation-details-view.component';
import { SupportUpperSliderComponent } from './support-dashboard/support-upper-slider/support-upper-slider.component';


const componentList = [
    AdminDetailsComponent,
    IfasDetailsComponent,
    IfaBoardingHistoryComponent,
    UpperSliderBackofficeComponent,
    ReconciliationDetailsViewComponent,
    SupportUpperSliderComponent
]

@NgModule({
    declarations: componentList,
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CommonComponentModule,
    ],
    entryComponents: componentList
})

export class SupportEntryModule {
    static getComponentList() {
        return componentList;
    }
}