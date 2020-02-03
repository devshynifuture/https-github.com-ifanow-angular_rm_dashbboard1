import { MaterialModule } from '../../../../../material/material';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionAddComponent } from '../transaction-add/transaction-add.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { OnlineTrasactionComponent } from '../overview-transactions/doTransaction/online-trasaction/online-trasaction.component';
import { AddArnRiaCredentialsComponent } from '../settings-transactions/settings-manage-credentials/arn-ria-credentials/add-arn-ria-credentials/add-arn-ria-credentials.component';
import { AddSubBrokerCredentialsComponent } from '../settings-transactions/settings-manage-credentials/sub-broker-team-member/add-sub-broker-credentials/add-sub-broker-credentials.component';
import { PurchaseTrasactionComponent } from '../overview-transactions/doTransaction/purchase-trasaction/purchase-trasaction.component';

export const componentList = [
    TransactionAddComponent,
    OnlineTrasactionComponent,
    AddArnRiaCredentialsComponent,
    AddSubBrokerCredentialsComponent,
    PurchaseTrasactionComponent,
]
@NgModule({
    declarations: componentList,
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CustomDirectiveModule,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule],
    entryComponents: [componentList]
})

export class TransactionEntryModule { }
