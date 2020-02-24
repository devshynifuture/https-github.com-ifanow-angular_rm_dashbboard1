import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { PurchaseTrasactionComponent } from '../purchase-trasaction/purchase-trasaction.component';
import { UtilService } from 'src/app/services/util.service';
import { RedemptionTransactionComponent } from '../redemption-transaction/redemption-transaction.component';
import { SwitchTransactionComponent } from '../switch-transaction/switch-transaction.component';
import { SipTransactionComponent } from '../sip-transaction/sip-transaction.component';
import { StpTransactionComponent } from '../stp-transaction/stp-transaction.component';
import { SwpTransactionComponent } from '../swp-transaction/swp-transaction.component';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ProcessTransactionService } from '../process-transaction.service';

@Component({
  selector: 'app-online-trasaction',
  templateUrl: './online-trasaction.component.html',
  styleUrls: ['./online-trasaction.component.scss']
})
export class OnlineTrasactionComponent implements OnInit {

  formStep: string = 'step-1';
  investorsArray: string[] = [
    'Rahul Jain',
    'ajdbvkja'
  ];

  isSaveAndAddClicked: boolean = false;

  transactionAddForm: FormGroup = this.fb.group({
    'selectInvestor': [, Validators.required],
    'transactionType': [, Validators.required],
    'schemeSelection': [,],
    'investor': [,],
    'folioSelection': [,],
    'employeeContry': [,],
    'investmentAccountSelection': [,],
    'modeOfPaymentSelection': [,],
    'bankAccountSelection': [,],

  })
  selectedDiv: string = 'div1';
  familyMemberId: any;
  ownerName: any;
  nomineesListFM: any;
  ownerData: any;
  dataSource: any;
  inputData: any;
  isViewInitCalled: any;
  selectedFamilyMember: any;
  advisorId: any;
  clientId: any;
  checkFamilyMem: any;
  selectedPlatform: any;
  defaultClient: any;
  defaultCredential: any;
  allData: any;
  credentialList: any;
  getPlatformCount: any;
  showSpinnerOwner = false
  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    private eventService: EventService, private fb: FormBuilder, private processTransaction: ProcessTransactionService) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      this.getdataForm(data);
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getdataForm(this.inputData)
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getDefaultDetails(null)
  }
  getDefaultDetails(platform) {
    let obj = {
      advisorId: 414,
      familyMemberId: 112166,
      clientId: 53637,
      aggregatorType: platform
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
    this.allData = data
    this.credentialList = data.credentialList
    this.getPlatformCount = data.credentialList.filter(function (ele) {
      return ele.id
    })
    console.log('platform count', this.getPlatformCount)
    this.defaultCredential = data.defaultCredential
    this.defaultClient = data.defaultClient
    this.selectedPlatform = this.defaultCredential.aggregatorType
  }
  getFamilyList(value) {
    this.showSpinnerOwner = true
    let obj = {
      advisorId: this.advisorId,
      name: value
    }
    if (value.length > 2) {
      this.onlineTransact.getFamilyMemberList(obj).subscribe(
        data => this.getFamilyMemberListRes(data)
      );
    }
  }
  getFamilyMemberListRes(data) {
    this.showSpinnerOwner = false
    if (data == undefined) {

    } else {
      this.nomineesListFM = data.familyMembers
    }
    console.log('getFamilyMemberListRes', data)
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }
  ownerDetails(value) {
    this.familyMemberId = value.id;
    if (this.nomineesListFM && this.transactionAddForm.get('ownerName').valid) {
      this.nomineesListFM.forEach(element => {
        this.checkFamilyMem = element.name.includes(this.transactionAddForm.controls.ownerName.value)
      });
      if (this.formStep == 'step-1' == this.checkFamilyMem == true) {
        if (this.allData && this.allData.length > 0) {
          this.formStep = 'step-2';
        }
        this.formStep = 'step-2';
      } else if (this.transactionAddForm.get('transactionType').valid && this.formStep == 'step-2') {
        let data = {
          selectedFamilyMember: this.ownerData.ownerName.value,
          transactionType: this.transactionAddForm.controls.transactionType.value
        }
        this.openPurchaseTransaction(data.transactionType, data)
      }
    }
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }

  getdataForm(data) {
    // this.formStep = data
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.transactionAddForm = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: [(!data) ? '' : data.schemeSelection, [Validators.required]],
      investor: [(!data) ? '' : data.investor, [Validators.required]],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      investmentAccountSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      folioSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });

    this.ownerData = this.transactionAddForm.controls;
    this.selectedFamilyMember = this.ownerData.ownerName.value
  }

  getFormControl(): any {
    return this.transactionAddForm.controls;
  }
  openPurchaseTransaction(value, data) {
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: 'open65',
      componentName: (value == 'PURCHASE') ? PurchaseTrasactionComponent : (value == 'REDEMPTION') ? RedemptionTransactionComponent : (value == 'SIP') ? SipTransactionComponent : (value == 'SWP') ? SwpTransactionComponent : (value == 'STP') ? StpTransactionComponent : (value == 'SWITCH') ? SwitchTransactionComponent : ''
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  selectTransactionType(value: string) {
    this.selectedDiv = value;
    this.transactionAddForm.controls.transactionType.setValue(value);

    console.log(this.transactionAddForm);
  }

  saveAndAddAnother() {
    this.isSaveAndAddClicked = true;
    console.log(this.transactionAddForm);
  }

  onAddTransaction() {
    console.log(this.transactionAddForm);
  }
  baackToSelectTransaction() {
    this.formStep = 'step-2';
  }
  saveAndNext() {
    console.log(this.formStep);
    if (this.nomineesListFM && this.transactionAddForm.get('ownerName').valid) {
      this.nomineesListFM.forEach(element => {
        this.checkFamilyMem = element.name.includes(this.transactionAddForm.controls.ownerName.value)
      });
      if (this.formStep == 'step-1' == this.checkFamilyMem == true) {
        if (this.allData && this.allData.length > 0) {
          this.formStep = 'step-2';
        }
        this.formStep = 'step-2';
      } else if (this.transactionAddForm.get('transactionType').valid && this.formStep == 'step-2') {
        let data = {
          selectedFamilyMember: this.ownerData.ownerName.value,
          transactionType: this.transactionAddForm.controls.transactionType.value
        }
        this.openPurchaseTransaction(data.transactionType, data)
      }else{
        this.eventService.openSnackBar("Please select atleast one transaction type", "Ok")
      }
    } else {
      if (this.formStep == 'step-1') {
        this.transactionAddForm.get('ownerName').markAsTouched();
      } else if (this.formStep === 'step-2') {
        this.transactionAddForm.get('transactionType').markAsTouched();
      } else if (this.formStep === 'step-3') {

      }
    }
  }
}
