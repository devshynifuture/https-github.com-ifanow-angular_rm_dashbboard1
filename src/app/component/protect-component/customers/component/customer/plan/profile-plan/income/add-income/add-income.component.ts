import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit {
  showHide= false;
  selectedFamilyList: any;
  FinalIncomeList: any;
  constructor(private subInjectService: SubscriptionInject) { }
  addIncomeSteps=1;
  familyData=null;
  ngOnInit() {
  }
  close()
  {
    this.subInjectService.changeNewRightSliderState({ state: 'close'});
  }
  getIncomeDetails(data)
  {
   this.addIncomeSteps=data.stpeNo;
   this.FinalIncomeList=data.data
  }
  getSelectedFamilyMember(data)
  {
     console.log(data)
     this.selectedFamilyList=data;
     this.addIncomeSteps=data.stpeNo;
  }  
  previousStepData(data)
  {
    if(data.flag=="individualIncome")
    {
      this.selectedFamilyList=data
      this.addIncomeSteps=data.stpeNo;
    }
    else{
      this.familyData=data;
      this.addIncomeSteps=data.stpeNo;
    }
  }
}
