import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProcessTransactionService } from '../process-transaction.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { MatDialog } from '@angular/material';
import { PlatformPopUpComponent } from '../platform-pop-up/platform-pop-up.component';
import { EuinSelectPopUpComponent } from '../euin-select-pop-up/euin-select-pop-up.component';
import { BankSelectPopUpComponent } from '../bank-select-pop-up/bank-select-pop-up.component';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { UmrnPopUpComponent } from '../umrn-pop-up/umrn-pop-up.component';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss']
})
export class TransactionSummaryComponent implements OnInit {
  selectedPlatform;
  selectedInvestor: any;
  showInvestor = false;
  showbank = false;
  inputData: any;
  isViewInitCalled: any;
  selectedFamilyMember: any;
  platformType;
  transactionSummary: any;
  defaultCredential: any;
  defaultClient: any;
  allData: any;
  clientDataList: any;
  bankDetails: any;
  achMandateNSE: any;
  showBankEdit = false;
  showEuin = false;
  value: any;
  element: any;
  subBrokerCredList: any;
  platForm = [{
    value: 1,
    platform: 'NSE'
  }, {
    value: 2,
    platform: 'BSE'
  }];
  checkAlert: any;
  changeDetails: any;
  advisorId: any;

  constructor(private onlineTransact: OnlineTransactionService, private processTransaction: ProcessTransactionService,
    private subInjectService: SubscriptionInject, public dialog: MatDialog,
    private customerService: CustomerService, private eventService: EventService, ) {
  }

  showPlatform = false;

  @Output() defaultDetails = new EventEmitter();
  @Output() bankDetailsSend = new EventEmitter();
  @Output() folioChange = new EventEmitter();

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.inputData = data;
    this.transactionSummary = data;
    console.log('This is Input data of TransactionSummaryComponent ', data);
    this.getDefaultDetails(this.transactionSummary.aggregatorType);
    this.checkAlert = this.transactionSummary.tpUserCredFamilyMappingId;
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.transactionSummary = this.inputData;
    console.log('transactionSummary', this.transactionSummary);
    // this.getDefaultDetails(null);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '470px',
      data: { investor: this.clientDataList, animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == undefined) {
        return;
      }
      this.element = result;
      this.selectedInvestor = result;
      this.defaultClient = result;
      this.allData.defaultClient = this.selectedInvestor;
      this.defaultDetails.emit(this.allData);
    });
  }

  openEuin(): void {
    const dialogRef = this.dialog.open(EuinSelectPopUpComponent, {
      width: '750px',
      data: { subBroker: this.subBrokerCredList, brokerCode: this.defaultClient.brokerCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return;
      }
      console.log('The dialog was closed');
      this.element = result;
      this.allData.euin = result;
      this.defaultDetails.emit(this.allData);
    });
  }

  openPlatform(): void {
    this.showPlatform = false;
    const dialogRef = this.dialog.open(PlatformPopUpComponent, {
      width: '467px',
      data: { platform: this.platForm, animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == undefined) {
        this.showPlatform = false;
        return;
      }
      this.element = result;
      this.selectedPlatform = (result == undefined) ? this.selectedPlatform : result.value;
      this.showPlatform = false;
      this.getDefaultDetails(this.selectedPlatform);
    });
  }

  openBank(): void {
    const dialogRef = this.dialog.open(BankSelectPopUpComponent, {
      width: '470px',
      data: { bank: this.bankDetails, animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return;
      }
      console.log('The dialog was closed');
      this.element = result;
      this.bankDetailsSend.emit(result);
    });
  }

  openUmrn(): void {
    this.getMandateDetails();
    const dialogRef = this.dialog.open(UmrnPopUpComponent, {
      width: '470px',
      data: { mandate: this.achMandateNSE, animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return;
      }
      console.log('The dialog was closed');
      this.element = result;
      this.bankDetailsSend.emit(result);
    });
  }

  getMandateDetails() {
    const obj1 = {
      tpUserCredFamilyMappingId: this.defaultClient.tpUserCredFamilyMappingId
    };
    this.onlineTransact.getMandateDetails(obj1).subscribe(
      data => this.getMandateDetailsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getMandateDetailsRes(data) {
    console.log('getNSEAchmandateRes', data);
    this.achMandateNSE = data;
  }

  getBankDetails() {
    const obj = {
      tpUserCredFamilyMappingId: this.defaultClient.tpUserCredFamilyMappingId
    };
    this.onlineTransact.getBankDetailsNSE(obj).subscribe(
      data => this.getBankDetailsNSERes(data), (error) => {
        this.getBankDetailsNSERes(null);
        // this.eventService.showErrorMessage(error);
      }
    );
  }

  getBankDetailsNSERes(data) {
    console.log('bank res', data);
    this.bankDetails = data;
    this.bankDetailsSend.emit(this.bankDetails);
    if (this.bankDetails.length > 1) {
      this.showBankEdit = true;
    }

  }

  selectBank(bank) {
    this.bankDetailsSend.emit(bank);
  }

  getDefaultDetails(platform) {
    console.log('transactionSummaryComponent transactionSummary: ', this.transactionSummary);

    const obj = {
      advisorId: this.advisorId,
      familyMemberId: this.transactionSummary.familyMemberId,
      clientId: this.transactionSummary.clientId,
      aggregatorType: platform,
      mutualFundId: this.transactionSummary.mutualFundId
    };
    this.onlineTransact.getDefaultDetails(obj).subscribe(
      data => this.getDefaultDetailsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getDefaultDetailsRes(data) {
    console.log('deault', data);
    if (data == undefined) {
      return;
    }
    this.changeDetails = data;
    if (this.transactionSummary.allEdit == true && this.changeDetails.noAlert == undefined) {
      if (this.checkAlert && this.checkAlert != data.defaultClient.tpUserCredFamilyMappingId) {
        this.alertModal(data, null);
        return;
      }
    }
    data.euin = data.subBrokerCredList[0];
    if (this.allData && this.allData.defaultClient && data.defaultClient
      && data.defaultClient.tpUserCredFamilyMappingId == this.allData.defaultClient.tpUserCredFamilyMappingId) {
      if (data.euin) {
        if (data.euin.id == this.allData.euin.id) {
        } else {
          this.defaultDetails.emit(data);
        }
      } else {
        // Ignore as it would be RIA
      }
    } else {
      this.defaultDetails.emit(data);
    }
    this.allData = data;
    this.clientDataList = data.clientDataList;
    this.defaultCredential = data.defaultCredential;
    this.defaultClient = data.defaultClient;
    this.subBrokerCredList = data.subBrokerCredList;
    this.selectedPlatform = this.defaultCredential.aggregatorType;
    if (this.selectedPlatform == 1) {
      this.getBankDetails();
    }
  }

  alertModal(value, data) {
    const dialogData = {
      data: '',
      header: 'Are you sure ?',
      body: 'Holding nature of selected folio matches different client code',
      body2: 'Are you sure you want to proceed ?',
      btnYes: 'NO',
      btnNo: 'OK, PROCEED',
      positiveMethod: () => {
        this.eventService.openSnackBar('Holding nature changed sucessfully', 'Dismiss');
        this.changeDetails.noAlert = true;
        this.getDefaultDetailsRes(this.changeDetails);
        dialogRef.close();
      },
      negativeMethod: () => {
        console.log('');
        this.folioChange.emit(this.bankDetails);
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
