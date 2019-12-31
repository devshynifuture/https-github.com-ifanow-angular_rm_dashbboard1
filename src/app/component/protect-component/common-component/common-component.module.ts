import { NgModule } from '@angular/core';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material';
import { FroalaComponent } from './froala/froala.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './error-page/error-page.component';
import { DataNotFoundComponent } from './data-not-found/data-not-found.component';

@NgModule({
  declarations: [
    FroalaComponent, ConfirmDialogComponent, ErrorPageComponent, DataNotFoundComponent],
  exports: [FroalaComponent, ConfirmDialogComponent],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    FroalaEditorModule,
    // AppModule
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class CommonComponentModule {
}
