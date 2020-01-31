import { MaterialModule } from './../../../../../material/material';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionAddComponent } from './../transaction-add/transaction-add.component';

export const componentList = [
    TransactionAddComponent
]
@NgModule({
    declarations: componentList,
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule],
    entryComponents: [componentList]
})

export class TransactionEntryModule { }
