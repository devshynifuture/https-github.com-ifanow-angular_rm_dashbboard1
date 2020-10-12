import { MatPaginator } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from './../../../../../../../auth-service/authService';
import { EventService } from './../../../../../../../Data-service/event.service';
import { PlanService } from './../plan.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { DatePipe } from '@angular/common';

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
  insurancePlanList: any[] = [];
  clientDob: any;
  familyList: any[];
  startDate: any;
  endDate: any;
  cashFlowData: any;
  yearToShow: string;
  constructor(
    private planService: PlanService,
    private eventService: EventService,
    private peopleService:PeopleService,
    private datePipe: DatePipe
  ) { }

  @ViewChild(MatPaginator, { static: false }) paginator;

  ngOnInit() {
    this.getStartAndEndDate();
    this.getGoalSummaryValues();
    this.getSummeryInsurance();
    this.getListFamilyMem();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getStartAndEndDate(){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), 0, 1);
    var lastDay= new Date(date.getFullYear(), 11, 31);
    this.startDate = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
    var startYear =firstDay.getFullYear()-1;
    var endYear = lastDay.getFullYear().toString().substr(-2);
    this.yearToShow = startYear+'-'+endYear;
    console.log('startYearddddddddddddddddddddd',startYear);
    console.log('endYearddddddddddddddddddddd',endYear);
    

  }

  getGoalSummaryValues(){
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

  getSummeryInsurance(){
    let data = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.isLoading = true;
    this.planService.getInsurancePlanningPlanSummary({clientId: 95955, advisorId: 5122})
    .subscribe(res=>{
      this.isLoading = false;
      console.log(res, "values to see");      
      if(!!res && res !==null){
        for (const key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            const element = res[key];
            if(element && element.length>0){
              let arr = [],
                insuranceName;
              
              let amt = element.reduce((acc, curr)=>{
                acc = acc + curr.premiumAmount;
                insuranceName = curr.planName;
                return acc;
              }, 0);

              arr.push({
                insuranceName: key,
                amount: amt,
              });

              this.insurancePlanList = arr;
            }
          }
        }
      }
    }, err=> {
      console.error(err);
    })
  }
  getListFamilyMem() {
    this.isLoading = true;
    const obj = {
      clientId: this.clientId
    };
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
        if (data) {
          let array = [];
          data.forEach(element => {
            if (element.familyMemberId == 0) {
              this.clientDob = this.datePipe.transform(new Date(element.dateOfBirth), 'yyyy-MM-dd');
            } else {
              const obj = {
                'dob': this.datePipe.transform(new Date(element.dateOfBirth), 'yyyy-MM-dd'),
                'id': element.familyMemberId
              }
              array.push(obj);
            }

          });
          this.familyList = array.map(function (obj, ind) {
            let val = obj.id;
            obj[val] = obj['dob']
            delete obj['dob'];
            delete obj['id'];
            return obj;
          });
          this.getCashflowData();
        } else {
          this.getCashflowData();
        }
      },err=>{
        this.getCashflowData();
      }
    );
  }
  getCashflowData() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      startDate: this.startDate,
      endDate: this.endDate,
      clientDob: this.clientDob,
      fmDobList: JSON.stringify(this.familyList)
    };
    this.planService.getCashFlow(obj).subscribe(
      data => {
        if (data) {
          console.log(data);
          this.cashFlowData = data;
        }else{
          this.cashFlowData = '';
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
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
