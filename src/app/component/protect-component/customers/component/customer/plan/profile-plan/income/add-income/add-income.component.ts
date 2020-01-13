import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PlanService } from '../../../plan.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit {
  showHide = false;
  selectedFamilyList: any;
  FinalIncomeList: any;
  editIncomeData: any;
  constructor(private subInjectService: SubscriptionInject, private planService: PlanService) { }
  addIncomeSteps = 1;
  familyData = null;
  data;
  ngOnInit() {
    if (this.data) {
      this.addIncomeSteps = 3;
      this.FinalIncomeList = undefined;
      this.editIncomeData = this.data;
    }
    this.getGrowthRateData();
  }
  getGrowthRateData() {
    let obj =
    {

    }
    this.planService.getGlobalGrowthRateData(obj).subscribe(
      data => this.getGrowthRateDataResp(data)
    )
  }
  getGrowthRateDataResp(data) {
    console.log(data)
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  getIncomeDetails(data) {
    this.addIncomeSteps = data.stpeNo;
    this.FinalIncomeList = data.data
  }
  getSelectedFamilyMember(data) {
    console.log(data)
    this.selectedFamilyList = data;
    this.addIncomeSteps = data.stpeNo;
  }
  previousStepData(data) {
    if (data.flag == "individualIncome") {
      this.selectedFamilyList = data
      this.addIncomeSteps = data.stpeNo;
    }
    else {
      this.familyData = data;
      this.addIncomeSteps = data.stpeNo;
    }
  }
}
