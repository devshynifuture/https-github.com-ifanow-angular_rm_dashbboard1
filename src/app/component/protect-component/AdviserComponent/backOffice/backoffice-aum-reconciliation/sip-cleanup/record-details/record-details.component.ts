import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-record-details",
  templateUrl: "./record-details.component.html",
  styleUrls: ["./record-details.component.scss"],
})
export class RecordDetailsComponent implements OnInit {
  constructor(
    private subsInjectService: SubscriptionInject
  ) {}

  data;

  ngOnInit() {
    console.log(this.data);
  }
  
  close(){
    this.subsInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
