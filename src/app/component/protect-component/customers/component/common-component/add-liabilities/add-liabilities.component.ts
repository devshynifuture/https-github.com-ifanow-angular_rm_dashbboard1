import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CustomerService } from '../../customer/customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-liabilities',
  templateUrl: './add-liabilities.component.html',
  styleUrls: ['./add-liabilities.component.scss'],
  providers: [
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
  addLiabilityForm;
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
  ownerData: any;
  ownerName: any;
  selectedFamilyData: any;
  loanTypeView: any;

  

  constructor(private subInjectService:SubscriptionInject,private fb: FormBuilder,public custumService:CustomerService,public eventService:EventService) { }
  @Input()
  set inputData(inputData) {
    this._inputData = inputData;
    this.getLiability(inputData);
  }

  get inputData() {
    return this._inputData;
  }
  ngOnInit() {
    this.show=false;
    this.showTransact=false;
    this.showSelect=false;
    this.advisorId = AuthService.getAdvisorId();
  }
  showMore(){
    this.show=true;
  }
  showLess(){
    this.show=false;
  }
  showAddTransact(){
    this.showTransact=true;
    if(this.transactEntries.length==0){
      this.transactEntries.push(this.fb.group({ partPaymentDate: null,
      partPayment: null,
      option: null}));
    }
  }
  close(){
   let data=this._inputData.loanTypeId;
    this.subInjectService.changeNewRightSliderState({ state: 'close',data });
  }
  select(data){
    this.showSelect=data.checked;
  }
  getFormControl() {
    return this.addLiabilityForm.controls;
  }
  display(value){
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.selectedFamilyData = value
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  getLiability(data){
    if (data == undefined) {
      data = {};
    }
    this.addLiabilityForm = this.fb.group({
      ownerName: [data.ownerName , [Validators.required]],
      loanType: [(data.loanTypeId)+"", [Validators.required]],
      loanAmount: [data.loanAmount, [Validators.required]],
      loanTenure: [data.loanTenure, [Validators.required]],
      outstandingCheck:[data.principalOutstanding],
      poDate: [new Date(data.principalOutstandingAsOn), [Validators.required]],
      outstandingAmt: [data.outstandingAmount, [Validators.required]],
      CommencementDate: [new Date(data.commencementDate), [Validators.required]],
      emiFrequency: [(data.frequencyOfPayments)+"", [Validators.required]],
      interest: [data.annualInterestRate, [Validators.required]],
      emi: [data.emi],
      finInstitution: [data.financialInstitution],
      collateral: [],
     transact: this.fb.array([this.fb.group({  partPaymentDate:null,
      partPayment: null,
      option: null})])
    });
    if(data.loanPartPayments!=undefined){
      data.loanPartPayments.forEach(element => {
        this.addLiabilityForm.controls.transact=this.fb.array([this.fb.group({
          partPaymentDate: [new Date(element.partPaymentDate),[Validators.required]],
          partPayment: [element.partPayment,Validators.required],
          option:[ (element.option+""),Validators.required]})])
      })
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
    addTransaction(){
      this.transactEntries.push(this.fb.group({ 
        partPaymentDate: null,
        partPayment: null,
        option: null
      }));
    }
    removeTransaction(item){
      this.transactEntries.removeAt(item);
    }
    saveFormData(state) {
      if (this.addLiabilityForm.controls.loanType.invalid) {
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
        ownerName:(this.ownerName==null)?this.addLiabilityForm.controls.ownerName.value:this.ownerName,
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
          this.loanTypeView= obj.loanType;
          obj.emiFrequency = parseInt(obj.emiFrequency);
          obj.outstandingCheck=obj.outstandingCheck.toString();
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

           if(this._inputData=='Add'){
            let objToSend={
              "advisorId": this.advisorId,
              "clientId": 2978,
              "familyMemberId": this.selectedFamilyData.id,
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
           }else{
            let editObj={
              "familyMemberId":160023,
              "ownerName":obj.ownerName,
              "loanTypeId":obj.loanType,
              "id":this._inputData.id,
              "loanAmount":obj.loanAmount,
              "outstandingAmount":obj.outstandingAmt,
              "loanTenure":obj.loanTenure,
              "commencementDate":obj.CommencementDate,
              "principalOutstandingAsOn":obj.poDate,
              "frequencyOfPayments":obj.emiFrequency,
              "annualInterestRate":obj.interest,
              "emi":obj.emi,
              "financialInstitution":obj.finInstitution
              }
              this.custumService.editLiability(editObj).subscribe(
                data => this.editLiabilityRes(data)
              );
           }
        
      }
    }
    addLiabilityRes(data){
      if(data==1){
        console.log(data);
        data=this.loanTypeView
        this.subInjectService.changeNewRightSliderState({ state: 'close', data })
        this.eventService.openSnackBar('Liabilities added successfully', 'OK');   
      }else{
        this.eventService.openSnackBar('Error', 'dismiss');   

      }
      
      }
     
    
    editLiabilityRes(data){
      if(data==1){
        console.log(data);
        data=this.loanTypeView
        this.subInjectService.changeNewRightSliderState({ state: 'close', data })
        this.eventService.openSnackBar('Liabilities edited successfully', 'OK'); 
      }else{
        this.eventService.openSnackBar('Error', 'dismiss');   
      }
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