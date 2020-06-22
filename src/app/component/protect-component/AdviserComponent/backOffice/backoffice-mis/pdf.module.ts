import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'src/app/material/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomDirectiveModule} from 'src/app/common/directives/common-directive.module';
import {TableVirtualScrollModule} from 'ng-table-virtual-scroll';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CustomCommonModule} from 'src/app/common/custom.common.module';
import { AssetsRoutingModule } from '../../../customers/component/customer/accounts/assets/assets-routing.module';
import { AssetsModule } from '../../../customers/component/customer/accounts/assets/assets.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    AssetsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    TableVirtualScrollModule,
    ScrollingModule,
    CustomCommonModule,
  ]
})

export class PdfModule { }
