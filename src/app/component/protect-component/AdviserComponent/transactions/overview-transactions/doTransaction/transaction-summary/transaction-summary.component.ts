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
  defaultBank: any;

  constructor(private onlineTransact: OnlineTransactionService, private processTransaction: ProcessTransactionService,
    private subInjectService: SubscriptionInject, public dialog: MatDialog,
    private customerService: CustomerService, private eventService: EventService, ) {
  }

  showPlatform = false;

  @Output() defaultDetails = new EventEmitter();
  @Output() bankDetailsSend = new EventEmitter();
  @Output() folioChange = new EventEmitter();

  @Input() set data(data) {
    this.advisorId = AuthService.getAdminAdvisorId();
    this.inputData = data;
    this.transactionSummary = data;
    // this.getDefaultDetails(this.transactionSummary.aggregatorType);
    if (this.transactionSummary.defaultBank && this.transactionSummary.aggregatorType == 2) {
      this.bankDetails = this.transactionSummary.bankDetails
      this.defaultBank = this.transactionSummary.defaultBank
      this.transactionSummary.selectedMandate = this.defaultBank
    }
    this.changeDetails = this.inputData.changeDetails
    if (this.changeDetails) {
      this.allData = this.changeDetails;
      this.changeDetails.euin = this.changeDetails.subBrokerCredList[0];
      if (this.allData && this.allData.defaultClient && this.changeDetails.defaultClient
        && this.changeDetails.defaultClient.tpUserCredFamilyMappingId == this.allData.defaultClient.tpUserCredFamilyMappingId) {
        if (this.changeDetails.euin) {
          if (this.changeDetails.euin.id == this.allData.euin.id) {
          } else {
            this.defaultDetails.emit(this.changeDetails);
          }
        } else {
        }
      } else {
        this.defaultDetails.emit(data);
      }
      this.clientDataList = this.changeDetails.clientDataList;
      this.defaultCredential = this.changeDetails.defaultCredential;
      this.defaultClient = this.changeDetails.defaultClient;
      this.transactionSummary.defaultClient = this.changeDetails.defaultClient;
      this.subBrokerCredList = this.changeDetails.subBrokerCredList;
      this.selectedPlatform = this.defaultCredential.aggregatorType;
      this.checkAlert = this.transactionSummary.tpUserCredFamilyMappingId;
      // if (this.selectedPlatform == 1) {
      //   this.getBankDetails();
      // }
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getBankDetails()
    this.transactionSummary = this.inputData;
    if (!this.changeDetails) {
      this.getDefaultDetails(null);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '470px',
      data: { investor: this.clientDataList, animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return;
      }
      this.element = result;
      this.selectedInvestor = result;
      this.defaultClient = result;
      this.allData.defaultClient = this.selectedInvestor;
      this.transactionSummary.defaultClient = result
      this.defaultDetails.emit(this.allData);
      if (this.selectedPlatform == 1) {
        this.getBankDetails();
      }
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

  openBank(bankDetails): void {
    const dialogRef = this.dialog.open(BankSelectPopUpComponent, {
      width: '470px',
      data: { bank: bankDetails, animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return;
      } else {
        this.defaultBank = result;
        if (this.transactionSummary.paymentMode == 2) {
          if (this.transactionSummary.acceptedMandate) {
            this.transactionSummary.acceptedMandate.forEach(element => {
              if (result.ifscCode == element.ifscCode) {
                this.bankDetailsSend.emit(result);
                this.transactionSummary.selectedMandate = element;
                this.transactionSummary.bankDetails = this.bankDetails;
              }
            });
          }
        } else {
          this.bankDetailsSend.emit(result);
          this.transactionSummary.bankDetails = this.bankDetails;
        }
      }
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
    if (data) {
      this.bankDetails = data;
      console.log('bank == ', this.bankDetails);
      this.transactionSummary.bankDetails = this.bankDetails
      if (this.transactionSummary.transactType == 'PURCHASE' || this.transactionSummary.transactType == 'SIP')
        if (this.selectedPlatform == 1) {
          this.getMandateDetails();
        }
      this.bankDetails.forEach(element => {
        if (element.defaultBankFlag == 'Y' || element.defaultBankFlag == 1) {
          this.defaultBank = element;
          element.selected = true;
        }
      });
      this.bankDetails.forEach(element => {
        element.selected = false;
      });
      // this.bankDetails[0].selected = true
      this.bankDetailsSend.emit(this.defaultBank);
      if (this.bankDetails.length > 1) {
        this.showBankEdit = true;
      }
    } else {
      this.eventService.openSnackBarNoDuration('No bank details found', 'DISMISS');
    }
  }

  selectBank(bank) {
    this.bankDetailsSend.emit(bank);
  }

  getDefaultDetails(platform) {

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
    if (data == undefined) {
      return;
    }
    console.log('default', data)
    this.changeDetails = data;
    this.transactionSummary.changeDetails = data
    this.selectedPlatform = data.defaultClient.aggregatorType
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
    this.transactionSummary.defaultClient = data.defaultClient;
    this.subBrokerCredList = data.subBrokerCredList;
    this.selectedPlatform = this.defaultCredential.aggregatorType;
    this.getBankDetails();
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
        this.folioChange.emit(this.bankDetails);
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
