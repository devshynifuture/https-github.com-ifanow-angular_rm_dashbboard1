import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  [x: string]: any;

  displayedColumns = ['no', 'expense', 'date', 'desc','mode','amt','icons'];
  dataSource = ELEMENT_DATA;

  constructor(private subInjectService: SubscriptionInject) { }
  viewMode
  ngOnInit() {
    this.viewMode="tab1"
  }

  addExpenses(flagValue){
    const fragmentData = {
      Flag: flagValue,
      id: 1,
      state: 'openHelp'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
    
        }
      }
    );
  }


}
export interface PeriodicElement {
  no: string;
  expense: string;
  date:string;
  desc: string;
  mode: string;
  amt:string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {no: "1", expense: 'Groceries', date: "27/09/2019", desc: '-',mode:"Cash",amt:"4,600"},
  {no: "2", expense: 'Driver’s salary', date: "27/09/2019", desc: 'IIN/RFND/I-Debit/Make My',mode:"Cash",amt:"4,600"},
  {no: "3", expense: 'School fees', date: "27/09/2019", desc: '-',mode:"Cash",amt:"4,600"},
  {no: "4", expense: 'Dining out', date: "27/09/2019", desc: '-',mode:"Cash",amt:"4,600"},
  {no: "5", expense: 'Groceries', date: "27/09/2019", desc: '-',mode:"Cash",amt:"4,600"},
];


