import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-view-bonds',
  templateUrl: './detailed-view-bonds.component.html',
  styleUrls: ['./detailed-view-bonds.component.scss']
})
export class DetailedViewBondsComponent implements OnInit {
  inputData: any;
  bonds: any;
  bankList:any = [];
  constructor(public utils: UtilService,private subInjectService: SubscriptionInject, private enumService: EnumServiceService) { }
  @Input()
  set data(data) {
    this.inputData = data;
  }
  get data() {
    return this.inputData;
  }

  matured:boolean=false;
  ngOnInit() {
    this.bonds = this.inputData;
    this.bankList = this.enumService.getBank();
    if(new Date(this.inputData.maturityDate).getTime() < new Date().getTime()){
      this.matured = true;
    }
    else{
      this.matured = false;
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
