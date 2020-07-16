import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { AddGoldMobComponent } from './add-gold-mob/add-gold-mob.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-commodities-mob',
  templateUrl: './commodities-mob.component.html',
  styleUrls: ['./commodities-mob.component.scss']
})
export class CommoditiesMobComponent implements OnInit {
  @Output() outputValue = new EventEmitter<any>();
  advisorId: any;
  clientId: any;
  totalCurrentValue = 0;
  goldData: any;
  othersData: any;
  goldCV: any;
  otherCv: any;

  constructor(private custumService:CustomerService,private eventService:EventService,private subInjectService:SubscriptionInject) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getGold();
    this.getOthers();
  }
  getGold(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getGold(obj).subscribe(
      data => {
        if(data){
          this.goldData = data;
          this.goldCV = data.sumOfMarketValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
  
      }
    );
  }
  getOthers(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getOthers(obj).subscribe(
      data => {
        if(data){
          this.othersData = data;
          this.otherCv = data.sumOfMarketValue
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
  
      }
    );
  }
  calculateSum(){
    this.totalCurrentValue = (this.goldCV ? this.goldCV : 0)+(this.otherCv ? this.otherCv:0)
  }
  changeValue(flag){
    this.outputValue.emit(flag);
  }
  addGold(value, state, data){
    let popupHeaderText = !!data ? 'Edit Gold' : 'Add Gold';
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: AddGoldMobComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
            // if (value == 'addGold') {
            //   this.getGoldList()
            // } else {
            //   this.getOtherList()
            // }

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
