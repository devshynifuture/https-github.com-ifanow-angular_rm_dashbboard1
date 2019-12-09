import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-stock-scrip-level-holding',
  templateUrl: './stock-scrip-level-holding.component.html',
  styleUrls: ['./stock-scrip-level-holding.component.scss']
})
export class StockScripLevelHoldingComponent implements OnInit {

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.addHoldings();
  }

  holdingListForm = this.fb.group({
    holdingListArray: new FormArray([])
  })
  get HoldingList() { return this.holdingListForm.controls };
  get HoldingArray() { return this.HoldingList.holdingListArray as FormArray };

  addHoldings() {
    this.HoldingArray.push(this.fb.group({
      scripName: [, [Validators.required]],
      holdings: [, [Validators.required]],
      holdingAsOn: [, [Validators.required]],
      investedAmt: [, [Validators.required]]
    }))
  }
  removeHoldings(index) {
    this.HoldingArray.removeAt(index)
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });

  }
}
