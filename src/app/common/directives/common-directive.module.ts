// import DialogContainerComponent from ''
import { NgModule } from '@angular/core';
// import { LiabilityrightComponent } from './component/customer/accounts/liabilities/liabilityright/liabilityright.component';
import { RadioGroupDirectiveDirective } from './radio-group-directive.directive';
import { CustomRightAnimationDirective } from './custom-right-animation.directive';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { SkeletonLoadingDirective } from './skeleton-loading.directive';
import { InputValidationDirective, AlphanumricDirective, TextOnlyDirective, Formatter } from './input-validation.directive';
// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    RadioGroupDirectiveDirective,
    CustomRightAnimationDirective,
    SkeletonLoadingDirective,
    FormatNumberDirective,
    TextOnlyDirective,
    InputValidationDirective,
    AlphanumricDirective,
    Formatter
  ],
  exports: [RadioGroupDirectiveDirective, SkeletonLoadingDirective, FormatNumberDirective,InputValidationDirective,AlphanumricDirective,TextOnlyDirective,Formatter],
  imports: [

    // AppModule
  ]
})
export class CustomDirectiveModule {
}
