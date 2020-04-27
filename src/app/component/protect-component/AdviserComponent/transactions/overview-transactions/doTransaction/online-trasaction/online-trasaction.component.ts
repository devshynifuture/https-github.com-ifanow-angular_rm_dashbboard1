import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {AuthService} from 'src/app/auth-service/authService';
import {EventService} from 'src/app/Data-service/event.service';
import {ProcessTransactionService} from '../process-transaction.service';
import {Router} from '@angular/router';
import {IinUccCreationComponent} from '../../IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';

@Component({
  selector: 'app-online-trasaction',
  templateUrl: './online-trasaction.component.html',
  styleUrls: ['./online-trasaction.component.scss']
})
export class OnlineTrasactionComponent implements OnInit {

  formStep = 'step-1';
  investorsArray: string[] = [
    'Rahul Jain',
    'ajdbvkja'
  ];

  isSaveAndAddClicked = false;

  transactionAddForm: FormGroup = this.fb.group({
    selectInvestor: [, Validators.required],
    transactionType: [, Validators.required],
    schemeSelection: [,],
    investor: [,],
    folioSelection: [,],
    employeeContry: [,],
    investmentAccountSelection: [,],
    modeOfPaymentSelection: [,],
    bankAccountSelection: [,],

  });
  selectedDiv = 'div1';
  familyMemberId: any;
  ownerName: any;
  nomineesListFM: any = [];
  ownerData: any;
  dataSource: any;
  inputData: any;
  isViewInitCalled: any;
  selectedFamilyMember: any;
  advisorId: any;
  checkFamilyMem: any;
  selectedPlatform: any;
  defaultClient: any;
  defaultCredential: any;
  allData: any;
  credentialList: any;
  getPlatformCount: any;
  showSpinnerOwner = false;
  ownerNameQuery = '';
  familyMemberData: any;
  noSubBroker = false;
  noMapping = false;
  transactionType: any;
  transactionData: any;
  clientCodeData: any;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
              private eventService: EventService, private fb: FormBuilder,
              private processTransaction: ProcessTransactionService, private router: Router) {
  }

  @Input()
  set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.inputData = data;
    console.log('This is Input data of Online Transaction Component ', data);

    if (this.isViewInitCalled) {
      this.getdataForm(data);
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.clientCodeData = {};
    this.getdataForm(this.inputData);
    // this.getDefaultDetails(null)
  }

  getDefaultDetails(platform) {
    console.log('onlineTransactionComponent platform: ', platform);

    const obj = {
      advisorId: this.advisorId,
      familyMemberId: platform.familyMemberId,
      clientId: platform.clientId,
      // aggregatorType: platform
    };

    this.onlineTransact.getDefaultDetails(obj).subscribe(
      data => this.getDefaultDetailsRes(data)
    );
  }

  getDefaultDetailsRes(data) {
    console.log('deault', data);
    if (data == undefined) {
      return;
    } else {
      if (data.defaultCredential != undefined) {
        this.noSubBroker = false;
        if (data.defaultClient == undefined) {
          this.noMapping = true;
        } else {
          this.noMapping = false;
        }
      } else {
        this.noSubBroker = true;
      }
    }
    this.showData(data);
    // this.allData = data
    // this.credentialList = data.credentialList
    // this.getPlatformCount = data.credentialList.filter(function (ele) {
    //   return ele.id
    // })
    // console.log('platform count', this.getPlatformCount)
    // this.defaultCredential = data.defaultCredential
    // this.defaultClient = data.defaultClient
    // this.selectedPlatform = this.defaultCredential.aggregatorType
  }

  showData(value) {
    if (this.nomineesListFM && this.transactionAddForm.get('ownerName').valid) {
      // this.nomineesListFM.forEach(element => {
      //   this.checkFamilyMem = element.name.includes(this.transactionAddForm.controls.ownerName.value)
      // });
      if (this.formStep == 'step-1') {
        // if (this.allData && this.allData.length > 0) {
        //   this.formStep = 'step-2';
        // }
        if (this.noMapping == false && this.noSubBroker == false) {
          this.formStep = 'step-2';
        }
      } else if (this.transactionAddForm.get('transactionType').valid && this.formStep == 'step-2' && this.transactionType != undefined) {
        const data = {
          selectedFamilyMember: this.ownerData.ownerName.value,
          transactionType: this.transactionAddForm.controls.transactionType.value,
          clientId: this.familyMemberData.clientId,
          familyMemberId: this.familyMemberData.familyMemberId
        };
        this.openPurchaseTransaction(data.transactionType, data);
      }

    }
  }

  noMapFunction() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
    this.router.navigate(['/admin/transactions/investors']);
  }

  noBroakerFun() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
    this.router.navigate(['/admin/transactions/settings/manage-credentials/arn-ria-creds']);

  }

  // getFamilyList(value) {
  //   this.showSpinnerOwner = true
  //   let obj = {
  //     advisorId: this.advisorId,
  //     name: value
  //   }
  //   if (value.length > 2) {
  //     this.onlineTransact.getFamilyMemberList(obj).subscribe(
  //       data => this.getFamilyMemberListRes(data),
  //       err => this.eventService.openSnackBar(err, 'Dismiss')
  //     );
  //   }
  // }
  // getFamilyMemberListRes(data) {
  //   this.showSpinnerOwner = false
  //   if (data == undefined) {

  //   } else {
  //     this.nomineesListFM = data.familyMembers
  //   }
  //   console.log('getFamilyMemberListRes', data)
  // }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

  ownerList(value) {
    if (value == '') {
      this.ownerNameQuery = '';
      this.showSpinnerOwner = false;
    } else {
      this.ownerNameQuery = value;
      this.showSpinnerOwner = true;
    }
  }

  ownerDetails(value) {
    this.familyMemberData = value;
    this.familyMemberId = value.id;
    this.getDefaultDetails(value);
    this.ownerDetail();
  }

  ownerDetail() {

    const obj = {
      clientId: this.familyMemberData.clientId,
      advisorId: this.familyMemberData.advisorId,
      familyMemberId: this.familyMemberData.familyMemberId,
      // tpUserCredentialId: 292
    };
    this.onlineTransact.getClientCodes(obj).subscribe(
      data => {
        console.log(data);
        this.clientCodeData = data;
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  lisNominee(value) {
    this.showSpinnerOwner = false;
    if (value == null) {
      this.transactionAddForm.get('ownerName').setErrors({setValue: 'family member does not exist'});
      this.transactionAddForm.get('ownerName').markAsTouched();
    }
    console.log(value);
    this.nomineesListFM = Object.assign([], value);
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
    this.selectedFamilyMember = this.ownerData.ownerName.value;
  }

  getFormControl(): any {
    return this.transactionAddForm.controls;
  }

  openPurchaseTransaction(value, data) {
    this.transactionType = value;
    this.transactionData = data;
    // const fragmentData = {
    //   flag: 'addNsc',
    //   data,
    //   id: 1,
    //   state: 'open65',
    //   componentName: (value == 'PURCHASE') ? PurchaseTrasactionComponent : (value == 'REDEMPTION') ? RedemptionTransactionComponent : (value == 'SIP') ? SipTransactionComponent : (value == 'SWP') ? SwpTransactionComponent : (value == 'STP') ? StpTransactionComponent : (value == 'SWITCH') ? SwitchTransactionComponent : ''
    // };
    // const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
    //   sideBarData => {
    //     console.log('this is sidebardata in subs subs : ', sideBarData);
    //     if (UtilService.isDialogClose(sideBarData)) {
    //       if (UtilService.isRefreshRequired(sideBarData)) {
    //         // this.getNscSchemedata();
    //         console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
    //       }
    //       rightSideDataSub.unsubscribe();
    //     }

    //   }
    // );
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

  getResponse(data) {
    this.formStep = data;
    this.transactionType = undefined;
  }

  openNewCustomerIIN() {
    this.close();
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

  saveAndNext() {
    if (!this.clientCodeData) {
      return;
    }
    console.log(this.formStep);
    if (this.nomineesListFM && this.transactionAddForm.get('ownerName').valid) {
      this.nomineesListFM.forEach(element => {
        this.checkFamilyMem = element.name.includes(this.transactionAddForm.controls.ownerName.value);
      });
      if (this.formStep == 'step-1' == this.checkFamilyMem == true) {
        if (this.allData && this.allData.length > 0) {
          this.formStep = 'step-2';
        }
        this.formStep = 'step-2';
      } else if (this.transactionAddForm.get('transactionType').valid && this.formStep == 'step-2') {
        const data = {
          selectedFamilyMember: this.ownerData.ownerName.value,
          transactionType: this.transactionAddForm.controls.transactionType.value,
          clientId: this.familyMemberData.clientId,
          familyMemberId: this.familyMemberData.familyMemberId
        };
        this.openPurchaseTransaction(data.transactionType, data);
      } else {
        this.eventService.openSnackBar('Please select transaction type', 'Ok');
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
