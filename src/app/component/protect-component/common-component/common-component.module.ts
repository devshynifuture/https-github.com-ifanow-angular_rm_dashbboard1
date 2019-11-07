import {NgModule} from '@angular/core';
import {SubscriptionModule} from "../AdviserComponent/Subscriptions/subscription.module";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DialogContainerComponent} from "../../../common/dialog-container/dialog-container.component";
import {MaterialModule} from "../../../material/material";
import {BrowserModule} from "@angular/platform-browser";
import {FroalaComponent} from "./froala/froala.component";
import {FroalaEditorModule} from "angular-froala-wysiwyg";

@NgModule({
  declarations: [
    FroalaComponent, ConfirmDialogComponent],
  exports: [FroalaComponent, ConfirmDialogComponent],
  imports: [
    MaterialModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule,
    // AppModule
  ]
})
export class CommonComponentModule {
}
