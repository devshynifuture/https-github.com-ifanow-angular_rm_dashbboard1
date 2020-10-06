import { MatPaginator } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from './../../../../../../../auth-service/authService';
import { EventService } from './../../../../../../../Data-service/event.service';
import { PlanService } from './../plan.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-summary-plan',
  templateUrl: './summary-plan.component.html',
  styleUrls: ['./summary-plan.component.scss']
})
export class SummaryPlanComponent implements OnInit {
  displayedColumns: string[] = ['details', 'value', 'month', 'lumpsum'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  isLoading: boolean;
  goalSummaryCountObj: any;
  goalList: any;
  constructor(
    private planService: PlanService,
    private eventService: EventService
  ) { }

  @ViewChild(MatPaginator, { static: false }) paginator;

  ngOnInit() {
    this.getGoalSummaryValues();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getGoalSummaryValues(){
    // 'http://dev.ifanow.in:8080/futurewise/api/v1/%7BdeviceType%7D/goal-planning/goal/plan/summary?advisorId=2808&clientId=95955'
    let data = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.isLoading = true;
    this.planService.getGoalSummaryPlanData(data)
    .subscribe(res=>{
      this.isLoading = false;
      if(res){
        console.log(res);
        this.goalSummaryCountObj = res;
        this.goalList = res.goalList;
        let arr = [];
        this.goalList.forEach(item => {
          if(!!item.singleOrMulti && item.singleOrMulti === 1) {
            let goalValueObj = item.singleGoalModel,
                lumpsumDeptKey = Object.keys(goalValueObj.lumpSumAmountDebt)[0],
                lumpsumEquityKey = Object.keys(goalValueObj.lumpSumAmountEquity)[0],
                lumpsum = Math.round(goalValueObj.lumpSumAmountDebt[lumpsumDeptKey] + goalValueObj.lumpSumAmountEquity[lumpsumEquityKey]),
                sipDebtKey = Object.keys(goalValueObj.sipAmountDebt)[0],
                sipEquityKey = Object.keys(goalValueObj.sipAmountEquity)[0],
                month = Math.round(goalValueObj.sipAmountDebt[sipDebtKey] + goalValueObj.sipAmountEquity[sipEquityKey]);
            arr.push({
              details: !!goalValueObj.goalName ? goalValueObj.goalName : '',
              value: !!goalValueObj.goalFV ? Math.round(goalValueObj.goalFV): '',
              month,
              lumpsum,
              percentCompleted: !!goalValueObj.goalAchievedPercentage ? goalValueObj.goalAchievedPercentage: '',
              imageUrl: !!goalValueObj.imageUrl ? goalValueObj.imageUrl: ''
            });
          } else if (!!item.singleOrMulti && item.singleOrMulti ===2){
            let goalValueObj = item.multiYearGoalPlan,
                lumpsumDebt = 0,
                lumpsumEquity = 0,
                lumpsum = 0,
                sipDebtSum = 0,
                sipEquitySum = 0,
                month = 0;
              for (const key in goalValueObj.lumpSumAmountDebt) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.lumpSumAmountDebt, key)) {
                  const element = goalValueObj.lumpSumAmountDebt[key];
                  lumpsumDebt += element;
                }
              }
              for (const key in goalValueObj.lumpSumAmountDebt) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.lumpSumAmountEquity, key)) {
                  const element = goalValueObj.lumpSumAmountEquity[key];
                  lumpsumEquity += element;
                }
              }
              lumpsum = Math.round(lumpsumDebt + lumpsumEquity);
            
              for (const key in goalValueObj.sipAmountDebt) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.sipAmountDebt, key)) {
                  const element = goalValueObj.sipAmountDebt[key];
                  sipDebtSum += element;
                }
              }

              for (const key in goalValueObj.sipAmountEquity) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.sipAmountEquity, key)) {
                  const element = goalValueObj.sipAmountEquity[key];
                  sipEquitySum += element;
                }
              }

              month = Math.round(sipEquitySum + sipDebtSum);
              arr.push({
                details: goalValueObj.name,
                month,
                lumpsum,
                percentCompleted: !!goalValueObj.goalAchievedPercentage ? goalValueObj.goalAchievedPercentage: '',
                imageUrl: !!goalValueObj.imageUrl ? goalValueObj.imageUrl:'',
                value: !!goalValueObj.futureValue ? Math.round(goalValueObj.futureValue): ''
              });
          }
        });
        this.dataSource.data = arr;
        this.dataSource.paginator = this.paginator;

      }
    }, err=> {
      this.isLoading = false;
      console.error(err);
      this.eventService.openSnackBar("Something went wrong", "DISMISS")
    })

  }

}

export interface PeriodicElement {
  details: string;
  value: string;
  month: string;
  lumpsum: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { details: '', value: '', month: '', lumpsum: '' }  
];
