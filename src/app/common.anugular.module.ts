import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import {SubscriptionModule} from "./component/protect-component/AdviserComponent/Subscriptions/subscription.module";
import {MaterialModule} from "./material/material";
import {BrowserModule} from "@angular/platform-browser";





@NgModule({
  declarations: [
  ],
  imports: [
    MaterialModule,
    SubscriptionModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class CustomCommonModule {
}
