import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material';
import { LoanAmortsComponent } from '../../customer/accounts/liabilities/loan-amorts/loan-amorts.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-liabilities-detail',
  templateUrl: './liabilities-detail.component.html',
  styleUrls: ['./liabilities-detail.component.scss']
})
export class LiabilitiesDetailComponent implements OnInit {
  // displayedColumns: string[] = ['name', 'position'];
  _data: any;
  dataSourceDetail = ELEMENT_DATA;
  ownerName: any;
  libility: any;

  // dataSource: any = new MatTableDataSource();
  // @ViewChild('epfListTable', {static: false}) holdingsTableSort: MatSort;
  // displayedColumns = ['no', 'date', 'bal', 'pay-time', 'pre-pay', 'total-pay', 'interest', 'principal', 'end-bal'];
  constructor(private subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    this.libility = this._data

  }

  get data() {
    return this._data;
  }
  ngOnInit() {
    console.log('AddLiabilitiesComponent ngOnInit : ', this._data);
    // this.dataSource.data = this._data.loanAmorts;
    // this.dataSource.sort = this.holdingsTableSort;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
  tableLoader:boolean=false;
  openLoanAmorts() {
    this.tableLoader=true;
    const fragmentData = {
      flag: "addLiabilitiesDetail",
      id: 1,
      data: this._data,
      state: 'open70',
      componentName: LoanAmortsComponent,
    };
    setTimeout(() => {
      const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
        sideBarData => {
          console.log('this is sidebardata in subs subs : ', sideBarData);
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 2: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }
      );
    }, 500);
    
  }

}

export interface PeriodicElement {
  name: string;
  position: string;

}
// advisorId: 0
// annualInterestRate: 0
// clientId: 0
// commencementDate: 1546214400000
// emi: 19244
// familyMemberId: 160023
// financialInstitution: "BCCB"
// frequencyOfPayments: 12
// id: 2
// loanAmorts: []
// loanAmount: 2300000
// loanPartPayments: [{…}]
// loanTenure: 120
// loanTypeId: 2
// maturityDate: 1574899200000
// outstandingAmount: "NaN"
// ownerName: "Manan"
// principalOutStandingAmount: 0
// principalOutstanding: false
// principalOutstandingAsOn: 0
// realEstateId: 0
// remainingMonths: 0
// totalCapitalPaid: "NaN"
// totalInterestPaid: "NaN"

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Owner', position: 'Rahul Jain'},
  {name: 'Loan type', position: 'LIC Jeevan Saral'},
  {name: 'Loan amount', position: '27,000'},
  {name: 'Loan outstanding', position: '8000'},
  {name: 'Tenure remaining', position: '5y 9m'},
  {name: 'Annual interest rate', position: '2.6%'},
  {name: 'EMI', position: '32,333'},
  {name: 'Financial institution', position: '20 years'},
  {name: 'Termination date', position: '23/09/2012'},
  {name: 'Original loan amount', position: '40,000,000'},
  {name: 'Original loan tenure', position: '20 years'},
  {name: 'Total interest paid till date', position: '46,546'},
  {name: 'Total principal paid till date', position: '54,654'},

];
