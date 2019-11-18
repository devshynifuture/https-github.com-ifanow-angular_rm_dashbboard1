import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-cash-and-bank',
  templateUrl: './cash-and-bank.component.html',
  styleUrls: ['./cash-and-bank.component.scss']
})
export class CashAndBankComponent implements OnInit {
  showRequring: string;
  advisorId: any;

  constructor(private subInjectService:SubscriptionInject, private custumService : CustomerService,private eventService:EventService,public util:UtilService) { }
  displayedColumns7 = ['no', 'owner', 'type', 'amt','rate','bal','account','bank','desc','status','icons'];
  datasource7 = ELEMENT_DATA7;
  displayedColumns8 = ['no', 'owner', 'cash','bal','desc','status','icons'];
  datasource8 = ELEMENT_DATA8;
  ngOnInit() {
    this.showRequring = '1'
    this.advisorId = AuthService.getAdvisorId();
    this.getCashInHandList()
    this.getBankAccountList()
  }
  getfixedIncomeData(value){
    console.log('value++++++',value)
    this.showRequring = (value == "2")? "2":"1"
  
  }
  getBankAccountList(){
     let obj = {
      clientId:2978,
      advisorId: this.advisorId
    }
     this.custumService.getBankAccounts(obj).subscribe(
      data => this.getBankAccountsRes(data)
    );
  }

  getBankAccountsRes(data){
    console.log('getBankAccountsRes ####',data)
  }
  getCashInHandList(){
     let obj = {
      clientId:2978,
      advisorId: this.advisorId
    }
     this.custumService.getCashInHand(obj).subscribe(
      data => this.getCashInHandRes(data)
    );  
  }
  getCashInHandRes(data){
    console.log('getCashInHandRes ###',data)
  }
  openCashAndBank(value,state,data)
  {
    const fragmentData = {
      Flag: value,
      data: data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
    
        }
      }
    );
  }
}
export interface PeriodicElement7 {
  no: string;
  owner: string;
  type:string;
  amt:string;
  rate:string;
  bal:string;
  account:string;
  bank:string;
  desc:string;
  status:string;
}

const ELEMENT_DATA7: PeriodicElement7[] = [
  {no: '1.', owner: 'Rahul Jain',
  type:'Savings',amt:"08/02/2019",rate:'8.40%',bal:"1,00,000",account:"980787870909",bank:"ICICI",
 desc:"ICICI FD",status:"MATURED"},
 {no: '2.', owner: 'Shilpa Jain',
 type:'Current',amt:"08/02/2019",rate:'8.60%',bal:"50,000",account:"77676767622",bank:"Axis",
  desc:"Axis bank FD",status:"LIVE"},
  {no: '', owner: 'Total',
  type:'',amt:"",rate:'',bal:"1,50,000",account:"",bank:"",
  desc:"",status:""},
 

];
export interface PeriodicElement8 {
  no: string;
  owner: string;
  cash:string;
  bal:string;
  desc:string;
  status:string;
}

const ELEMENT_DATA8: PeriodicElement8[] = [
  {no: '1.', owner: 'Rahul Jain'
 ,cash:"94,925",bal:"09/02/2019",
 desc:"ICICI FD",status:"MATURED"},
 {no: '2.', owner: 'Shilpa Jain'
 ,cash:"94,925",bal:"09/02/2019",
 desc:"Axis bank FD",status:"LIVE"},
 {no: '', owner: 'Total'
 ,cash:"1,28,925",bal:"",
 desc:"",status:""},
 

];