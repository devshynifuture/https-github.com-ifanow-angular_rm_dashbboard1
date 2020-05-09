// import DialogContainerComponent from ''
import {NgModule} from '@angular/core';
// import { LiabilityrightComponent } from './component/customer/accounts/liabilities/liabilityright/liabilityright.component';
import {RadioGroupDirectiveDirective} from './radio-group-directive.directive';
import {CustomRightAnimationDirective} from './custom-right-animation.directive';
import {FormatNumberDirective} from 'src/app/format-number.directive';
import {SkeletonLoadingDirective} from './skeleton-loading.directive';
import {AlphaNumericDirective, CodeTextDirective, Formatter, NumberOnlyDirective, TextOnlyDirective} from './number-only.directive';
import {InputValueValidationDirective} from './input-value-validation.directive';
import {OwnerDirective} from './owner.directive';
import {ClientSearchDirective} from 'src/app/component/protect-component/AdviserComponent/transactions/client-search.directive';
import {OwnerNomineeDirective} from './owner-nominee.directive';
import {FileDragDropDirective} from './file-drag-drop.directive';
import {BankAccountDirective} from './bank-account.directive';
import {CustomAutocompleteDirective} from './custom-autocomplete.directive';
import {DematOwnerNomineeDirective} from './demat-owner-nominee.directive';
import {PrefixFocusDirective} from './prefix-focus.directive';

// import {AppModule} from "../app.module";

export const directiveList = [
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
  ClientSearchDirective,
  OwnerNomineeDirective,
  FileDragDropDirective,
  BankAccountDirective,
  CustomAutocompleteDirective,
  DematOwnerNomineeDirective,
  PrefixFocusDirective
];

@NgModule({
  declarations: directiveList,
  exports: directiveList,
  imports: []
})
export class CustomDirectiveModule {
}
