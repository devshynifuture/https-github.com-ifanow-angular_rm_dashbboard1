import { NgModule } from '@angular/core';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material';
import { FroalaComponent } from './froala/froala.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './error-page/error-page.component';
import { DataNotFoundComponent } from './data-not-found/data-not-found.component';
// import {PhotoUploadComponent} from './photo-upload/photo-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
// import { OwnerNomineeComponent } from './owner-nominee/owner-nominee.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { ReplaceUserComponent } from './replace-user/replace-user.component';
import { AddNumberComponent } from '../PeopleComponent/people/Component/people-clients/add-client/add-number/add-number.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MobileViewAddNumberComponent } from './mobile-view-add-number/mobile-view-add-number.component';
import { DeleteProgressButtonComponent } from 'src/app/common/delete-progress-button/delete-progress-button.component';
import { MultipleEmailAddressComponent } from './multiple-email-address/multiple-email-address.component';

@NgModule({
  declarations: [DeleteProgressButtonComponent,
    FroalaComponent, ConfirmDialogComponent, ErrorPageComponent, DataNotFoundComponent, ImageCropperComponent, WelcomePageComponent, ReplaceUserComponent, AddNumberComponent, ResetPasswordComponent, MobileViewAddNumberComponent, MultipleEmailAddressComponent],
  exports: [FroalaComponent, ConfirmDialogComponent, ImageCropperComponent, ReplaceUserComponent, AddNumberComponent, ResetPasswordComponent, MobileViewAddNumberComponent, MultipleEmailAddressComponent],
  imports: [
    MaterialModule,
    CommonModule,
    ImageCropperModule,
    FormsModule,
    NgxMatSelectSearchModule,
    CustomCommonModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    FroalaEditorModule,
    FileUploadModule,
    CustomDirectiveModule,

    // AppModule
  ],
  entryComponents: [DeleteProgressButtonComponent, ConfirmDialogComponent, ImageCropperComponent, ReplaceUserComponent, AddNumberComponent, ResetPasswordComponent, MultipleEmailAddressComponent]
})
export class CommonComponentModule {
}
