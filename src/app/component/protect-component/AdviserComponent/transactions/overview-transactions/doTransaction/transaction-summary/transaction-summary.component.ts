import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProcessTransactionService } from '../process-transaction.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { PlatformPopUpComponent } from '../platform-pop-up/platform-pop-up.component';
import { EuinSelectPopUpComponent } from '../euin-select-pop-up/euin-select-pop-up.component';
import { BankSelectPopUpComponent } from '../bank-select-pop-up/bank-select-pop-up.component';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss']
})
export class TransactionSummaryComponent implements OnInit {
  selectedPlatform
  selectedInvestor: any;
  showInvestor = false;
  showbank = false
  investorList: void;
  inputData: any;
  isViewInitCalled: any;
  selectedFamilyMember: any;
  platformType
  transactionSummary: any;
  defaultCredential: any;
  defaultClient: any;
  allData: any;
  clientDataList: any;
  bankDetails: any;
  achMandateNSE: any;
  showBankEdit = false;
  showEuin = false
  value: any;
  element: any;
  subBrokerCredList: any;
  platForm = [{
    value: 1,
    platform: 'NSE'
  }, {
    value: 2,
    platform: 'BSE'
  }]
  checkAlert: any;
  constructor(private onlineTransact: OnlineTransactionService, private processTransaction: ProcessTransactionService,
    private subInjectService: SubscriptionInject, public dialog: MatDialog,private customerService: CustomerService, private eventService: EventService,) { }
  showPlatform = false;
  @Output() defaultDetails = new EventEmitter();
  @Output() bankDetailsSend = new EventEmitter();
  @Output() achmandateDetails = new EventEmitter();
  @Input() set folioChange(data) {
    console.log('This is Input data of foolio ### ', data);
  }
  @Input() set data(data) {
    this.inputData = data;
    this.transactionSummary = data
    console.log('This is Input data of FixedDepositComponent ', data);
    this.getDefaultDetails(this.transactionSummary.aggregatorType);
    this.checkAlert = this.transactionSummary.tpUserCredentialId
   
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.investorList = this.processTransaction.getIINList()
    console.log('iinList == ', this.investorList)
    this.transactionSummary = this.inputData
    console.log('transactionSummary', this.transactionSummary)
    this.getDefaultDetails(null);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '470px',
      data: { investor: this.clientDataList, animal: this.element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.element = result;
      this.selectedInvestor = result
      this.defaultClient = result
      this.allData.defaultClient = this.selectedInvestor
      this.defaultDetails.emit(this.allData);
    });
  }
  openEuin(): void {
    const dialogRef = this.dialog.open(EuinSelectPopUpComponent, {
      width: '470px',
      data: { subBroker: this.subBrokerCredList, animal: this.element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.element = result;
      this.allData.euin = result
      this.defaultDetails.emit(this.allData);
    });
  }
  openPlatform(): void {
    const dialogRef = this.dialog.open(PlatformPopUpComponent, {
      width: '470px',
      data: { platform: this.platForm, animal: this.element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.element = result;
      this.selectedPlatform = result.value
      this.showPlatform = false
      this.getDefaultDetails(this.selectedPlatform)
    });
  }
  openBank(): void {
    const dialogRef = this.dialog.open(BankSelectPopUpComponent, {
      width: '470px',
      data: { bank: this.bankDetails, animal: this.element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.element = result;
      this.bankDetailsSend.emit(result);
    });
  }
  getBankDetails() {
    let obj = {
      tpUserCredFamilyMappingId: this.defaultClient.tpUserCredFamilyMappingId
    }
    this.onlineTransact.getBankDetailsNSE(obj).subscribe(
      data => this.getBankDetailsNSERes(data)
    );
  }
  getBankDetailsNSERes(data) {
    console.log('bank res', data)
    this.bankDetails = data
    this.bankDetailsSend.emit(this.bankDetails);
    if (this.bankDetails.length > 1) {
      this.showBankEdit = true
    }

  }
  getNSEAchmandate() {
    let obj1 = {
      tpUserCredFamilyMappingId: this.defaultClient.tpUserCredFamilyMappingId
    }
    this.onlineTransact.getNSEAchmandate(obj1).subscribe(
      data => this.getNSEAchmandateRes(data)
    );
  }
  getNSEAchmandateRes(data) {
    console.log('getNSEAchmandateRes', data)
    this.achMandateNSE = data[0]
    this.achmandateDetails.emit(this.bankDetails);
  }
  selectBank(bank) {
    this.bankDetailsSend.emit(bank);
  }
  selectUmrn(umrn) {
    this.achmandateDetails.emit(umrn);
  }

  getDefaultDetails(platform) {
    let obj = {
      advisorId: 414,
      familyMemberId: 112166,
      clientId: 53637,
      aggregatorType: platform,
      mutualFundId: this.transactionSummary.mutualFundId
    }
    this.onlineTransact.getDefaultDetails(obj).subscribe(
      data => this.getDefaultDetailsRes(data)
    );
  }
  getDefaultDetailsRes(data) {
    console.log('deault', data)
    if (data == undefined) {
      return
    }
    if(this.checkAlert && this.checkAlert != data.defaultClient.tpUserCredentialId){
      this.alertModal(data,null)
    }
    data.euin = data.subBrokerCredList[0];
    this.defaultDetails.emit(data);
    this.allData = data
    this.clientDataList = data.clientDataList
    this.defaultCredential = data.defaultCredential
    this.defaultClient = data.defaultClient
    this.subBrokerCredList = data.subBrokerCredList
    this.selectedPlatform = this.defaultCredential.aggregatorType
    if (this.selectedPlatform == 1) {
      this.getBankDetails()
    }
  }
  alertModal(value, data) {
    const dialogData = {
      data: value,
      header: 'ALERT',
      body: 'Holding nature of selected FOLIO matches different client code',
      body2: 'Are you sure you want to proceed',
      btnYes: 'NO',
      btnNo: 'OK,POCEED',
      positiveMethod: () => {        
          this.customerService.deleteFixedDeposite(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Sucessfully changed', 'dismiss');
              dialogRef.close();
              
            },
            error => this.eventService.showErrorMessage(error)
          );
      },
      negativeMethod: () => {
        console.log('');
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
