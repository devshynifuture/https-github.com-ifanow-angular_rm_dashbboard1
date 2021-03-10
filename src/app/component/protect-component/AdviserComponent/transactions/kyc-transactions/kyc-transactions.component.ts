import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { AddNewAllKycComponent } from './add-new-all-kyc/add-new-all-kyc.component';
import { OnlineTransactionService } from '../online-transaction.service';
import { PeopleService } from '../../../PeopleComponent/people.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-kyc-transactions',
  templateUrl: './kyc-transactions.component.html',
  styleUrls: ['./kyc-transactions.component.scss']
})
export class KycTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'email', 'kycStatus', 'actions'];
  dataSource = new MatTableDataSource();
  isLoading: boolean;
  advisorId: any;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('clientTableSort', { static: false }) clientTableSort: MatSort;
  hasEndReached = false;
  infiniteScrollingFlag: boolean;
  finalClientList: any;
  constructor(private eventService: EventService,
    private utilService: UtilService, private subInjectService: SubscriptionInject
    , public dialog: MatDialog,
    private tranService: OnlineTransactionService,
    private peopleService: PeopleService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}]
    this.getKycTransactionList(0);
  }

  getKycTransactionList(offset) {
    const obj = {
      // advisorId: this.advisorId,
      advisorId: this.advisorId,
      offset: offset,
      limit: 20
    }
    this.tranService.getKycListData(obj).subscribe(
      data => {
        this.isLoading = false;
        console.log(data)
        if (data && data.length > 0) {
          data = this.formatEmailAndMobile(data);
          data = data.filter(element => !(!element.email || !element.mobileNo || !element.pan) && element.familyMemberId != 2);
          this.finalClientList = this.finalClientList ? this.finalClientList.concat(data) : data;
          this.dataSource.data = this.finalClientList;
          this.hasEndReached = false;
          this.infiniteScrollingFlag = false;
        } else {
          this.isLoading = false;
          this.infiniteScrollingFlag = false;
          this.dataSource.data = (this.finalClientList.length > 0) ? this.finalClientList : [];
        }
      }, err => {
        this.dataSource.data = [];
        this.isLoading = false;
      }
    )
  }

  onWindowScroll(e: any) {
    if (this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop <= (e.target.scrollTop + e.target.offsetHeight + 200)) {
      if (!this.hasEndReached) {
        this.infiniteScrollingFlag = true;
        this.hasEndReached = true;
        this.getKycTransactionList(this.dataSource.data.length);
      }

    }
  }

  formatEmailAndMobile(data) {
    data.forEach((singleData) => {
      singleData['isLoader'] = false;
      if (singleData.mobileList && singleData.mobileList.length > 0) {
        singleData.mobileNo = singleData.mobileList[0].mobileNo;
      }
      if (singleData.emailList && singleData.emailList.length > 0) {
        singleData.email = singleData.emailList[0].email;
      }
    });
    return data;
  }


  kycAdvisorSectionMethod(elementData) {
    elementData.isLoader = true;
    const hostNameOrigin = window.location.origin;
    const obj = {
      name: elementData.name,
      clientId: elementData.clientId,
      email: elementData.email,
      mobileNo: elementData.mobileNo,
      redirectUrl: `${hostNameOrigin}/kyc-redirect`
    }
    if (elementData.kycComplaint != 0) {
      obj['redo'] = true;
    }
    this.peopleService.sendKYCLink(obj).subscribe(
      data => {
        elementData.isLoader = false;
        elementData.kycComplaint = 2;
        this.eventService.openSnackBar("Email sent sucessfully", "Dismiss");
      }, err => {
        elementData.isLoader = false;
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }


  openAddAllkyc(data, flag) {
    data['btnFlag'] = 'Cancel';
    const fragmentData = {
      flag,
      data,
      id: 1,
      state: 'open50',
      componentName: AddNewAllKycComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getBSECredentials();
            // data ? data.kycComplaint = 2 : '';
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  status: string;
  email: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Sagar Shroff PMS', name: 'Sagar Shroff', weight: 'ALWPG5809L', symbol: '+91 9887458745',
    email: 'sagar@futurewise.co.in', status: 'Verified '
  },

];