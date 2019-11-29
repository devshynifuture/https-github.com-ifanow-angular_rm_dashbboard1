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

  displayedColumns4 = ['no', 'expense', 'budget', 'progress','spent','icons'];
  dataSource4 = ELEMENT_DATA4;

  constructor(private subInjectService: SubscriptionInject) { }
  viewMode
  ngOnInit() {
    this.viewMode="tab1"
  }

  
    openExpenses(value) {
      const fragmentData = {
        Flag:value,
        id: 1,
        state: 'open35'
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


export interface PeriodicElement4 {
  no: string;
  expense: string;
  budget:string;
  progress: string;
  spent: string;
  icons:string;

}

const ELEMENT_DATA4: PeriodicElement4[] = [
  {no: "1", expense: 'Groceries', budget: "49,000", progress: ' ', spent:"8,400", icons:''},
  {no: "2", expense: 'Transportation', budget: "8,000", progress: ' ', spent:"7,200", icons:''},
  {no: "3", expense: 'School fees', budget: "5,600", progress: ' ', spent:"5,600", icons:''},
  {no: "4", expense: 'Dining out', budget: "3,000", progress: ' ', spent:"3,700", icons:''},
  {no: "5", expense: 'Leisure & Entertainment', budget: "2,000", progress: ' ', spent:"0", icons:''},

];



