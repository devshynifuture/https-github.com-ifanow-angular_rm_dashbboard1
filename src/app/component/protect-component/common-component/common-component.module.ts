import {NgModule} from '@angular/core';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material/material';
import {FroalaComponent} from './froala/froala.component';
import {FroalaEditorModule} from 'angular-froala-wysiwyg';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    FroalaComponent, ConfirmDialogComponent],
  exports: [FroalaComponent, ConfirmDialogComponent],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule,
    // AppModule
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class CommonComponentModule {
}
