import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-client-demat',
  templateUrl: './client-demat.component.html',
  styleUrls: ['./client-demat.component.scss']
})
export class ClientDematComponent implements OnInit {

  constructor(private fb: FormBuilder) { }
  dematForm;
  @Output() tabChange = new EventEmitter();
  ngOnInit() {
    this.dematForm = this.fb.group({
      modeOfHolding: [],
      depositoryPartName: [],
      depositoryPartId: [],
      clientId: [],
      brekerName: [],
      brokerAddress: [],
      brokerPhone: [],
      linkedBankAccount: [],
      powerOfAttName: [],
      powerOfAttMasId: []
    })
  }

}
