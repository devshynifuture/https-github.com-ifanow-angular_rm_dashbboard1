import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material/material';
import {CustomHtmlComponent} from './custom-html.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    CustomHtmlComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
    // AppModule
  ],
  exports: [    CustomHtmlComponent]
})
export class CustomHtmlModule {
}
