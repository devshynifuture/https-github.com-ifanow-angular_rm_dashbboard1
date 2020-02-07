import { MaterialModule } from './../../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IfaDetailsComponent } from './my-ifas/ifa-details/ifa-details.component';
import { CommonComponentModule } from '../common-component/common-component.module';


const componentList = [
    IfaDetailsComponent
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