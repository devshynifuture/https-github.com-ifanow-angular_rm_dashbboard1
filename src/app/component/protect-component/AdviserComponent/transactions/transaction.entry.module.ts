import { CustomDirectiveModule } from './../../../../common/directives/common-directive.module';
import { MaterialModule } from '../../../../material/material';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionAddComponent } from './transaction-add/transaction-add.component';
import { AddClientMappingComponent } from './settings-transactions/settings-client-mapping/add-client-mapping/add-client-mapping.component';

export const componentList = [
    TransactionAddComponent
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
