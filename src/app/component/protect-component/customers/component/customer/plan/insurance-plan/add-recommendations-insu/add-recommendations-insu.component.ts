import { Component, OnInit, Input } from '@angular/core';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { HelthInsurancePolicyComponent } from '../add-insurance-planning/helth-insurance-policy/helth-insurance-policy.component';
import { MatDialog } from '@angular/material';

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
  constructor(public dialog: MatDialog,private planService : PlanService,private eventService:EventService,private subInjectService : SubscriptionInject) { }
  @Input()
  set data(data) {
    this.isLoading = true;
    this.inputData = data;
    this.getHolderNames(this.inputData)
    this.getRecommendations();
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  getHolderNames(obj){
    if (obj.owners && obj.owners.length > 0) {
      obj.displayHolderName = obj.owners[0].holderName;
      if (obj.owners.length > 1) {
        for (let i = 1; i < obj.owners.length; i++) {
          if (obj.owners[i].holderName) {
            const firstName = (obj.owners[i].holderName as string).split(' ')[0];
            obj.displayHolderName += ', ' + firstName;
          }
        }
      }
    } else {
      obj.displayHolderName = '';
    }
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
  recommend(data){
    const obj={
      id : this.inputData.id,
      insuranceId : data.insurance.id
    }
    this.planService.updateRecommendationsLI(obj).subscribe(
      data => {
          this.getRecommendations()
          console.log(data)
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  openDialog(value, data): void {
    const dialogRef = this.dialog.open(HelthInsurancePolicyComponent, {
      width: '780px',
      height: '600px',
      data: { value, data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
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

