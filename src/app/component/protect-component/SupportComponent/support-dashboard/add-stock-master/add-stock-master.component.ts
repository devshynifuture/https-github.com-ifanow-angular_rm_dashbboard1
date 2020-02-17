import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-stock-master',
  templateUrl: './add-stock-master.component.html',
  styleUrls: ['./add-stock-master.component.scss']
})
export class AddStockMasterComponent implements OnInit {

  constructor(
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder
  ) { }


  addStockMasterForm = this.fb.group({
    "scriptName": [, Validators.required],
    "bseSymbol": [, Validators.required],
    "nseSymbol": [, Validators.required],
    "prevDayClosingPrice": [, Validators.required],
    "subCategory": [, Validators.required]
  })

  ngOnInit() {
  }

  dialogClose() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
