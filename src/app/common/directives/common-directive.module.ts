// import DialogContainerComponent from ''
import { NgModule } from '@angular/core';
// import { LiabilityrightComponent } from './component/customer/accounts/liabilities/liabilityright/liabilityright.component';
import { RadioGroupDirectiveDirective } from './radio-group-directive.directive';
import { CustomRightAnimationDirective } from './custom-right-animation.directive';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { SkeletonLoadingDirective } from './skeleton-loading.directive';
import { TextOnlyDirective } from './text-only.directive';
import { InputValidationDirective, AlphanumricDirective } from './input-validation.directive';
// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    RadioGroupDirectiveDirective,
    CustomRightAnimationDirective,
    SkeletonLoadingDirective,
    FormatNumberDirective,
    TextOnlyDirective,
    InputValidationDirective,
    AlphanumricDirective
  ],
  exports: [RadioGroupDirectiveDirective, SkeletonLoadingDirective, FormatNumberDirective,InputValidationDirective,AlphanumricDirective,TextOnlyDirective],
  imports: [

    // AppModule
  ]
})
export class CustomDirectiveModule {
}
