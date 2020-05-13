import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomDirectiveModule } from '../../../../../../../../../common/directives/common-directive.module';
import { MaterialModule } from 'src/app/material/material';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { MutualFundsCapitalComponent } from './mutual-funds-capital/mutual-funds-capital.component';
import { MutualFundOverviewComponent } from './mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundSummaryComponent } from './mutual-fund-summary/mutual-fund-summary.component';
import { MutualFundAllTransactionComponent } from './mutual-fund-all-transaction/mutual-fund-all-transaction.component';
import { MutualFundUnrealizedTranComponent } from './mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';
import { MutualFundGoalLinkageComponent } from './mutual-fund-goal-linkage/mutual-fund-goal-linkage.component';
import { MutualFundComponent } from './mutual-fund.component';
import { MutualFundRoutingModule } from './mutual-fund-routing.module';


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
    exports: [
        MutualFundComponent,
        MutualFundsCapitalComponent,
        MutualFundOverviewComponent,
        MutualFundSummaryComponent,
        MutualFundAllTransactionComponent,
        MutualFundUnrealizedTranComponent,
        MutualFundGoalLinkageComponent,
    ]
})
export class MutualFundModule { }