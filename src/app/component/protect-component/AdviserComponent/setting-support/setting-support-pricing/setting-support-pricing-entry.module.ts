import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./../../../../../material/material";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { EmailRefersComponent } from './email-refers/email-refers.component';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { CommonComponentModule } from '../../../common-component/common-component.module';

export const componentList = [
    EmailRefersComponent
]

@NgModule({
    declarations: [
        componentList
    ],
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule, CustomCommonModule, CommonComponentModule],
    entryComponents: [componentList]
})
export class SettingSupportPricingEntryModule {
    static getComponentList() {
        return componentList;
    }
}
