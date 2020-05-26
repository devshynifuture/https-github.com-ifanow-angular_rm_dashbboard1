import {Component, OnInit, ViewChild} from '@angular/core';
import {OnlineTransactionService} from '../online-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from 'src/app/auth-service/authService';
import {MatSort, MatTableDataSource} from '@angular/material';
import {DetailedViewMandateComponent} from './detailed-view-mandate/detailed-view-mandate.component';
import {SubscriptionInject} from '../../Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {MandateCreationComponent} from '../overview-transactions/MandateCreation/mandate-creation/mandate-creation.component';
import {AddMandateComponent} from '../overview-transactions/MandateCreation/add-mandate/add-mandate.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-mandates-transactions',
  templateUrl: './mandates-transactions.component.html',
  styleUrls: ['./mandates-transactions.component.scss']
})
export class MandatesTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'bank', 'bankac', 'amt', 'type', 'status'];
  // dataSource = ELEMENT_DATA;
  advisorId: any;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  clientId: any;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  credentialData: any;
  noData: string;
  dontHide: boolean;
  isLoading = false;
  isAdvisorSection = true;

  constructor(private onlineTransact: OnlineTransactionService, private eventService: EventService,
              private subInjectService: SubscriptionInject, private router: Router) {
  }


  ngOnInit() {
    const routeName = this.router.url.split('/')[1];
    if (routeName == 'customer') {
      this.clientId = AuthService.getClientId();
      this.isAdvisorSection = false;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.getFilterOptionData();
    this.dontHide = true;
  }

  getFilterOptionData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getFilterOptionDataRes(data),
      err => {
        this.isLoading = false;
        this.noData = 'No credentials found';
        this.dataSource.data = [];
      }
    );
  }

  getFilterOptionDataRes(data) {

    if (data) {
      this.credentialData = data;
      this.getNSEAchmandate();
    } else {
      this.isLoading = false;
      this.dataSource.data = [];
      this.noData = 'No credentials found';
    }
    // this.filterData = TransactionEnumService.setPlatformEnum(data);
  }

  openTransaction() {
  }

  getNSEAchmandate() {
    this.dontHide = true;
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    const obj1 = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    };
    this.onlineTransact.getMandateDetails(obj1).subscribe(
      data => this.getMandateListRes(data), (error) => {
        this.isLoading = false;
        this.dataSource.data = [];
        // this.eventService.showErrorMessage(error);
        this.noData = 'No mandates found';
      }
    );
  }

  getMandateListRes(data) {
    console.log('mandate data : ', data);
    this.dontHide = true;
    this.isLoading = false;
    if (data && data.length > 0) {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource.data = [];
      this.noData = 'No mandates found';
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
    if (this.dataSource.filteredData.length == 0) {
      this.noData = 'No mandates found';
    }
  }

  openMandateDetails(data) {
    data.isAdvisorSection = this.isAdvisorSection;
    const fragmentData = {
      flag: 'detailPoTd',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedViewMandateComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.refresh(null);
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  ownerDetail() {

    // const obj = {
    //   clientId: this.familyMemberData.clientId,
    //   advisorId: this.familyMemberData.advisorId,
    //   familyMemberId: this.familyMemberData.familyMemberId,
    //   //tpUserCredentialId: 292
    // }
    // this.onlineTransact.getClientCodes(obj).subscribe(
    //   data => {
    //     this.clientCodeData = data;
    //   },
    //   err => this.eventService.openSnackBar(err, 'Dismiss')
    // );
  }

  refresh(flag) {
    this.dontHide = true;
    this.getNSEAchmandate();
  }

  openMandateClient(data) {
    const fragmentData = {
      flag: 'mandate',
      data,
      id: 1,
      state: 'open',
      componentName: AddMandateComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        if (UtilService.isRefreshRequired(sideBarData)) {

        }
      }
    );
  }

  openMandate(data) {
    // var data = this.clientCodeData
    const fragmentData = {
      flag: 'mandate',
      data,
      id: 1,
      state: 'open',
      componentName: MandateCreationComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        if (UtilService.isRefreshRequired(sideBarData)) {

        }
        rightSideDataSub.unsubscribe();
      }
    );
  }
}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  bank: string;
  bankac: string;
  amt: string;
  type: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'NSE', name: 'ARN-83865', weight: 'Rahul Jain', symbol: '5011102595', bank: 'ICICI Bank', bankac: '001101330032',
    amt: '50,000', type: 'E-Mandate', status: 'Approved'
  },

];
