import {NgModule} from '@angular/core';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material/material';
import {FroalaComponent} from './froala/froala.component';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {CommonModule} from '@angular/common';
import {ErrorPageComponent} from './error-page/error-page.component';
import {DataNotFoundComponent} from './data-not-found/data-not-found.component';
// import {PhotoUploadComponent} from './photo-upload/photo-upload.component';
import {FileUploadModule} from 'ng2-file-upload';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
// import { OwnerNomineeComponent } from './owner-nominee/owner-nominee.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { ReplaceUserComponent } from './replace-user/replace-user.component';
import { AddNumberComponent } from '../PeopleComponent/people/Component/people-clients/add-client/add-number/add-number.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';

@NgModule({
  declarations: [
    FroalaComponent, ConfirmDialogComponent, ErrorPageComponent, DataNotFoundComponent, ImageCropperComponent, WelcomePageComponent, ReplaceUserComponent, AddNumberComponent],
  exports: [FroalaComponent, ConfirmDialogComponent, ImageCropperComponent, ReplaceUserComponent, AddNumberComponent],
  imports: [
    MaterialModule,
    CommonModule,
    ImageCropperModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    FroalaEditorModule,
    FileUploadModule,
    CustomDirectiveModule,

    // AppModule
  ],
  entryComponents: [ConfirmDialogComponent, ImageCropperComponent, ReplaceUserComponent, AddNumberComponent]
})
export class CommonComponentModule {
}
