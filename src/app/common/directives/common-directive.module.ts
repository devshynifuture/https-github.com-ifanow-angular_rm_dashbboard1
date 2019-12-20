// import DialogContainerComponent from ''
import { NgModule } from '@angular/core';
// import { LiabilityrightComponent } from './component/customer/accounts/liabilities/liabilityright/liabilityright.component';
import { RadioGroupDirectiveDirective } from './radio-group-directive.directive';
import { CustomRightAnimationDirective } from './custom-right-animation.directive';
import { SkeletoneLoadingDirective } from './skeletone-loading.directive';

// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    RadioGroupDirectiveDirective,
    CustomRightAnimationDirective,
    SkeletoneLoadingDirective,

  ],
  exports: [RadioGroupDirectiveDirective, SkeletoneLoadingDirective],
  imports: [

    // AppModule
  ]
})
export class CustomDirectiveModule {
}
