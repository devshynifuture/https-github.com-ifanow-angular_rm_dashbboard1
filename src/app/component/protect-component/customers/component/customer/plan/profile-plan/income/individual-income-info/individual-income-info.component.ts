import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-individual-income-info',
  templateUrl: './individual-income-info.component.html',
  styleUrls: ['./individual-income-info.component.scss']
})
export class IndividualIncomeInfoComponent implements OnInit {
  individualIncomeData: any;
  individualIncomeList = [];

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject) { }
  @Output() previousStep = new EventEmitter();
  @Input() set FinalIncomeList(data) {
    console.log(data)
    this.individualIncomeData = data;
  }
  ngOnInit() {
  }
  submitIncomeForm() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  cancel() {
    const obj=
    {
      data:this.individualIncomeData,
      stpeNo:2
    }
    this.previousStep.emit(obj)
  }
}
