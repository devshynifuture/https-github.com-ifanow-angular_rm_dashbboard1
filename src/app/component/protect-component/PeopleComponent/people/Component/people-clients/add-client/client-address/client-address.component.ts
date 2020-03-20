import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-address',
  templateUrl: './client-address.component.html',
  styleUrls: ['./client-address.component.scss']
})
export class ClientAddressComponent implements OnInit {

  constructor(private fb: FormBuilder) { }
  addressForm;
  @Output() tabChange = new EventEmitter();
  ngOnInit() {
    this.addressForm = this.fb.group({
      proofType: [, [Validators.required]],
      addProofType: [, [Validators.required]],
      proofIdNum: [, [Validators.required]],
      addressLine1: [, [Validators.required]],
      addressLine2: [, [Validators.required]],
      pinCode: [, [Validators.required]],
      city: [, [Validators.required]],
      state: [, [Validators.required]],
      country: [, [Validators.required]]
    })
  }

}
