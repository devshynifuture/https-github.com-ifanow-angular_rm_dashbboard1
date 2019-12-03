import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatSort, MatTableModule, MatTableDataSource } from '@angular/material';
import { AddIncomeComponent } from './add-income/add-income.component';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns = ['no', 'owner', 'type', 'amt','income','till','rate','status','icons'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  advisorId: any;
  clientId: any;
  constructor(private eventService:EventService,private subInjectService: SubscriptionInject,private planService:PlanService) { }
  viewMode;
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.viewMode="tab1"
    this.advisorId=AuthService.getAdvisorId();
    this.clientId=AuthService.getClientId();
    this.getIncomeList();
  }
  getIncomeList()
  {
    const obj=
    {
      advisorId:this.advisorId,
      clientId:this.clientId
    }
    this.planService.getIncomeData(obj).subscribe(
      data=>this.getIncomeListRes(data),
      err=>this.eventService.openSnackBar(err)
    )
    
  }
  getIncomeListRes(data)
  {
    this.dataSource=data
  }
  addIncome(flagValue,data){
     const fragmentData = {
      flag: flagValue,
      data,
      state:'open',
      componentName:AddIncomeComponent
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

  addIncomeDetail(flagValue){
    const fragmentData = {
      flag: flagValue,
      id: 1,
      state: 'openHelp'
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
export interface PeriodicElement {
  no: string;
  owner: string;
  type: string;
  amt: string;
  income:string;
  till:string;
  rate:string;
  status:string;
 
}

const ELEMENT_DATA: PeriodicElement[] = [
  {no: "1", owner: 'Rahul Jain', type: "Salaried", amt: '60,000',income:"18/09/2021",till:"Retirement",rate:"8.40%",status:"MATURED"},
  {no: "2", owner: 'Rahul Jain', type: "Salaried", amt: '60,000',income:"18/09/2021",till:"Retirement ",rate:"8.40%",status:"LIVE"},
  {no: "", owner: 'Total', type: "", amt: '1,60,000',income:"",till:"",rate:"",status:""},
];     