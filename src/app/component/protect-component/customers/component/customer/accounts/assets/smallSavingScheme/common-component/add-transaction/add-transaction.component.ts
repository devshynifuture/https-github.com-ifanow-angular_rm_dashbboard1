import { Component, OnInit, Output, Input } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {
  addTransactionList = 0;
  maxDate = new Date();
  transactionForm: any;
  @Input() commencementDate;
  @Input() transactionViewData;
  @Output() outputEvent = new EventEmitter();
  minDate: Date;
  constructor(private fb: FormBuilder) { }
  @Input() set data(data) {
    this.transactionForm = this.fb.group({
      transactionFormList: new FormArray([])
    })
    console.log("edit transactiion data", data)
    if (data == undefined) {
      this.addTransactionList = 0;
      return;
    }
    this.setTransactionData(data);
  }
  get getTransForm() { return this.transactionForm.controls; }
  get getTransFormList() { return this.getTransForm.transactionFormList as FormArray; }
  setTransactionData(data) {
  
   if(data.ppfTransactionList){
    // data.ppfTransactionList;
    data.ppfTransactionList.forEach(element => {
      this.getTransFormList.push(this.fb.group({
        date: [new Date(element.transactionDate), [Validators.required]],
        amount: [element.amount, Validators.required],
        type: [element.ppfTransactionType, Validators.required],
        id: [(element.id + ''), Validators.required],
        publicProvidendFundId:[element.publicProvidendFundId],
        isActive:1
      }));
    });
   }else{
    data.loanPartPayments;
    data.loanPartPayments.forEach(element => {
      this.getTransFormList.push(this.fb.group({
        date: [new Date(element.partPaymentDate), [Validators.required]],
        amount: [element.partPayment, Validators.required],
        type: [element.option, Validators.required],
        id: [(element.id + ''), Validators.required],
      }));
    });
   }
    
    
    
    this.outputEvent.emit(this.getTransFormList)
  }
  ngOnInit() {
    console.log(this.transactionViewData)
    // this.addTransactionList = 0;
    console.log(this.commencementDate)
  }

  addTransaction() {
    console.log(this.getTransFormList)
    console.log('commencementDate == ', this.commencementDate)
    this.minDate = new Date(this.commencementDate)
    this.getTransFormList.push(this.fb.group({
      type: [, [Validators.required]],
      date: [, [Validators.required]],
      amount: [, [Validators.required]],
      id: []
    }))
    this.outputEvent.emit(this.getTransFormList)
    this.addTransactionList = this.getTransFormList.controls.length
  }
  removed:any=[];
  removeTransaction(index) {
    console.log(this.getTransFormList, "getTransFormList",  this.transactionForm.controls.ppfTransactionList);
    
    if(this.getTransFormList.controls[index].value.publicProvidendFundId){
      // this.transactionForm.controls.ppfTransactionList.controls['isActive'].setValue(0);
      this.getTransFormList.controls[index].value.isActive = 0
      this.removed.push(this.getTransFormList.controls[index]);
      console.log(this.removed,"removed 123");
      this.transactionForm.controls.transactionFormList.removeAt(index);
      this.outputEvent.emit({removed:this.removed, data:this.getTransFormList})
      // this.transactionForm.controls.transactionFormList.push(this.removed);
    }
    else{
      this.transactionForm.controls.transactionFormList.removeAt(index)
      this.addTransactionList = this.getTransFormList.controls.length
    }

  }
}
