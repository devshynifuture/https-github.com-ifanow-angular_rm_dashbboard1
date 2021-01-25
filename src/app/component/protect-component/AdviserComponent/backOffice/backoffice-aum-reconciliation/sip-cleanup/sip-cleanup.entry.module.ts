import { MaterialModule } from './../../../../../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecordDetailsComponent } from './record-details/record-details.component';
import { SipCleanupTransactionComponent } from './sip-cleanup-transaction/sip-cleanup-transaction.component';

const componentList = [
    RecordDetailsComponent, SipCleanupTransactionComponent

]

@NgModule({
    declarations: componentList,
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,

    ],
    entryComponents: componentList
})
export class SipCleanupEntryModule {
    static getComponentList() {
        return componentList;
    }
}