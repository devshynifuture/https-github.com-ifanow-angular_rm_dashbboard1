import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-bank',
  templateUrl: './client-bank.component.html',
  styleUrls: ['./client-bank.component.scss']
})
export class ClientBankComponent implements OnInit {

  constructor(private fb: FormBuilder) { }
  bankForm;
  @Output() tabChange = new EventEmitter();
  ngOnInit() {
    this.bankForm = this.fb.group({
      ifscCode: [, [Validators.required]],
      bankName: [, [Validators.required]],
      micrName: [, [Validators.required]],
      accNumber: [, [Validators.required]],
      accType: [, [Validators.required]],
      branchName: [, [Validators.required]],
      branchCountry: [, [Validators.required]],
      branchPinCode: [, [Validators.required]],
      branchAddressLine1: [, [Validators.required]],
      branchAddressLine2: [, [Validators.required]],
      branchCity: [, [Validators.required]],
      branchState: [, [Validators.required]]
    })
  }

}
