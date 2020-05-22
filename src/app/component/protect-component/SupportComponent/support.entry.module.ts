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
import { FileOrderingUpperComponent } from './file-ordering-upload/file-ordering-upper/file-ordering-upper.component';
import { FileOrderingDetailComponent } from './file-ordering-upload/file-ordering-detail/file-ordering-detail.component';
import { FileOrderingSetupComponent } from './file-ordering-upload/file-ordering-bulk/file-ordering-setup/file-ordering-setup.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CustomFilterDatepickerDialogComponent } from './file-ordering-upload/custom-filter-datepicker-dialog.component';

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
    MyIfaSelectArnRiaComponent,
    FileOrderingUpperComponent,
    FileOrderingDetailComponent,
    FileOrderingSetupComponent,
    CustomFilterDatepickerDialogComponent
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
    entryComponents: componentList,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
    ]
})

export class SupportEntryModule {
    static getComponentList() {
        return componentList;
    }
}
