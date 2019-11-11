import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CustomerService } from '../../customer/customer.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-liabilities',
  templateUrl: './add-liabilities.component.html',
  styleUrls: ['./add-liabilities.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },
    // { provide: MAT_DATE_LOCALE, useValue: 'en' },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ],

})
export class AddLiabilitiesComponent implements OnInit {
  displayedColumns: string[] = [  'name', 'amountTable'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = [  'year', 'principal', 'interest', 'totalPaid', 'balance'];
  dataSource1 = ELEMENT_DATA1;
  productForm: FormGroup;
  show: boolean;
  showTransact: boolean;
  addLiabilityForm: any;
  isOwner: boolean;
  isLoanType: boolean;
  isLoanAmount: boolean;
  isLoanTenure: boolean;
  isdateValid: boolean;
  isEmiFrequency: boolean;
  isinterestRate: boolean;
  ispaymentDate: boolean;
  paymentAmount: boolean;
  option: boolean;
  isPoValid:boolean;
  isOtAmt:boolean;
  showSelect: any;
  data: any[];
  advisorId: any;
  _inputData: any;
  

  constructor(private subInjectService:SubscriptionInject,private fb: FormBuilder,public custumService:CustomerService) { }
  @Input()
  set inputData(inputData) {
    this._inputData = inputData;
    // this.selectedOption = inputData ? (inputData.public ? (inputData.public === 1 ? '3' : inputData.mappingType) : '3') : '1';
    // console.log('AddEditDocumentComponent inputData: ', inputData);
    // this.setFormData(inputData);
  }

  get inputData() {
    return this._inputData;
  }
  ngOnInit() {
    this.show=false;
    this.showTransact=false;
    this.showSelect=false;
    this.advisorId = AuthService.getAdvisorId();
   this.getLiability();

  }
  showMore(){
    this.show=true;
  }
  showLess(){
    this.show=false;
  }
  showAddTransact(){
    this.showTransact=true;
    let array = []

       let obj1={
        "partPaymentDate": "",
        "partPayment":"",
        "option":""
       }
       array.push(obj1)
       this.data=array;
  }
  close(){
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  select(data){
    this.showSelect=data.checked;
  }
  getLiability(){
    this.addLiabilityForm = this.fb.group({
      ownerName: [, [Validators.required]],
      loanType: [, [Validators.required]],
      loanAmount: [, [Validators.required]],
      loanTenure: [, [Validators.required]],
      outstandingCheck:[],
      poDate: [, [Validators.required]],
      outstandingAmt: [, [Validators.required]],
      CommencementDate: [, [Validators.required]],
      emiFrequency: [, [Validators.required]],
      interest: [, [Validators.required]],
      emi: [],
      finInstitution: [],
      collateral: [],
      transact: this.fb.array([this.fb.group({
        partPaymentDate: null,
        partPayment: null,
        option: null})])
      // paymentDate: [, [Validators.required]],
      // paymentAmount: [, [Validators.required]],
      // option: [, [Validators.required]],
    });
    
     this.getFormControl().ownerName.maxLength = 10;
    this.getFormControl().loanAmount.maxLength = 10;
    this.getFormControl().loanTenure.maxLength = 10;
    this.getFormControl().interest.maxLength = 40;
    // this.getFormControl().paymentAmount.maxLength = 40;
    // this.getFormControl().option.maxLength = 40;
  }
  get transactEntries() {
    return this.addLiabilityForm.get('transact') as FormArray;
  }
    getFormControl() {
      return this.addLiabilityForm.controls;
    }
    addTransaction(){
    
      // let obj1={
      //   "partPaymentDate":  "",
      //   "partPayment":"",
      //   "option":""
      //  }
      // this.data.push(obj1) 
      this.transactEntries.push(this.fb.group({ partPaymentDate: null,
        partPayment: null,
        option: null}));
    }
    removeTransaction(item){
      this.transactEntries.removeAt(item);
    }
    saveFormData(state) {

      if (this.addLiabilityForm.controls.ownerName.invalid) {
        this.isOwner = true;
        return;
      } else if (this.addLiabilityForm.controls.loanType.invalid) {
        this.isLoanType = true;
        return;
      } else if (this.addLiabilityForm.controls.loanAmount.invalid) {
        this.isLoanAmount = true;
        return;
      } else if (this.addLiabilityForm.controls.loanTenure.invalid) {
        this.isLoanTenure = true;
        return;
      } else if (this.addLiabilityForm.controls.CommencementDate.invalid) {
        this.isdateValid = true;
        return;
      }else if (this.addLiabilityForm.controls.emiFrequency.invalid) {
        this.isEmiFrequency = true;
        return;
      }else if (this.addLiabilityForm.controls.interest.invalid) {
        this.isinterestRate = true;
        return;
      } else {
        const obj = {
        //   advisorId: this.advisorId,
        // advisorId: 12345,
        ownerName: this.addLiabilityForm.controls.ownerName.value,
        loanType: this.addLiabilityForm.controls.loanType.value,
        loanAmount: this.addLiabilityForm.controls.loanAmount.value,
        outstandingCheck: this.addLiabilityForm.controls.outstandingCheck.value,
        outstandingAmt: this.addLiabilityForm.controls.outstandingAmt.value,
        loanTenure: this.addLiabilityForm.controls.loanTenure.value,
        CommencementDate: this.addLiabilityForm.controls.CommencementDate.value,
        emiFrequency: this.addLiabilityForm.controls.emiFrequency.value,
        interest: this.addLiabilityForm.controls.interest.value,
        emi:this.addLiabilityForm.controls.emi.value,
        finInstitution:this.addLiabilityForm.controls.finInstitution.value,
        collateral:this.addLiabilityForm.controls.collateral.value,
        poDate:this.addLiabilityForm.controls.poDate.value,
        transactData:[]
          }
          obj.loanAmount = parseInt(obj.loanAmount);
          obj.outstandingAmt = parseInt(obj.outstandingAmt);
          obj.loanTenure = parseInt(obj.loanTenure);
          obj.emi = parseInt(obj.emi);
          obj.loanTenure = parseInt(obj.loanTenure);
          obj.loanType = parseInt(obj.loanType);
          obj.CommencementDate = obj.CommencementDate.toISOString().slice(0, 10);
          obj.poDate = obj.poDate.toISOString().slice(0, 10);
          obj.interest = parseInt(obj.interest);
          this.addLiabilityForm.value.transact.forEach(element => {
            if(element){
             let obj1={
              'partPaymentDate': element.partPaymentDate.toISOString().slice(0, 10),
              'partPayment':parseInt(element.partPayment),
              'option':parseInt(element.option)
             }
            obj.transactData.push(obj1)
            }
           });
          // obj.transactData=this.addLiabilityForm.value.transact;
          let objToSend={
            "advisorId": this.advisorId,
            "clientId": 2978,
            "familyMemberId": 16201,
            "ownerName": obj.ownerName,
            "loanTypeId": obj.loanType,
            "loanAmount": obj.loanAmount,
            "outstandingAmount": obj.outstandingAmt,
            "loanTenure": obj.loanTenure,
            "commencementDate": obj.CommencementDate,
            "principalOutstandingAsOn": obj.poDate,
            "principalOutstanding":obj.outstandingCheck,
            "frequencyOfPayments": obj.emiFrequency,
            "annualInterestRate":obj.interest,
            "financialInstitution": obj.finInstitution,
            "loanPartPayments": obj.transactData
            }
          console.log("obj",obj);
          this.custumService.addLiability(objToSend).subscribe(
            data => this.addLiabilityRes(data)
          );
          this.close();
        
      }
    }
    addLiabilityRes(data){
      console.log(data);
    }
  
}



export interface PeriodicElement {
  name: string;
  amountTable: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Loan amount', amountTable: '40,00,000'},
  { name: 'Interest %', amountTable: '8.75%'},
  { name: 'Loan period', amountTable: '20 years'},
  { name: 'Payment frequency', amountTable: 'Monthly'},
  { name: 'Commencement date', amountTable: '16/08/2014'},
];


export interface PeriodicElement1 {
  year: string;
  principal: string;
  interest: string;
  totalPaid: string;
  balance: string;
  
}


const ELEMENT_DATA1: PeriodicElement1[] = [
  { year: '2019', principal: '1,868.07', interest: '8,736.45', totalPaid: '10,604.52', balance: '3,98,131.93' },
  { year: '2020', principal: '7,893.09', interest: '34,524.99', totalPaid: '42,418.08', balance: '3,90,238.84' },
  { year: '2021', principal: '7,893.09', interest: '34,524.99', totalPaid: '42,418.08', balance: '3,90,238.84' },
  { year: '2022', principal: '7,893.09', interest: '34,524.99', totalPaid: '42,418.08', balance: '3,90,238.84' },
  { year: '2023', principal: '7,893.09', interest: '34,524.99', totalPaid: '42,418.08', balance: '3,90,238.84' },
];