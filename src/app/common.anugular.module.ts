import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {SubscriptionModule} from "./component/protect-component/AdviserComponent/Subscriptions/subscription.module";
import {MaterialModule} from "./material/material";
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [
  ],
  imports: [
    MaterialModule,
    SubscriptionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class CustomCommonModule {
}
