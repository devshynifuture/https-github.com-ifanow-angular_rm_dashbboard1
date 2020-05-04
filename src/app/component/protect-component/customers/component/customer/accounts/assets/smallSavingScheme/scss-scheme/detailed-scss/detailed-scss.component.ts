import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-scss',
  templateUrl: './detailed-scss.component.html',
  styleUrls: ['./detailed-scss.component.scss']
})
export class DetailedScssComponent implements OnInit {

  isLoading = false;

  data;

  constructor(private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
    console.log('DetailedNscComponent ngOnInit data : ', this.data);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
