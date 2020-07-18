import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { upperSliderAnimation, rightSliderAnimation } from 'src/app/animation/animation';

@Component({
  selector: 'app-bank-detailed-assets',
  templateUrl: './bank-detailed-assets.component.html',
  styleUrls: ['./bank-detailed-assets.component.scss'],
  animations: [
    rightSliderAnimation,
    upperSliderAnimation
  ],
})
export class BankDetailedAssetsComponent implements OnInit {
  fixdeposit
  backToMf
  inputData: any;
  asset: any;
  showFDDetails;
  showRDDetails;
  constructor(
    public eventService : EventService,
  ) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.asset = data.asset
    console.log('This is Input data of proceed ', data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  addFixedDeposit(){     
      }
}
