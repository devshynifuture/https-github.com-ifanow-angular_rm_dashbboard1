import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-purchase-trasaction',
  templateUrl: './purchase-trasaction.component.html',
  styleUrls: ['./purchase-trasaction.component.scss']
})
export class PurchaseTrasactionComponent implements OnInit {
  purchaseTransaction: any;
  dataSource: any;
  ownerData: any;

  constructor(private subInjectService: SubscriptionInject,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.getdataForm('')
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  getdataForm(data) {
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.purchaseTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType:[(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection:[(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection:[(!data) ? '' : data.schemeSelection, [Validators.required]],
      investor:[(!data) ? '' : data.investor, [Validators.required]],
      employeeContry:[(!data) ? '' : data.employeeContry, [Validators.required]],
      investmentAccountSelection:[(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      modeOfPaymentSelection:[(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      folioSelection:[(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      selectInvestor:[(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });

    this.ownerData = this.purchaseTransaction.controls;
  }

}
