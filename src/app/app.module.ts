/* tslint:disable:max-line-length */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth-service/authService';
import { HttpService } from './http-service/http-service';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { CustomFormInputComponent } from './common/custom-form-input/custom-form-input.component';
import { DialogComponent } from './component/dialog/dialog.component';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { BaseComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/base/base.component';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { CustomCommonModule } from './common/custom.common.module';
import { DatePipe } from '@angular/common';
import { MatExpansionModule, MatSortModule, MatTableModule } from '@angular/material';
// import { SubscriptionModule } from './component/protect-component/AdviserComponent/Subscriptions/subscription.module';
import { EmailEntryModule } from './component/protect-component/AdviserComponent/Email/email.entry.module';
import 'zone.js/dist/zone';
// import { SubscriptionUpperEntry } from './component/protect-component/AdviserComponent/Subscriptions/subscription-upper-entry-module';
import { FormTestComponent } from './test/form-test/form-test.component';
import { CustomDirectiveModule } from './common/directives/common-directive.module';
import { BackofficeDashboardComponent } from './component/protect-component/AdviserComponent/backOffice/backoffice-dashboard/backoffice-dashboard.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


@NgModule({
  declarations: [
    AppComponent,
    // ConfirmDialogComponent,
    DialogComponent,
    CustomFormInputComponent,
    BaseComponent,
    // RadioGroupDirectiveDirective,

    // DialogContainerComponent,
    // CustomDialogContainerComponent,
    // AddLiabilitiesComponent,
    // AddInsuranceComponent
    FormTestComponent,
    BackofficeDashboardComponent,

  ],
  imports: [
    // CalendarModule,
    // SubscriptionEntry,
    // SubscriptionUpperEntry,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatExpansionModule,
    ScrollDispatchModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MomentDateModule,
    MatSortModule,
    MatTableModule,
    SlimLoadingBarModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    // CloudinaryModule.forRoot(Cloudinary,
    //   {
    //     cloud_name: 'futurewise', upload_preset: 'ifanow_unsigned_logo', /*private_cdn: true,*/
    //     /* cname: 'futurewise.images.com'*/
    //   }),
    DragDropModule,

    CustomCommonModule,
    EmailEntryModule,
    AppRoutingModule,
    CustomDirectiveModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // AssetsModule,

    // SubscriptionUpperEntry
  ],
  providers: [
    AuthService,
    HttpService,
    DatePipe,
    // HttpCancelService,
    // { provide: HTTP_INTERCEPTORS, useClass: ManageHttpInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
  // entryComponents: [EntryComponentsModule.getComponentList(), AccountEntryModule.getComponentList(), PlanEntryModule.getComponentList()]
})
export class AppModule {
}
