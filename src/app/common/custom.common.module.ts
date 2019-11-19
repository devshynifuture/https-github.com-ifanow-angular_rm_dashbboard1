import {NgModule} from '@angular/core';
import {DialogContainerComponent} from './dialog-container/dialog-container.component';
import {MaterialModule} from '../material/material';
import {SubscriptionModule} from '../component/protect-component/AdviserComponent/Subscriptions/subscription.module';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AccountModule} from '../component/protect-component/customers/component/customer/accounts/account.module';

// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    // ConfirmDialogComponent,
    DialogContainerComponent
  ],
  imports: [
    MaterialModule,
    SubscriptionModule,
    AccountModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // AppModule
  ],
  exports: [DialogContainerComponent]
})
export class CustomCommonModule {
}
