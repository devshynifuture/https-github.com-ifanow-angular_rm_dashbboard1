import { EventService } from './../../../../../Data-service/event.service';
import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { MyIfaSelectArnRiaComponent } from '../my-ifa-select-arn-ria/my-ifa-select-arn-ria.component';
import { MatDialog } from '@angular/material';
import { UpperSliderBackofficeComponent } from '../../common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { SupportService } from '../../support.service';
import { SettingsService } from '../../../AdviserComponent/setting/settings.service';

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
  dataSource4 = [{}, {}, {}];

  displayedColumns5: string[] = ['invoice', 'sentDate', 'status', 'dueDate', 'amount', 'balance'];
  dataSource5 = ELEMENT_DATA5;
  ifasData: any;
  getOverview: any;
  franklineData: any;
  cams: any;
  karvy: any;
  isLoading: boolean = false;
  hasError: boolean = false;

  isComponentLoaded = {
    recon: true,
    suggestion: false,
    tickets: false,
    teamMember: false,
    billing: false,
    misc: false,
  }


  constructor(public subInjectService: SubscriptionInject,
    public dialog: MatDialog,
    private eventService: EventService,
    public utilsService: UtilService,
    private settingsService: SettingsService,
    private supportService: SupportService) { }

  isInEditMode: boolean = false;
  reconSummaryList;
  ngOnInit() {
    this.getReconSummaryList();
  }
  @Input() set data(data) {
    this.ifasData = data;
  }

  toggleEditMode() {
    this.isInEditMode = !this.isInEditMode;
  }

  getReconSummaryList() {
    this.isLoading = true
    let obj =
    {
      advisorId: this.ifasData.adminAdvisorId,
    }
    this.supportService.getMyIFAReconSummary(obj).subscribe(
      data => {
        console.log('editStageComment', data);
        if (data) {
          this.isLoading = false
          this.reconSummaryList = data
          this.franklineData = data.FRANKLIN_TEMPLETON
          this.cams = data.CAMS
          this.karvy = data.KARVY
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  getCancelSubscriptionData() {

  }
  getSuggestionsData() {

  }
  getTicketList() {

  }
  getTicketSummary() {

  }

  getBillingDetails() {

  }
  openUpperSliderBackoffice(flag, data) {
    const fragmentData = {
      flag: "clients",
      id: 1,
      data,
      direction: 'top',
      componentName: UpperSliderBackofficeComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();

        }
      }
    );

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



  getTeamMembers() {
    this.utilsService.loader(1);
    this.hasError = false;
    const dataObj = {
      advisorId: this.ifasData.adminAdvisorId
    };
    this.settingsService.getTeamMembers(dataObj).subscribe((res) => {
      this.utilsService.loader(-1);
      this.isComponentLoaded.teamMember = true;
      console.log('team member details', res);
      this.dataSource4 = res || [];
    }, err => {
      this.utilsService.loader(-1);
      this.eventService.openSnackBar(err, "Dismiss");
      this.hasError = true;
    });
  }

  loadSection(index) {
    switch (index) {
      case 1:
        if (!this.isComponentLoaded.suggestion) {
          this.getSuggestionsData()
        }
        break;
      case 2:
        if (!this.isComponentLoaded.tickets) {
          this.getTicketSummary()
        }
        break;

      case 3:
        if (!this.isComponentLoaded.teamMember) {
          this.getTeamMembers()
        }
        break;

      case 3:
        if (!this.isComponentLoaded.billing) {
        }
        break;

      case 3:
        if (!this.isComponentLoaded.misc) {
        }
        break;

    }
  }



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

