import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-commodities',
  templateUrl: './commodities.component.html',
  styleUrls: ['./commodities.component.scss']
})
export class CommoditiesComponent implements OnInit {
  showRequring: string;
  isLoading: boolean = true;
  displayedColumns9 = ['no', 'owner', 'grams', 'car', 'price', 'mvalue', 'pvalue', 'desc', 'status', 'icons'];
  datasource9 = ELEMENT_DATA9;

  displayedColumns10 = ['no', 'owner', 'type', 'mvalue', 'pvalue', 'pur', 'rate', 'desc', 'status', 'icons'];
  datasource10 = ELEMENT_DATA10;
  advisorId: any;
  goldList: any;
  otherCommodityList: any;
  clientId: any;
  sumOfMarketValue: any;
  sumOfPurchaseValue: any;
  sumOfMarketValueOther: any;
  sumOfPurchaseValueOther: any;
  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private eventService: EventService, public utils: UtilService) { }
  ngOnInit() {
    this.showRequring = '1'
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getGoldList()

  }
  getfixedIncomeData(value) {
    console.log('value++++++', value)
    this.showRequring = value
    if (value == '2') {
      this.getGoldList()
    } else {
      this.getOtherList()
    }

  }
  getGoldList() {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.custumService.getGold(obj).subscribe(
      data => this.getGoldRes(data)
    );
  }
  getGoldRes(data) {
    console.log('getGoldList @@@@', data);
    this.isLoading = false;
    this.goldList = data.goldList
    this.sumOfMarketValue = data.sumOfMarketValue
    this.sumOfPurchaseValue = data.sumOfPurchaseValue
  }
  getOtherList() {
    this.isLoading = true;
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.custumService.getOthers(obj).subscribe(
      data => this.getOthersRes(data)
    );
  }
  getOthersRes(data) {
    console.log('getOthersRes @@@@', data);
    this.isLoading = false;
    this.otherCommodityList = data.otherCommodityList
    this.sumOfMarketValueOther = data.sumOfMarketValue
    this.sumOfPurchaseValueOther = data.sumOfPurchaseValue
  }
  openCommodities(value, state, data) {
    const fragmentData = {
      Flag: value,
      data: data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (value == 'addedGold') {
          this.getGoldList()
        } else {
          this.getOtherList()
        }
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
export interface PeriodicElement9 {
  no: string;
  owner: string;
  grams: string;
  car: string;
  price: string;
  mvalue: string;
  pvalue: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA9: PeriodicElement9[] = [
  {
    no: '1.', owner: 'Rahul Jain'
    , grams: "50 tolas", car: "24", price: "32,000(as on 20/08/2019)",
    mvalue: "60,000", pvalue: "60,000", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: '2.', owner: 'Rahul Jain'
    , grams: "25 tolas", car: "24", price: "32,000(as on 20/08/2019)",
    mvalue: "60,000", pvalue: "60,000", desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '', owner: 'Total'
    , grams: "", car: "", price: "",
    mvalue: "1,28,925", pvalue: "1,20,000", desc: "", status: ""
  },

];
export interface PeriodicElement10 {
  no: string;
  owner: string;
  type: string;
  mvalue: string;
  pvalue: string;
  pur: string;
  rate: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA10: PeriodicElement10[] = [

  {
    no: '1.', owner: 'Rahul Jain'
    , type: "Cumulative", mvalue: "60,000", pvalue: "1,00,000", pur: "18/09/2021", rate: "8.40%", desc: "ICICI FD", status: "MATURED"
  },

  {
    no: '2.', owner: 'Shilpa Jain'
    , type: "Cumulative", mvalue: "60,000", pvalue: "1,00,000", pur: "18/09/2021", rate: "8.40%", desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '', owner: 'Total'
    , type: "", mvalue: "1,20,000", pvalue: "1,50,000", pur: "", rate: "", desc: "", status: ""
  },

];
