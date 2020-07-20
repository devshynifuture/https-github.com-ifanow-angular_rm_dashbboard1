import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/component/Services/customer.service';

@Component({
  selector: 'app-add-transaction-mob',
  templateUrl: './add-transaction-mob.component.html',
  styleUrls: ['./add-transaction-mob.component.scss']
})
export class AddTransactionMobComponent implements OnInit {
  addTransactionList = 0;
  maxDate = new Date();
  transactionForm: any;
  @Input() commencementDate;
  @Input() transactionViewData;
  @Output() outputEvent = new EventEmitter();
  minDate: Date;
  constructor(private fb: FormBuilder, private customerService: CustomerService) { }
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

    if (data.transactionList) {
      this.addTransactionList = data.transactionList.length

      // data.ppfTransactionList;
      // let list = data.ppfTransactionList?data.ppfTransactionList:data.ssyTransactionList;
      data.transactionList.forEach(element => {
        this.getTransFormList.push(this.fb.group({
          date: [new Date(element.transactionDate), [Validators.required]],
          amount: [element.amount, [Validators.required]],
          type: [element.transactionType, Validators.required],
          id: [(element.id + ''), Validators.required],
          assetId: [element.assetId],
          isActive: 1
        }));
      });
    } else if (data.loanPartPayments) {
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

  setMax(type, index) {
    console.log(type, "type 123", this.getTransFormList.controls[index]);
    if (type == 1) {
      this.getTransFormList.controls[index].get('amount').setValidators([Validators.required, Validators.max(150000)]);
      this.getTransFormList.controls[index].get('amount').updateValueAndValidity();
    }
    else {
      this.getTransFormList.controls[index].get('amount').setValidators([Validators.required]);
      this.getTransFormList.controls[index].get('amount').updateValueAndValidity();
    }
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
  removed: any = [];
  removeTransaction(index) {
    console.log(this.getTransFormList, "getTransFormList", this.transactionForm.controls.ppfTransactionList);

    if (this.getTransFormList.controls[index].value.assetId) {
      // this.transactionForm.controls.ppfTransactionList.controls['isActive'].setValue(0);
      this.getTransFormList.controls[index].value.isActive = 0

      this.removed.push(this.getTransFormList.controls[index]);
      console.log(this.removed, "removed 123");
      this.transactionForm.controls.transactionFormList.removeAt(index);
      this.outputEvent.emit({ removed: this.removed, data: this.getTransFormList })
      // this.transactionForm.controls.transactionFormList.push(this.removed);
    }
    else {
      if (this.getTransFormList.controls[index].value.id) {
        let id = this.getTransFormList.controls[index].value.id;
        this.customerService.deletePartPayment(id).subscribe(
          data => {
            console.log('delete', data)
          }
        )
      }
      this.transactionForm.controls.transactionFormList.removeAt(index)
      this.addTransactionList = this.getTransFormList.controls.length;
    }

  }
}