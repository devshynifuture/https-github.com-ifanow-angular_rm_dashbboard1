import { Component, OnInit } from '@angular/core';
import { SubscriptionPopupComponent } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/subscription-popup/subscription-popup.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EditTaxComputationComponent } from './edit-tax-computation/edit-tax-computation.component';

@Component({
  selector: 'app-texes-plan',
  templateUrl: './texes-plan.component.html',
  styleUrls: ['./texes-plan.component.scss']
})
export class TexesPlanComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'symbol', 'icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'symbol', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  constructor(public subInjectService: SubscriptionInject, ) { }

  ngOnInit() {
  }
  openIncome(value) {
    const fragmentData = {
      flag: value,
      id: 1,
      state: 'open',
      componentName: EditTaxComputationComponent
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ');
          // this.getQuotationsList();
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  // weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: "A.   Income from salary / pension", name: '8,50,000', symbol: '8,50,000' },
  { position: "B.   Income (Profits) from business / profession", name: '8,50,000', symbol: '8,50,000' },
  { position: "C.   Income / Loss from house property", name: '8,50,000', symbol: '8,50,000' },
  { position: "D.   Income from capital gains", name: '8,50,000', symbol: '8,50,000' },
  { position: "E.   Income from other sources", name: '8,50,000', symbol: '8,50,000' },
  { position: "F.   Total income	", name: '8,50,000', symbol: '8,50,000' },
  { position: "G.  Eligible deductions", name: '8,50,000', symbol: '8,50,000' },
  { position: "H.  Total taxable income (F - G)	", name: '8,50,000', symbol: '8,50,000' },
  { position: "A.   Income from salary / pension", name: '8,50,000', symbol: '8,50,000' },
  { position: "A.   Income from salary / pension", name: '8,50,000', symbol: '8,50,000' },


];
export interface PeriodicElement1 {
  name: string;
  position: string;
  // weight: string;
  symbol: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: "Income exempt", name: '8,50,000', symbol: '8,50,000' },
  { position: "5% tax slab", name: '8,50,000', symbol: '8,50,000' },
  { position: "20% tax slab", name: '8,50,000', symbol: '8,50,000' },
  { position: "30% tax slab", name: '8,50,000', symbol: '8,50,000' },
  { position: "Income taxable at special rates", name: '8,50,000', symbol: '8,50,000' },
  { position: "Total	", name: '8,50,000', symbol: '8,50,000' },
  { position: "Add surcharge", name: '8,50,000', symbol: '8,50,000' },
  { position: "Add Health & Education Cess		", name: '8,50,000', symbol: '8,50,000' },
  { position: "Gross tax liability", name: '8,50,000', symbol: '8,50,000' },
  { position: "Income tax payable / (-) refund", name: '8,50,000', symbol: '8,50,000' },


];
