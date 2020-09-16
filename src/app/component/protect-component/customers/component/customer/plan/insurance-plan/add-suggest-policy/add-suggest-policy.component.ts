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
    this.getHolderNames(this.insuranceData)
    console.log(data);
  }

  ngOnInit() {
    this.storeData = 'Here you can write recommendations';
  }
  saveData(data) {

  }
  getHolderNames(obj){
    if (obj.owners && obj.owners.length > 0) {
      obj.displayHolderName = obj.owners[0].holderName;
      if (obj.owners.length > 1) {
        for (let i = 1; i < obj.owners.length; i++) {
          if (obj.owners[i].holderName) {
            const firstName = (obj.owners[i].holderName as string).split(' ')[0];
            obj.displayHolderName += ', ' + firstName;
          }
        }
      }
    } else {
      obj.displayHolderName = '';
    }
}
  checkRecommendation(value) {
    if (!value) {
      this.showRecommendation = true;
    } else {
      this.showRecommendation = false;
    }
  }
  close() {

    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  saveSuggestPolicy() {

  }
}
