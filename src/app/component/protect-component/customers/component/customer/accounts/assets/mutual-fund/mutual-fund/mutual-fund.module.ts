import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomDirectiveModule} from '../../../../../../../../../common/directives/common-directive.module';
import {MaterialModule} from 'src/app/material/material';
import {TableVirtualScrollModule} from 'ng-table-virtual-scroll';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CustomCommonModule} from 'src/app/common/custom.common.module';
import {MutualFundRoutingModule} from './mutual-fund-routing.module';


@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CustomDirectiveModule,
        TableVirtualScrollModule,
        ScrollingModule,
        CustomCommonModule,
        MutualFundRoutingModule

    ],
    exports: []
})
export class MutualFundModule { }
