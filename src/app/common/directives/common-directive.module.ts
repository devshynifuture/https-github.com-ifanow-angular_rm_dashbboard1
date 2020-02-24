// import DialogContainerComponent from ''
import { NgModule } from '@angular/core';
// import { LiabilityrightComponent } from './component/customer/accounts/liabilities/liabilityright/liabilityright.component';
import { RadioGroupDirectiveDirective } from './radio-group-directive.directive';
import { CustomRightAnimationDirective } from './custom-right-animation.directive';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { SkeletonLoadingDirective } from './skeleton-loading.directive';
import {
  AlphaNumericDirective,
  CodeTextDirective,
  Formatter,
  NumberOnlyDirective,
  TextOnlyDirective
} from './number-only.directive';
import { InputValueValidationDirective } from './input-value-validation.directive';
import { OwnerDirective } from './owner.directive';
import { ClientSearchDirective } from 'src/app/component/protect-component/AdviserComponent/transactions/client-search.directive';

// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    RadioGroupDirectiveDirective,
    CustomRightAnimationDirective,
    SkeletonLoadingDirective,
    FormatNumberDirective,
    TextOnlyDirective,
    NumberOnlyDirective,
    AlphaNumericDirective,
    CodeTextDirective,
    Formatter,
    InputValueValidationDirective,
    OwnerDirective,
    ClientSearchDirective
  ],
  exports: [RadioGroupDirectiveDirective, SkeletonLoadingDirective, FormatNumberDirective, NumberOnlyDirective,
    AlphaNumericDirective, CodeTextDirective, TextOnlyDirective, Formatter, InputValueValidationDirective, OwnerDirective, ClientSearchDirective],
  imports: [

    // AppModule
  ]
})
export class CustomDirectiveModule {
}
