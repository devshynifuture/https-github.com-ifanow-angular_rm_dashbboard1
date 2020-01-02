// import DialogContainerComponent from ''
import { NgModule } from '@angular/core';
// import { LiabilityrightComponent } from './component/customer/accounts/liabilities/liabilityright/liabilityright.component';
import { RadioGroupDirectiveDirective } from './radio-group-directive.directive';
import { CustomRightAnimationDirective } from './custom-right-animation.directive';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { SkeletonLoadingDirective } from './skeleton-loading.directive';
import { NumberValidationDirective } from './number-validation.directive';
import { TextOnlyDirective } from './text-only.directive';
import { AlphanumricDirective } from './alphanumric.directive';

// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    RadioGroupDirectiveDirective,
    CustomRightAnimationDirective,
    SkeletonLoadingDirective,
    FormatNumberDirective,
    NumberValidationDirective,
    TextOnlyDirective,
    AlphanumricDirective
  ],
  exports: [RadioGroupDirectiveDirective, SkeletonLoadingDirective, FormatNumberDirective, NumberValidationDirective,TextOnlyDirective,AlphanumricDirective],
  imports: [

    // AppModule
  ]
})
export class CustomDirectiveModule {
}
