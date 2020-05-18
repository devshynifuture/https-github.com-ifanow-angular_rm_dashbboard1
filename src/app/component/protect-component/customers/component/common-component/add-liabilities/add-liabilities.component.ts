import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CustomerService } from '../../customer/customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { DataComponent } from '../../../../../../interfaces/data.component';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatInput } from '@angular/material';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-liabilities',
  templateUrl: './add-liabilities.component.html',
  styleUrls: ['./add-liabilities.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],

})
export class AddLiabilitiesComponent implements OnInit, DataComponent {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
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
  loanTypeView: any;
  nomineesList: any[] = [];
  clientId: any;
    nomineesListFM: any = [];
  maxDate = new Date();
  minDate = new Date();
  transactionViewData =
    {
      optionList: [
        { name: 'Keep the EMI as it is and reduce the term', value: 1 },
        { name: 'the term as it is and reduce the EMI', value: 2 }
      ],
      transactionHeader: ['Option', 'Part payment date', 'Part payment amount']
    }
  transactionData: any;
  editData: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  familyMemberId: any;
  loanAmount: any;
  familyMemberLifeData: any;
  callMethod:any;
  loanTypeDetails: any;
  showFilter: any;
  // minDate = new Date()
  constructor(public utils: UtilService, private subInjectService: SubscriptionInject, private fb: FormBuilder,
    public custumService: CustomerService, public eventService: EventService,private datePipe: DatePipe) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    this.showFilter = (inputData.showFilter) ? inputData.showFilter :inputData
    if(this._data.id == undefined){
      (inputData == 'tab1') ? this.loanTypeDetails='' :this.loanTypeDetails=inputData;
    }
    console.log('AddLiabilitiesComponent Input data : ', this._data);
  }
  get data() {
    return this._data;
  }

  ngOnInit() {
    this.show = false;
    this.showTransact = false;
    this.showSelect = false;
    this.minDate.setFullYear(this.maxDate.getFullYear() - 100);
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getLiability(this.data);
  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    // this.familyMemberId = value.id
    this.familyMemberId = value.familyMemberId

  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
  }
  getFamilyMember(data, index) {
    this.familyMemberLifeData = data;
    console.log('family Member', this.FamilyMember);
  }
  FamilyMember(arg0: string, FamilyMember: any) {
    throw new Error("Method not implemented.");
  }


  disabledMember(value, type) {
    this.callMethod = {
      methodName: "disabledMember",
      ParamValue: value,
      disControl: type
    }
  }

  displayControler(con) {
    console.log('value selected', con);
    if (con.owner != null && con.owner) {
      this.addLiabilityForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.addLiabilityForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }

  /***owner***/
  get getCoOwner() {
    return this.addLiabilityForm.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.ownerName : '', [Validators.required]], share: [data ? data.share : ''], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }

  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.addLiabilityForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    this.disabledMember(null, null);
  }

  get getNominee() {
    return this.addLiabilityForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.addLiabilityForm.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
  }



  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''], sharePercentage: [data ? data.sumInsured : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (let e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if (this.getNominee.value.length > 1 && !data) {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }


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
  // showAddTransact() {
  //   this.showTransact = true;
  //   if (this.transactEntries.length == 0) {
  //     this.transactEntries.push(this.fb.group({
  //       partPaymentDate: ['', [Validators.required]],
  //       partPayment: ['', [Validators.required]],
  //       option: ['', [Validators.required]]
  //     }));
  //   }
  // }
  close(flag) {
    if (this.data) {
      if (this._data.loanTypeId == undefined) {
         const data = this.showFilter;
        // const data = this.addLiabilityForm.get('loanType').value;
        this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: flag });
      } else {
         const data = this.showFilter;
        // const data = this.addLiabilityForm.get('loanType').value;
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

    if (data.checked == true) {
      this.addLiabilityForm.get('poDate').setValue('');
      this.addLiabilityForm.get('outstandingAmt').setValue('');
      this.addLiabilityForm.get('poDate').setValidators([Validators.required]);
      this.addLiabilityForm.get('outstandingAmt').setValidators([Validators.required]);
    }
    else {
      this.addLiabilityForm.get('poDate').setValue('');
      this.addLiabilityForm.get('outstandingAmt').setValue('');
      this.addLiabilityForm.get('poDate').setValidators();
      this.addLiabilityForm.get('outstandingAmt').setValidators();
      this.addLiabilityForm.get('poDate').updateValueAndValidity();
      this.addLiabilityForm.get('outstandingAmt').updateValueAndValidity();
    }
  }
  getFormControl() {
    return this.addLiabilityForm.controls;
  }
  // display(value) {
  //   console.log('value selected', value);
  //   this.ownerName = value.userName;
  //   this.familyMemberId = value.id;
  // }
  // lisNominee(value) {
  //   console.log(value)
  //   this.nomineesListFM = Object.assign([], value.familyMembersList);
  // }
  getFormData(data) {
    console.log(data)
    this.transactionData = data.controls
    return;
  }
  Validations(value,form){
    if(form == 'loanTenure'){
      if(parseInt(value) > 50){
        this.addLiabilityForm.get('loanTenure').markAsTouched();
      }
      this.minDate = new Date();
      this.minDate.setFullYear(this.maxDate.getFullYear() - value);
    }else{
     (this.addLiabilityForm.controls.loanAmount.value) ? this.loanAmount = this.addLiabilityForm.controls.loanAmount.value : null
     let formValue = parseInt(this.addLiabilityForm.controls.loanAmount.value)
     let emi=parseInt(this.addLiabilityForm.controls.emi.value) 
      if(emi > formValue){
        this.addLiabilityForm.get('emi').setErrors({ max: formValue });
        this.addLiabilityForm.get('emi').markAsTouched();
      }else{
        this.addLiabilityForm.get('emi').setErrors(null);
      }
    }
    }
    calculateEmi(){
       let form =this.addLiabilityForm.controls;
      if(form.loanAmount.value && form.loanTenure.value && form.CommencementDate.value  && form.emiFrequency.value && form.interest.value){
        const obj = {
          loanAmount: this.addLiabilityForm.controls.loanAmount.value,
          principalOutStandingAmount: this.addLiabilityForm.controls.outstandingAmt.value,
          loanTenure:this.addLiabilityForm.controls.loanTenure.value,
          commencementDate:this.addLiabilityForm.controls.CommencementDate.value,
          principalOutstandingAsOn:(this.addLiabilityForm.controls.poDate.value) ? this.addLiabilityForm.controls.poDate.value : null,
          principalOutstanding:(this.addLiabilityForm.controls.outstandingCheck.value) ? this.addLiabilityForm.controls.outstandingCheck.value : false,
          frequencyOfPayments:this.addLiabilityForm.controls.emiFrequency.value,
          annualInterestRate:this.addLiabilityForm.controls.interest.value
        };
        this.custumService.geCalculatedEmi(obj).subscribe(
          data =>{
            console.log(data)
              this.addLiabilityForm.controls['emi'].setValue(data);
            
          }, (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      }


    }
  getLiability(data) {
    if (data == 'tab1') {
      data = {};
    }
    else {
      this.editData = data;
      this.familyMemberId = data.id
    }
    this.addLiabilityForm = this.fb.group({
      ownerName: [data.ownerName],
      loanType: [(data.loanTypeId == undefined) ? this.loanTypeDetails +'' : (data.loanTypeId) + '', [Validators.required]],
      loanAmount: [data.loanAmount, [Validators.required]],
      loanTenure: [data.loanTenure, [Validators.required,Validators.max(50)]],
      outstandingCheck: [data.principalOutstanding],
      poDate: [(data.principalOutstandingAsOn) ? new Date(data.principalOutstandingAsOn) : ''],
      outstandingAmt: [data.principalOutStandingAmount,],
      CommencementDate: [new Date(data.commencementDate), [Validators.required]],
      emiFrequency: [(data.frequencyOfPayments == undefined) ? '' : (data.frequencyOfPayments) + '', [Validators.required]],
      interest: [data.annualInterestRate, [Validators.required,Validators.required]],
      emi: [data.emi,[Validators.required,Validators.max((this.loanAmount) ? this.loanAmount : null)]],
      finInstitution: [data.financialInstitution],
      collateral: [],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0,],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
    });
    if (this.addLiabilityForm.controls.outstandingCheck.value == true) {
      this.showSelect = true;
    }
    if (this.addLiabilityForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    }
    if (data) {
      this.getCoOwner.removeAt(0);
        this.addNewCoOwner(data);
    }
    if(data.nomineeList){
      if(data.nomineeList.length > 0){
      
        this.getNominee.removeAt(0);
        data.nomineeList.forEach(element => {
          this.addNewNominee(element);
        });
      }
    }
    this.getFormControl().loanAmount.maxLength = 20;
    this.getFormControl().loanTenure.maxLength = 20;
    this.getFormControl().interest.maxLength = 20;
    this.getFormControl().outstandingAmt.maxLength = 20;
    // this.ownerData = this.addLiabilityForm.controls;
    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.addLiabilityForm }

  }
  saveFormData() {

    let transactionFlag, finalTransctList = []
    if (this.transactionData && this.transactionData.length > 0) {
      this.transactionData.forEach(element => {
        if (element.valid) {
          let obj = {
            "partPaymentDate": (element.controls.date.value._d) ? this.datePipe.transform(element.controls.date.value._d , 'yyyy-MM-dd') : element.controls.date.value,
            "partPayment": element.controls.amount.value,
            "option": element.controls.type.value,
            "id":(element.value.id) ? element.value.id : null
          }
          finalTransctList.push(obj)
        }
        else {
          transactionFlag = false;
        }
      });
    }
    if (this.addLiabilityForm.invalid) {
      this.addLiabilityForm.markAllAsTouched();
      this.inputs.find(input => !input.ngControl.valid).focus();
    }
    else {
      this.barButtonOptions.active = true;
      if (this._data.id == undefined) {
        const objToSend = {
          advisorId: this.advisorId,
          clientId: this.clientId,
          familyMemberId: this.familyMemberId,
          // ownerName: (this.ownerName == null) ? this.addLiabilityForm.controls.ownerName.value : this.ownerName,
          ownerName:this.addLiabilityForm.value.getCoOwnerName[0].name,
          loanTypeId: this.addLiabilityForm.controls.loanType.value,
          loanAmount: this.addLiabilityForm.controls.loanAmount.value,
          principalOutStandingAmount: (this.addLiabilityForm.controls.outstandingAmt.value) ? this.addLiabilityForm.controls.outstandingAmt.value : null,
          loanTenure: this.addLiabilityForm.controls.loanTenure.value,
          commencementDate: this.datePipe.transform(this.addLiabilityForm.controls.CommencementDate.value, 'yyyy-MM-dd'),
          principalOutstandingAsOn: (this.addLiabilityForm.controls.poDate.value) ? this.datePipe.transform(this.addLiabilityForm.controls.poDate.value, 'yyyy-MM-dd') : null,
          principalOutstanding: (this.addLiabilityForm.controls.outstandingCheck.value) ? this.addLiabilityForm.controls.outstandingCheck.value : false,
          frequencyOfPayments: this.addLiabilityForm.controls.emiFrequency.value,
          annualInterestRate: this.addLiabilityForm.controls.interest.value,
          financialInstitution: this.addLiabilityForm.controls.finInstitution.value,
          emi: this.addLiabilityForm.controls.emi.value,
          loanPartPayments: finalTransctList
        };
        this.custumService.addLiability(objToSend).subscribe(
          data => this.addEditLiabilityRes(data)
        );
      } else {
        const editObj = {
          familyMemberId: this._data.familyMemberId,
          ownerName:this.addLiabilityForm.value.getCoOwnerName[0].name,
          loanTypeId: this.addLiabilityForm.controls.loanType.value,
          id: this._data.id,
          loanAmount: this.addLiabilityForm.controls.loanAmount.value,
          principalOutStandingAmount: (this.addLiabilityForm.controls.outstandingAmt.value) ? this.addLiabilityForm.controls.outstandingAmt.value : null,
          loanTenure: this.addLiabilityForm.controls.loanTenure.value,
          commencementDate: this.datePipe.transform(this.addLiabilityForm.controls.CommencementDate.value, 'yyyy-MM-dd'),
          principalOutstandingAsOn: (this.addLiabilityForm.controls.poDate.value) ? this.datePipe.transform(this.addLiabilityForm.controls.poDate.value, 'yyyy-MM-dd') : null,
          frequencyOfPayments: this.addLiabilityForm.controls.emiFrequency.value,
          annualInterestRate: this.addLiabilityForm.controls.interest.value,
          principalOutstanding: (this.addLiabilityForm.controls.outstandingCheck.value) ? this.addLiabilityForm.controls.outstandingCheck.value : false,
          emi: this.addLiabilityForm.controls.emi.value,
          financialInstitution: this.addLiabilityForm.controls.finInstitution.value,
          loanPartPayments: finalTransctList
        };
        this.custumService.editLiability(editObj).subscribe(
          data => this.addEditLiabilityRes(data)
        );
      }
    }
  }
  addEditLiabilityRes(data) {
    this.barButtonOptions.active = false;
    if (data == 1) {
      console.log(data);
      data = this.loanTypeView;
      this.close(true);
      (this._data.id == undefined) ? this.eventService.openSnackBar('Liability added successfully', 'OK') : this.eventService.openSnackBar('Liability edited successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');
    }
  }
}
