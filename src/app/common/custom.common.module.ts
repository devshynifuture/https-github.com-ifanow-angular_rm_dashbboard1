// import DialogContainerComponent from ''
import {NgModule} from '@angular/core';

// import { LiabilityrightComponent } from './component/customer/accounts/liabilities/liabilityright/liabilityright.component';
import {DialogContainerComponent} from './dialog-container/dialog-container.component';
import {CustomDialogContainerComponent} from './custom-dialog-container/custom-dialog-container.component';
import {MaterialModule} from '../material/material';
// import {AppModule} from "../app.module";


@NgModule({
  declarations: [

  ],
  imports: [
    MaterialModule,
    // AppModule
  ]
})
export class CustomCommonModule {
}
