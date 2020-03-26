import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './../../../../../material/material';
import { FolioMasterDetailViewComponent } from './folio-master-detail-view/folio-master-detail-view.component';

const componentList = [
    FolioMasterDetailViewComponent
]

@NgModule({
    declarations: componentList,
    imports: [
        CommonModule,
        MaterialModule,
    ],
    entryComponents: componentList
})
export class BackofficeAumReconciliationEntryModule {
    static getComponentList() {
        return componentList;
    }
}