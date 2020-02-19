import { CustomDirectiveModule } from './../../../common/directives/common-directive.module';
import { AddLifeInsuranceMasterComponent } from './support-dashboard/add-life-insurance-master/add-life-insurance-master.component';
import { AddStockMasterComponent } from './support-dashboard/add-stock-master/add-stock-master.component';
import { MaterialModule } from './../../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentModule } from '../common-component/common-component.module';
import { AdminDetailsComponent } from './ifa-onboarding/admin-details/admin-details.component';
import { IfasDetailsComponent } from './my-ifas/ifas-details/ifas-details.component';
import { UpperSliderBackofficeComponent } from './common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { ReconciliationDetailsViewComponent } from './common-component/reconciliation-details-view/reconciliation-details-view.component';
import { SupportUpperComponent } from './support-dashboard/support-upper/support-upper.component';
import { SupportUpperAllRtaComponent } from './support-dashboard/support-upper/support-upper-all-rta/support-upper-all-rta.component';
import { SupportUpperNjComponent } from './support-dashboard/support-upper/support-upper-nj/support-upper-nj.component';
import { SupportUpperPrudentComponent } from './support-dashboard/support-upper/support-upper-prudent/support-upper-prudent.component';
import { OrderHistoricalFileComponent } from './order-historical-file/order-historical-file.component'
import { MyIfaSelectArnRiaComponent } from './my-ifas/my-ifa-select-arn-ria/my-ifa-select-arn-ria.component';

const componentList = [
    AdminDetailsComponent,
    IfasDetailsComponent,
    UpperSliderBackofficeComponent,
    ReconciliationDetailsViewComponent,
    SupportUpperComponent,
    AddStockMasterComponent,
    AddLifeInsuranceMasterComponent,
    SupportUpperAllRtaComponent,
    SupportUpperNjComponent,
    SupportUpperPrudentComponent,
    OrderHistoricalFileComponent,
    MyIfaSelectArnRiaComponent
]

@NgModule({
    declarations: componentList,
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CustomDirectiveModule,
        CommonComponentModule,
    ],
    entryComponents: componentList
})

export class SupportEntryModule {
    static getComponentList() {
        return componentList;
    }
}