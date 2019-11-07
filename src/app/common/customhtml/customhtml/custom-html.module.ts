import { NgModule } from '@angular/core';
import {SubscriptionModule} from "../../../component/protect-component/AdviserComponent/Subscriptions/subscription.module";
import {ConfirmDialogComponent} from "../../../component/protect-component/common-component/confirm-dialog/confirm-dialog.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DialogContainerComponent} from "../../dialog-container/dialog-container.component";
import {MaterialModule} from "../../../material/material";
import {BrowserModule} from "@angular/platform-browser";
import {CustomHtmlComponent} from "./custom-html.component";

@NgModule({
  declarations: [
    CustomHtmlComponent,
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
    // AppModule
  ],
  exports: [    CustomHtmlComponent]
})
export class CustomHtmlModule {
}
