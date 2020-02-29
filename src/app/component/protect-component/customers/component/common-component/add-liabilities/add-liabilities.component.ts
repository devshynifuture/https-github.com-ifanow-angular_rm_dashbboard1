import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CustomerService } from '../../customer/customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { DataComponent } from '../../../../../../interfaces/data.component';
import { UtilService, ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-liabilities',
  templateUrl: './add-liabilities.component.html',
  styleUrls: ['./add-liabilities.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],

})
export class AddLiabilitiesComponent implements OnInit, DataComponent {
  validatorType = ValidatorType;
  productForm: FormGroup;
  show: boolean;
  showTransact: boolean;
  addLiabilityForm;
  isOwner: boolean;
  option: boolean;
  showSelect: any;
  advisorId: any;
  _data: any;
  ownerData: any;
  ownerName: any;
  selectedFamilyData: any;
  loanTypeView: any;
  clientId: any;
  nomineesListFM: any;
  maxDate = new Date();

  constructor(public utils: UtilService, private subInjectService: SubscriptionInject, private fb: FormBuilder,
    public custumService: CustomerService, public eventService: EventService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
  }
  get data() {
    return this._data;
  }

  ngOnInit() {
    this.show = false;
    this.showTransact = false;
    this.showSelect = false;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getLiability(this.data);
  }
  preventDefault(e) {
    e.preventDefault();
  }
  showMore() {
    this.show = true;
  }
  showLess() {
    this.show = false;
  }
  showAddTransact() {
    this.showTransact = true;
    if (this.transactEntries.length == 0) {
      this.transactEntries.push(this.fb.group({
        partPaymentDate: ['', [Validators.required]],
        partPayment: ['', [Validators.required]],
        option: ['', [Validators.required]]
      }));
    }
  }
  close(flag) {
    if (this.data) {
      if (this._data.loanTypeId == undefined) {
        // const data = this._data;
        const data = this.addLiabilityForm.get('loanType').value;
        this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: flag });
      } else {
        // const data = this._data.showFilter;
        const data = this.addLiabilityForm.get('loanType').value;
        this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: flag });
      }
    } else {
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
    }
  }
  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = '100';
      this.addLiabilityForm.get('interest').setValue(event.target.value);
    }
  }
  select(data) {
    this.showSelect = data.checked;
  }
  getFormControl() {
    return this.addLiabilityForm.controls;
  }
  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.selectedFamilyData = value;
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  getLiability(data) {
    if (data == undefined) {
      data = {};
    }
    this.addLiabilityForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      loanType: [(data.loanTypeId == undefined) ? '' : (data.loanTypeId) + '', [Validators.required]],
      loanAmount: [data.loanAmount, [Validators.required]],
      loanTenure: [data.loanTenure, [Validators.required]],
      outstandingCheck: [data.principalOutstanding],
      poDate: [(data.principalOutstandingAsOn) ? new Date(data.principalOutstandingAsOn) : '', [Validators.required]],
      outstandingAmt: [data.principalOutStandingAmount, [Validators.required]],
      CommencementDate: [new Date(data.commencementDate), [Validators.required]],
      emiFrequency: [(data.frequencyOfPayments == undefined) ? '' : (data.frequencyOfPayments) + '', [Validators.required]],
      interest: [data.annualInterestRate, [Validators.required]],
      emi: [data.emi],
      finInstitution: [data.financialInstitution],
      collateral: [],
      transact: this.fb.array([this.fb.group({
        partPaymentDate: ['', [Validators.required]],
        partPayment: ['', [Validators.required]],
        option: ['', [Validators.required]]
      })])
    });
    if (data.loanPartPayments != undefined) {
      this.showTransact = true;
      data.loanPartPayments.forEach(element => {
        this.addLiabilityForm.controls.transact.push(this.fb.group({
          partPaymentDate: [new Date(element.partPaymentDate), [Validators.required]],
          partPayment: [element.partPayment, Validators.required],
          option: [(element.option + ''), Validators.required],
          id: [(element.id + ''), Validators.required],
        }));
      });
      this.transactEntries.removeAt(0);
    }
    if (this.addLiabilityForm.controls.outstandingCheck.value == true) {
      this.showSelect = true;
    }
    this.getFormControl().loanAmount.maxLength = 20;
    this.getFormControl().loanTenure.maxLength = 20;
    this.getFormControl().interest.maxLength = 20;
    this.getFormControl().outstandingAmt.maxLength = 20;
    this.ownerData = this.addLiabilityForm.controls;
  }
  get transactEntries() {
    return this.addLiabilityForm.get('transact') as FormArray;
  }
  addTransaction() {
    this.transactEntries.push(this.fb.group({
      partPaymentDate: ['', [Validators.required]],
      partPayment: ['', [Validators.required]],
      option: ['', [Validators.required]]
    }));
  }
  removeTransaction(item) {
    if (this.transactEntries.length > 1) {
      this.transactEntries.removeAt(item);
    }
  }
  saveFormData() {
    if (this.addLiabilityForm.get('ownerName').invalid) {
      this.addLiabilityForm.get('ownerName').markAsTouched();
      return;
    } else if (this.addLiabilityForm.get('loanType').invalid) {
      this.addLiabilityForm.get('loanType').markAsTouched();
      return;
    } else if (this.addLiabilityForm.get('loanAmount').invalid) {
      this.addLiabilityForm.get('loanAmount').markAsTouched();
      return;
    } else if (this.addLiabilityForm.get('loanTenure').invalid) {
      this.addLiabilityForm.get('loanTenure').markAsTouched();
      return;
    } else if (this.addLiabilityForm.controls.outstandingCheck.touched == true && this.addLiabilityForm.get('poDate').invalid && this.addLiabilityForm.get('outstandingAmt').invalid) {
      this.addLiabilityForm.get('poDate').markAsTouched();
      this.addLiabilityForm.get('outstandingAmt').markAsTouched();
    } else if (this.addLiabilityForm.get('CommencementDate').invalid) {
      this.addLiabilityForm.get('CommencementDate').markAsTouched();
      return;
    } else if (this.addLiabilityForm.get('emiFrequency').invalid) {
      this.addLiabilityForm.get('emiFrequency').markAsTouched();
      return;
    } else if (this.addLiabilityForm.get('interest').invalid) {
      this.addLiabilityForm.get('interest').markAsTouched();
      return;
    } else {
      const obj = {
        ownerName: (this.ownerName == null) ? this.addLiabilityForm.controls.ownerName.value : this.ownerName,
        loanType: this.addLiabilityForm.controls.loanType.value,
        loanAmount: this.addLiabilityForm.controls.loanAmount.value,
        outstandingCheck: this.addLiabilityForm.controls.outstandingCheck.value,
        outstandingAmt: this.addLiabilityForm.controls.outstandingAmt.value,
        loanTenure: this.addLiabilityForm.controls.loanTenure.value,
        CommencementDate: this.addLiabilityForm.controls.CommencementDate.value,
        emiFrequency: this.addLiabilityForm.controls.emiFrequency.value,
        interest: this.addLiabilityForm.controls.interest.value,
        emi: this.addLiabilityForm.controls.emi.value,
        finInstitution: this.addLiabilityForm.controls.finInstitution.value,
        collateral: this.addLiabilityForm.controls.collateral.value,
        poDate: this.addLiabilityForm.controls.poDate.value,
        transactData: []
      };
      obj.loanAmount = parseInt(obj.loanAmount);
      obj.outstandingAmt = parseInt(obj.outstandingAmt);
      obj.loanTenure = parseInt(obj.loanTenure);
      obj.emi = parseInt(obj.emi);
      obj.loanTenure = parseInt(obj.loanTenure);
      obj.loanType = parseInt(obj.loanType);
      this.loanTypeView = obj.loanType;
      obj.emiFrequency = parseInt(obj.emiFrequency);
      obj.outstandingCheck = (obj.outstandingCheck) ? obj.outstandingCheck.toString() : null;
      obj.CommencementDate = obj.CommencementDate.toISOString().slice(0, 10);
      obj.poDate = (obj.poDate) ? obj.poDate.toISOString().slice(0, 10) : '';
      obj.interest = parseInt(obj.interest);
      this.addLiabilityForm.value.transact.forEach(element => {
        if (element) {
          let obj1 = {
            'partPaymentDate': (element.partPaymentDate) ? element.partPaymentDate.toISOString().slice(0, 10) : null,
            'partPayment': !element.partPayment?0 : parseInt(element.partPayment),
            'option': !element.option? 0 : parseInt(element.option),
            'id': element.id,
            'delete': true
          }
          if (this._data.id != undefined) {
            if (this._data.loanPartPayments.length == this.addLiabilityForm.value.transact.length) {
              delete obj1.delete;
            }
          }
          if (this._data == 'tab1') {
            delete obj1.id;
            delete obj1.delete;
          }
          obj.transactData.push(obj1);
        }
      });
      if (this._data.id == undefined) {
        const objToSend = {
          advisorId: this.advisorId,
          clientId: this.clientId,
          familyMemberId: this._data.familyMemberId,
          ownerName: obj.ownerName,
          loanTypeId: obj.loanType,
          loanAmount: obj.loanAmount,
          principalOutStandingAmount: obj.outstandingAmt,
          loanTenure: obj.loanTenure,
          commencementDate: obj.CommencementDate,
          principalOutstandingAsOn: obj.poDate,
          principalOutstanding: obj.outstandingCheck,
          frequencyOfPayments: obj.emiFrequency,
          annualInterestRate: obj.interest,
          financialInstitution: obj.finInstitution,
          loanPartPayments: obj.transactData
        };
        console.log('obj', obj);
        this.custumService.addLiability(objToSend).subscribe(
          data => this.addLiabilityRes(data)
        );
      } else {
        const editObj = {
          familyMemberId: this._data.familyMemberId,
          ownerName: obj.ownerName,
          loanTypeId: obj.loanType,
          id: this._data.id,
          loanAmount: obj.loanAmount,
          principalOutStandingAmount: obj.outstandingAmt,
          loanTenure: obj.loanTenure,
          commencementDate: obj.CommencementDate,
          principalOutstandingAsOn: obj.poDate,
          frequencyOfPayments: obj.emiFrequency,
          annualInterestRate: obj.interest,
          emi: obj.emi,
          financialInstitution: obj.finInstitution,
          loanPartPayments: obj.transactData
        };
        this.custumService.editLiability(editObj).subscribe(
          data => this.editLiabilityRes(data)
        );
      }
    }
  }
  addLiabilityRes(data) {
    if (data == 1) {
      console.log(data);
      data = this.loanTypeView;
      this.close(true);
      this.eventService.openSnackBar('Liabilities added successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'dismiss');
    }
  }
  editLiabilityRes(data) {
    if (data == 1) {
      console.log(data);
      data = this.loanTypeView;
      this.close(true);
      this.eventService.openSnackBar('Liabilities edited successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'dismiss');
    }
  }
}
