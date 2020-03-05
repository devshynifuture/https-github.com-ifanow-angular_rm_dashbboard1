import { Component, OnInit, Output, Input } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {
  addTransactionList: any;
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
    if (data.loanPartPayments) {
      data.loanPartPayments.forEach(element => {
        this.getTransFormList.push(this.fb.group({
          date: [new Date(element.partPaymentDate), [Validators.required]],
          amount: [element.partPayment, Validators.required],
          type: [element.option, Validators.required],
          id: [(element.id + ''), Validators.required],
        }));
      });
    }
    else {
      this.addTransactionList = 0;
    }
    this.outputEvent.emit(this.getTransFormList)
  }
  ngOnInit() {
    console.log(this.transactionViewData)
    // this.addTransactionList = 0;
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
  removeTransaction(index) {
    this.transactionForm.controls.transactionFormList.removeAt(index)
    this.addTransactionList = this.getTransFormList.controls.length
  }
}
