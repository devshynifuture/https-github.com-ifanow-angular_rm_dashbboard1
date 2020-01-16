import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountsDocumentsRoutingModule} from './accounts-documents-routing.module';
import {AccountsDocumentsComponent} from './accounts-documents.component';
import {CustomerDocumentsComponent} from '../customer-documents/customer-documents.component';
import {MaterialModule} from 'src/app/material/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DocumentExplorerComponent} from '../documents/document-explorer.component';
import {CustomDirectiveModule} from 'src/app/common/directives/common-directive.module';


@NgModule({
  declarations: [AccountsDocumentsComponent, DocumentExplorerComponent, CustomerDocumentsComponent],
  imports: [
    CommonModule,
    AccountsDocumentsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ]
})
export class AccountsDocumentsModule { }
