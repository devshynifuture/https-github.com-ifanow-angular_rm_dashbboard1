import {UtilService} from '../../../../../services/util.service';
import {SubscriptionInject} from '../../Subscriptions/subscription-inject.service';
import {Component, OnInit} from '@angular/core';
import {OnlineTransactionComponent} from './doTransaction/online-transaction/online-transaction.component';
import {AuthService} from 'src/app/auth-service/authService';
import {EventService} from 'src/app/Data-service/event.service';
import {KnowYourCustomerComponent} from './know-your-customer/know-your-customer.component';
import {IinUccCreationComponent} from './IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import {AddMandateComponent} from './MandateCreation/add-mandate/add-mandate.component';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {HttpService} from 'src/app/http-service/http-service';
import {TransactionMobileViewComponent} from '../transaction-mobile-view/transaction-mobile-view.component';
import {MatDialog} from '@angular/material';
import {OnlineTransactionService} from '../online-transaction.service';
import {TransactionsHistoryComponent} from '../transactions-list/transactions-history/transactions-history.component';

@Component({
  selector: 'app-overview-transactions',
  templateUrl: './overview-transactions.component.html',
  styleUrls: ['./overview-transactions.component.scss']
})
export class OverviewTransactionsComponent implements OnInit {
  file: void;
  advisorId: any;
  finalStartDate: any;
  finalEndDate: any;
  errMessage: any;
  transactionCount: any;
  totalUccCount: any;
  totalInvestorWithoutMandate: any;
  isLoading = false;
  pendingCount: any;
  rejectCount: any;
  acceptCount: any;
  pendingTransaction: any;
  rejectionTransaction: any;
  doneTrasaction: any;
  percentageTrasact: any;
  transactionList: any;
  totalRejected: any;
  totalClientCode: any;
  totalClient: any;
  totalPending: any;
  totalPendingClient: any;
  isLoadingIIN: boolean = false;
  isLoadingMandate: boolean = false;


  constructor(public dialog: MatDialog, private subInjectService: SubscriptionInject,
              public eventService: EventService, private http: HttpService,
              private tranService: OnlineTransactionService) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.finalStartDate = UtilService.getStartOfTheDay(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7)).getTime();
    this.finalEndDate = UtilService.getEndOfDay(new Date()).getTime();
    this.getAllTransactionList();
    this.getMandate();
    this.getIInData();
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

  openMobileErrorCopyTransactionPopup() {
    const dialogRef = this.dialog.open(TransactionMobileViewComponent, {

      maxWidth: '100vw',
      width: '90%',
      // panelClass: 'custom-modalbox-error'
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openTransactionHistory(data) {
    const fragmentData = {
      flag: 'addNewTransaction',
      data,
      state: 'open35',
      componentName: TransactionsHistoryComponent,
    };
    this.subInjectService.changeNewRightSliderState(fragmentData);
  }

  openNewTransaction() {
    const fragmentData = {
      flag: 'addNewTransaction',
      data: null,
      id: 1,
      state: 'open65',
      componentName: OnlineTransactionComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAllTransactionList();
            this.transactionList = undefined;
          }
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }


  openNewCustomer() {
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: KnowYourCustomerComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

  }

  openMandate(data) {
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
        rightSideDataSub.unsubscribe();
      }
    );
  }

  getAllTransactionList() {
    this.isLoading = true;
    // this.transactionList = [
    //   { transactionType: undefined, aggregatorType: undefined, amtUnitType: undefined, amount: undefined, orderDate: undefined, schemeName: undefined, clientName: undefined, status: undefined },
    //   { transactionType: undefined, aggregatorType: undefined, amtUnitType: undefined, amount: undefined, orderDate: undefined, schemeName: undefined, clientName: undefined, status: undefined },
    //   { transactionType: undefined, aggregatorType: undefined, amtUnitType: undefined, amount: undefined, orderDate: undefined, schemeName: undefined, clientName: undefined, status: undefined }
    // ]
    const obj = {
      advisorId: this.advisorId,
      tpUserCredentialId: null,
      startDate: this.finalStartDate,
      endDate: this.finalEndDate
    };
    this.tranService.getSearchScheme(obj).subscribe(
      data => {
        this.isLoading = false;
        this.transactionList = data;
        this.transactionCount = data.length;
        this.pendingTransaction = data.filter(data => data.status == 2);
        this.rejectionTransaction = data.filter(data => data.status == 7);
        this.doneTrasaction = data.filter(data => data.status == 6 || data.status == 8);
        this.doneTrasaction = this.doneTrasaction.length;
        if (this.doneTrasaction == undefined) {
          this.doneTrasaction = [];
        } else {
          this.percentageTrasact = ((this.doneTrasaction / this.transactionCount) * 100);
          this.percentageTrasact = (this.percentageTrasact).toFixed(2);
        }
        this.pendingTransaction = this.rejectionTransaction.length;
        this.rejectionTransaction = this.rejectionTransaction.length;

      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        //  this.errMessage = err.error.message;
      }
    );
  }

  getMandate() {
    this.isLoadingMandate = true;
    const obj = {
      advisorId: this.advisorId,
    };
    this.tranService.getOverviewMandate(obj).subscribe(
      data => {
        this.isLoadingMandate = false;
        this.totalInvestorWithoutMandate = data.totalInvestorWithoutMandate;
        data.statusList.forEach(element => {
          if (element.status == 1) {
            this.pendingCount = element.count;
          } else if (element.status == 2) {
            this.acceptCount = element.count;
          } else if (element.status == 3) {
            this.rejectCount = element.count;
          }
        });
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        // this.errMessage = err.error.message;
      }
    );
  }

  //     totalInvestorWithoutMandate: 589
  // statusList: Array(4)
  // 0: {count: 4, status: 0}
  // 1: {count: 38, status: 1}
  // 2: {count: 1, status: 2}
  // 3: {count: 1, status: 3}
  //   }
  getIInData() {
    this.isLoadingIIN = true;
    const obj = {
      advisorId: this.advisorId,
    };
    this.tranService.getIINUCCOverview(obj).subscribe(
      data => {
        this.isLoadingIIN = false;
        this.totalUccCount = data.length;
        this.totalPending = data.totalPending;
        this.totalClient = data.totalClient;
        this.totalClientCode = data.totalClientCode;
        this.totalPendingClient = data.totalPendingClient;
        this.totalRejected = data.totalRejected;
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        // this.errMessage = err.error.message;
      }
    );
  }

  openNewCustomerIIN() {
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: IinUccCreationComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

  }


  soapCall() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://www.bsestarmf.in/StarMFFileUploadService/StarMFFileUploadService.svc/Secure', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/soap+xml; charset=utf-8; action=http://tempuri.org/IStarMFFileUploadService/GetPassword');
    const sr =
      `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFFileUploadService">
      <soap:Header/>
      <soap:Body>
         <tem:GetPassword>
            <tem:Param>
               <star:MemberId>19798</star:MemberId>
               <star:Password>india.2020</star:Password>
               <star:UserId>1979802</star:UserId>
            </tem:Param>
         </tem:GetPassword>
      </soap:Body>
   </soap:Envelope>`;

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          const xml = xmlhttp.responseXML;
          // Here I'm getting the value contained by the <return> node.
          const response_number = parseInt(xml.getElementsByTagName('return')[0].childNodes[0].nodeValue);
          // Print result square number.
        }
      }
    };
    // Send the POST request.
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.responseType = 'document';
    xmlhttp.send(sr);
  }

  uploadFile(file) {
    this.file = file.target.files[0];
    this.nseUpload(this.file);
  }

  nseUpload(file) {


    const BASE_NSE_URL = 'https://www.nsenmf.com/';
    const fileuploadurl = BASE_NSE_URL + 'NMFIIImageUpload/ImageUpload/UPLOADIMG';
    const fileName = file;

    const params = new HttpParams()

      .set('BrokCode', 'ARN-15348')
      .set('Appln_id', 'MFS15348')
      .set('Password', 'ju7w0cp2')
      .set('CustomerID', '5011864918')
      .set('ImageType', 'AC')
      .set('ImageFormat', 'TIF')
      .set('RefNo', '8000504');

    const httpOptions = {
      headers: new HttpHeaders()
        .set('Access-Control-Allow-Origin', '*'),

      params: params,
      body: file

    };
    this.http.post(fileuploadurl, fileName, httpOptions).subscribe((responseData) => {

    });
  }
}
