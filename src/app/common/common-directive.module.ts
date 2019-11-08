// import DialogContainerComponent from ''
import {NgModule} from '@angular/core';
// import { LiabilityrightComponent } from './component/customer/accounts/liabilities/liabilityright/liabilityright.component';
import {RadioGroupDirectiveDirective} from "./radio-group-directive.directive";

// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    RadioGroupDirectiveDirective
  ],
  exports: [RadioGroupDirectiveDirective],
  imports: [

    // AppModule
  ]
})
export class CustomDirectiveModule {
}
