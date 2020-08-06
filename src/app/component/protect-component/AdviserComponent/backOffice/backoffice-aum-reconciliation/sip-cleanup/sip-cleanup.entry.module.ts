import { MaterialModule } from './../../../../../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const componentList = [
    
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