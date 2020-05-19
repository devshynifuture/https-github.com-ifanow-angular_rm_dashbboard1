import { EventService } from './../../../../../Data-service/event.service';
import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { MyIfaSelectArnRiaComponent } from '../my-ifa-select-arn-ria/my-ifa-select-arn-ria.component';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { UpperSliderBackofficeComponent } from '../../common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { SupportService } from '../../support.service';
import { ReconciliationService } from '../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { SettingsService } from '../../../AdviserComponent/setting/settings.service';

@Component({
  selector: 'app-ifas-details',
  templateUrl: './ifas-details.component.html',
  styleUrls: ['./ifas-details.component.scss']
})
export class IfasDetailsComponent implements OnInit {

  displayedColumns: string[] = ['arn', 'doneOn', 'name', 'total', 'befor', 'after', 'aumbalance', 'transaction', 'report'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  displayedColumnsOne: string[] = ['description', 'subscribedSince', 'fees', 'frequency', 'nextBilling'];
  dataSourceOne = new MatTableDataSource(ELEMENT_DATA_ONE);

  displayedColumnsTwo: string[] = ['type', 'description', 'gstOne', 'gstTwo', 'gstThree', 'gstFour',];
  dataSourceTwo = new MatTableDataSource(ELEMENT_DATA_TWO);

  displayedColumns3: string[] = ['ticket', 'subject', 'created', 'type', 'status', 'raised', 'assigned'];
  dataSource3 = new MatTableDataSource(ELEMENT_DATA3);

  displayedColumns4: string[] = ['name', 'email', 'mobile', 'role', 'lastlogin', 'status'];
  dataSource4 = new MatTableDataSource([{}, {}, {}]);

  displayedColumns5: string[] = ['invoice', 'sentDate', 'status', 'dueDate', 'amount', 'balance'];
  dataSource5 = new MatTableDataSource(ELEMENT_DATA5);
  ifasData: any;
  getOverview: any;
  franklineData = new MatTableDataSource(ELEMENT_RT_DATA);
  camsData = new MatTableDataSource(ELEMENT_RT_DATA);;
  karvyData = new MatTableDataSource(ELEMENT_RT_DATA);;
  isLoading: boolean = false;
  brokerList: any;
  brokerListCams: any;
  rtId: any;
  camsId: any;
  karvyId: any;
  franklinId: any;
  hasError: boolean;
  isComponentLoaded = {
    recon: true,
    suggestion: false,
    tickets: false,
    teamMember: false,
    billing: false,
    misc: false,
  }
  ticketList = new MatTableDataSource([{}, {}, {}]);
  openTickets: any;
  unResolved: any;
  onHold: any;


  constructor(public subInjectService: SubscriptionInject,
    public dialog: MatDialog,
    private eventService: EventService,
    private reconService: ReconciliationService,
    public utilsService: UtilService,
    private settingsService: SettingsService,
    private supportService: SupportService) { }

  isInEditMode: boolean = false;
  reconSummaryList;
  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;
  ngOnInit() {
    // this.utilsService.loader(0);
    this.getReconSummaryList();
    this.getRTList();
    this.getBrokerListData();

  }
  @Input() set data(data) {
    this.ifasData = data;
  }

  toggleEditMode() {
    this.isInEditMode = !this.isInEditMode;
  }

  getReconSummaryList() {
    // this.utilsService.loader(1)
    this.isLoading = true;
    let obj = {
      advisorId: this.ifasData.adminAdvisorId,
    }
    this.supportService.getMyIFAReconSummary(obj).subscribe(
      data => {
        this.isLoading = false;
        console.log('editStageComment', data);
        if (data) {
          // this.utilsService.loader(-1)
          this.reconSummaryList = data
          this.franklineData.data = data.FRANKLIN_TEMPLETON
          this.camsData.data = data.CAMS
          this.karvyData.data = data.KARVY
        } else {
          // this.utilsService.loader(-1);
          this.franklineData.data = null;
          this.camsData.data = null
          this.karvyData.data = null;
          this.eventService.openSnackBar("My IFA Recon Summary Not Found", "Dismiss")
        }
      }
      , err => {
        this.eventService.openSnackBar(err, "Dismiss")
        // this.utilsService.loader(-1);
      }
    )
  }
  getRTList() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        console.log("this is RT list:::::", res);
        res.forEach(element => {
          if (element.name === "CAMS") {
            this.camsId = element.id;
          }
          if (element.name === 'KARVY') {
            this.karvyId = element.id;
          }
          if (element.name === 'FRANKLIN_TEMPLETON') {
            this.franklinId = element.id;
          }
        });
      });
  }


  getBrokerListData() {
    this.reconService.getBrokerListValues({ advisorId: this.ifasData.adminAdvisorId })
      .subscribe(res => {
        if (res) {
          this.brokerList = res;
          console.log('broker list values:::', res);
        }
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
      });
  }

  getBrokerList(value) {
    this.rtId = value;
    if (value === this.franklinId) {
      this.franklineData['rmId'] = this.rmId;
      this.franklineData['advisorId'] = this.ifasData.adminAdvisorId;
      if (this.brokerList && this.brokerList.length !== 0) {
        this.openSelectArnRiaDialog(this.brokerList, this.franklineData, this.rtId)
      } else {
        this.eventService.openSnackBar('No Broker List Found For This User', "Dismiss");
      }
    } else if (value === this.camsId) {
      this.camsData['rmId'] = this.rmId;
      this.camsData['advisorId'] = this.ifasData.adminAdvisorId;
      if (this.brokerList && this.brokerList.length !== 0) {
        this.openSelectArnRiaDialog(this.brokerList, this.camsData, this.rtId)
      } else {
        this.eventService.openSnackBar('No Broker List Found For This User', "Dismiss");
      }
    } else if (value === this.karvyId) {
      this.karvyData['rmId'] = this.rmId;
      this.karvyData['advisorId'] = this.ifasData.adminAdvisorId;
      if (this.brokerList && this.brokerList.length !== 0) {
        this.openSelectArnRiaDialog(this.brokerList, this.karvyData, this.rtId);
      } else {
        this.eventService.openSnackBar('No Broker List Found For This User', "Dismiss");
      }

    }
  }
  getCancelSubscriptionData() {

  }
  getSuggestionsData() {

  }
  getTicketList() {

  }
  getTicketSummary() {
    // this.utilsService.loader(1);
    this.ticketList.data = [{}, {}, {}];
    this.isLoading = true;
    let obj = {
      rmId: this.rmId,
      advisorId: this.ifasData.adminAdvisorId
    }
    this.supportService.getTickets(obj)
      .subscribe(res => {
        console.log("this is ticket list::::", res);
        this.isLoading = false;
        if (res) {
          this.ticketList.data = res.listItems;
          this.onHold = res.onHold
          this.unResolved = res.unResolved
          this.openTickets = res.open
          // this.utilsService.loader(-1);
        } else {
          this.ticketList.data = null;
        }
      });
  }

  getBillingDetails() {

  }

  openUpperSliderBackoffice(flag, data, rtId) {
    const fragmentData = {
      flag,
      id: 1,
      data: {
        ...data,
        startRecon: flag === 'startRecon' ? true : (flag === 'report' ? false : null),
        rtId,
        flag
      },
      direction: 'top',
      componentName: UpperSliderBackofficeComponent,
      state: 'open'
    };

    console.log(fragmentData);
    // this.router.navigate(['/subscription-upper'])
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

  openSelectArnRiaDialog(data, value, rtId) {
    const Fragmentdata = {
      brokerCodeValue: data,
      mainData: value,
      rtId,
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
    // this.utilsService.loader(1);
    this.isLoading = true;
    this.hasError = false;
    const dataObj = {
      advisorId: this.ifasData.adminAdvisorId
    };
    this.settingsService.getTeamMembers(dataObj)
      .subscribe((res) => {
        this.isLoading = false;
        if (res) {
          this.isComponentLoaded.teamMember = true;
          console.log('team member details', res);
          this.dataSource4.data = res;
        } else {
          this.dataSource4.data = null;
        }
        // this.utilsService.loader(-1);
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
        this.hasError = true;
        // this.utilsService.loader(-1);
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

const ELEMENT_RT_DATA = [
  { arn: '', date: '', name: '', total: '', befor: '', after: '', aumbalance: '', transaction: '', report: '' },
  { arn: '', date: '', name: '', total: '', befor: '', after: '', aumbalance: '', transaction: '', report: '' },
  { arn: '', date: '', name: '', total: '', befor: '', after: '', aumbalance: '', transaction: '', report: '' }
]




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

