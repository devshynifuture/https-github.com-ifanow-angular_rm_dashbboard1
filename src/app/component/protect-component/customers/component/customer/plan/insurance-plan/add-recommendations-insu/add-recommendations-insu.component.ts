import { Component, OnInit, Input } from '@angular/core';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-recommendations-insu',
  templateUrl: './add-recommendations-insu.component.html',
  styleUrls: ['./add-recommendations-insu.component.scss']
})
export class AddRecommendationsInsuComponent implements OnInit {
  displayedColumns: string[] = ['policyName', 'sum', 'premium', 'returns', 'advice', 'empty'];
  dataSource : any;
  inputData: any;
  isLoading:any;
  constructor(private planService : PlanService,private eventService:EventService,private subInjectService : SubscriptionInject) { }
  @Input()
  set data(data) {
    this.isLoading = true;
    this.inputData = data;
    this.getRecommendations();
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  getRecommendations(){
    this.planService.getInsuranceRecommendation(this.inputData.id).subscribe(
      data => {
        this.dataSource = data
        this.isLoading = false;
        console.log(data)
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}

export interface PeriodicElement {
  policyName: string;
  sum: string;
  premium: string;
  returns: string;
  advice: string;
  empty: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { policyName: 'LIC Jeevan Saral', sum: '20,00,000', premium: '27,000', returns: '4.78%', advice: 'Stop paying premiums', empty: '' },

];

