import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { PurchaseTrasactionComponent } from '../purchase-trasaction/purchase-trasaction.component';
import { UtilService } from 'src/app/services/util.service';
import { RedemptionTransactionComponent } from '../redemption-transaction/redemption-transaction.component';
import { SwitchTransactionComponent } from '../switch-transaction/switch-transaction.component';

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

  constructor(private subInjectService: SubscriptionInject,
    private fb: FormBuilder) {
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
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }

  getdataForm(data) {
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
      componentName: (value == 'PURCHASE') ? PurchaseTrasactionComponent : (value == 'REDEMPTION') ? RedemptionTransactionComponent :(value == 'SIP') ? SwitchTransactionComponent:(value == 'SWP') ? RedemptionTransactionComponent:(value == 'STP') ? PurchaseTrasactionComponent:(value == 'SWITCH') ? SwitchTransactionComponent : ''
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
    // let obj = {
    //   'transactionType': value
    // }
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
  baackToSelectTransaction(){
    this.formStep = 'step-2';
  }
  saveAndNext() {
    console.log(this.formStep);
    if (this.transactionAddForm.get('ownerName').valid) {
      if (this.formStep == 'step-1') {
        this.formStep = 'step-2';
      } else if (this.transactionAddForm.get('transactionType').valid && this.formStep == 'step-2') {
        let data = {
          selectedFamilyMember: this.ownerData.ownerName.value,
          transactionType: this.transactionAddForm.controls.transactionType.value
        }
        this.openPurchaseTransaction(data.transactionType, data)
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
