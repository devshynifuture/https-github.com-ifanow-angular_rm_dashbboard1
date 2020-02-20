import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { MyIfaSelectArnRiaComponent } from '../my-ifa-select-arn-ria/my-ifa-select-arn-ria.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-ifas-details',
  templateUrl: './ifas-details.component.html',
  styleUrls: ['./ifas-details.component.scss']
})
export class IfasDetailsComponent implements OnInit {

  displayedColumns: string[] = ['arn', 'date', 'name', 'total', 'befor', 'after', 'aumbalance', 'transaction', 'report'];
  dataSource = ELEMENT_DATA;

  displayedColumnsOne: string[] = ['description', 'subscribedSince', 'fees', 'frequency', 'nextBilling'];
  dataSourceOne = ELEMENT_DATA_ONE;

  displayedColumnsTwo: string[] = ['type', 'description', 'gstOne', 'gstTwo', 'gstThree', 'gstFour',];
  dataSourceTwo = ELEMENT_DATA_TWO;

  displayedColumns3: string[] = ['ticket', 'subject', 'created', 'type', 'status', 'raised', 'assigned'];
  dataSource3 = ELEMENT_DATA3;

  displayedColumns4: string[] = ['name', 'email', 'mobile', 'role', 'lastlogin', 'status'];
  dataSource4 = ELEMENT_DATA4;

  displayedColumns5: string[] = ['invoice', 'sentDate', 'status', 'dueDate', 'amount', 'balance'];
  dataSource5 = ELEMENT_DATA5;



  constructor(public subInjectService: SubscriptionInject,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  openSelectArnRiaPopup() {

  }

  openSelectArnRiaDialog(data) {
    const Fragmentdata = {
      flag: data,
    };
    const dialogRef = this.dialog.open(MyIfaSelectArnRiaComponent, {
      width: '30%',
      data: Fragmentdata,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }


  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }


  // openFragment(flag, data) {
  //   this.location.replaceState('/subscription-upper');
  //   data.flag = flag
  //   console.log('hello mf button clicked');
  //   const fragmentData = {
  //     flag: 'clietns',
  //     id: 1,
  //     data,
  //     direction: 'top',
  //     componentName: SubscriptionUpperSliderComponent,
  //     state: 'open'
  //   };

  //   AuthService.setSubscriptionUpperSliderData(fragmentData);
  //   const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
  //     upperSliderData => {
  //       if (UtilService.isDialogClose(upperSliderData)) {

  //         subscription.unsubscribe();
  //       }
  //     }
  //   );
  // }





}
export interface PeriodicElement {
  arn: string;
  date: string;
  name: string;
  total: string;
  befor: string;
  after: string;
  aumbalance: string;
  transaction: string;
  report: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { arn: 'RIA-INA000004409', date: '08/01/20 11:28AM', name: 'Ankit Shah', total: '890', befor: '14', after: '8', aumbalance: '07/01/2020', transaction: '02/12/2019', report: '' },
  { arn: 'RIA-INA000004409', date: '08/01/20 11:28AM', name: 'Ankit Shah', total: '890', befor: '14', after: '8', aumbalance: '07/01/2020', transaction: '02/12/2019', report: '' },
];


export interface PeriodicElementOne {
  description: string;
  subscribedSince: string;
  fees: string;
  frequency: string;
  nextBilling: string;

}

const ELEMENT_DATA_ONE: PeriodicElementOne[] = [
  { description: 'RIA-INA000004409', subscribedSince: '08/01/20 11:28AM', fees: 'Ankit Shah', frequency: '890', nextBilling: '14' },

];



export interface PeriodicElementTwo {
  type: string;
  description: string;
  gstOne: string;
  gstTwo: string;
  gstThree: string;
  gstFour: string;

}

const ELEMENT_DATA_TWO: PeriodicElementTwo[] = [
  { type: 'Plan', description: 'White labeled mobile app', gstOne: '16,000', gstTwo: '18,880', gstThree: '4,800', gstFour: '5,664' },
  { type: 'Plan', description: 'White labeled mobile app asdasdsd asdlsahd sadsad', gstOne: '16,000', gstTwo: '18,880', gstThree: '4,800', gstFour: '5,664' },
  { type: 'Plan', description: 'Power Plan', gstOne: '16,000', gstTwo: '18,880', gstThree: '4,800', gstFour: '5,664' },

];



export interface PeriodicElement3 {
  ticket: string;
  subject: string;
  created: string;
  type: string;
  status: string;
  raised: string;
  assigned: string;

}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { ticket: '#22733', subject: 'Please merge the folio', created: '17/01/2020', type: 'Please merge the folio', status: 'Open', raised: 'Rinku', assigned: 'Satish Patel' },
  { ticket: '#22733', subject: 'Please merge the folio', created: '17/01/2020', type: 'How to create a team member?', status: 'Open', raised: 'Rinku', assigned: 'Satish Patel' },
  { ticket: '#22733', subject: 'Please merge the folio', created: '17/01/2020', type: 'Data mismatch', status: 'Open', raised: 'Rinku', assigned: 'Satish Patel' },
  { ticket: '#22733', subject: 'Please merge the folio', created: '17/01/2020', type: 'Demo on cash flow planning', status: 'Open', raised: 'Rinku', assigned: 'Satish Patel' },

];




export interface PeriodicElement4 {
  name: string;
  email: string;
  mobile: string;
  role: string;
  lastlogin: string;
  status: string;


}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member', lastlogin: '30 min ago', status: 'Active', },
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member', lastlogin: '30 min ago', status: 'Active', },
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member', lastlogin: '30 min ago', status: 'Active', },
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member', lastlogin: '30 min ago', status: 'Active', },

];





export interface PeriodicElement5 {
  invoice: string;
  sentDate: string;
  status: string;
  dueDate: string;
  amount: string;
  balance: string;



}

const ELEMENT_DATA5: PeriodicElement5[] = [
  { invoice: 'INV-19-20-104031', sentDate: 'atul@17/01/2020', status: 'Paid', dueDate: '17/01/2020', amount: '18,880', balance: '0', },
  { invoice: 'INV-19-20-104031', sentDate: 'atul@17/01/2020', status: 'Paid', dueDate: '17/01/2020', amount: '18,880', balance: '0', },
  { invoice: 'INV-19-20-104031', sentDate: 'atul@17/01/2020', status: 'Paid', dueDate: '17/01/2020', amount: '18,880', balance: '0', },
  { invoice: 'INV-19-20-104031', sentDate: 'atul@17/01/2020', status: 'Paid', dueDate: '17/01/2020', amount: '18,880', balance: '0', },


];

