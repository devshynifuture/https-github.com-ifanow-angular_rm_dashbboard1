import { MaterialModule } from './../../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentModule } from '../common-component/common-component.module';
import { AdminDetailsComponent } from './ifa-onboarding/admin-details/admin-details.component';


const componentList = [
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