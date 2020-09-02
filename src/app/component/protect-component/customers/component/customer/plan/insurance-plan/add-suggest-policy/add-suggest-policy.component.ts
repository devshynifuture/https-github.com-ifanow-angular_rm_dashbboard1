import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-suggest-policy',
  templateUrl: './add-suggest-policy.component.html',
  styleUrls: ['./add-suggest-policy.component.scss']
})
export class AddSuggestPolicyComponent implements OnInit {
  insuranceData: any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,

  };
  storeData: string;
  showRecommendation: boolean;
  constructor(private subInjectService: SubscriptionInject) { }
  @Input() set data(data) {
    this.insuranceData = data;
    console.log(data)
  }

  ngOnInit() {
    this.storeData ='Here you can write recommendations';
  }
  saveData(data) {

  }
  checkRecommendation(value){
    if(!value){
      this.showRecommendation = true;
    }else{
      this.showRecommendation = false
    }
  }
  close() {

    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  saveSuggestPolicy() {

  }
}
