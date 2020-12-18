import { Component, OnInit, Input } from '@angular/core';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { HelthInsurancePolicyComponent } from '../add-insurance-planning/helth-insurance-policy/helth-insurance-policy.component';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../customer.service';
import { catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { ActiityService } from '../../../customer-activity/actiity.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-recommendations-insu',
  templateUrl: './add-recommendations-insu.component.html',
  styleUrls: ['./add-recommendations-insu.component.scss']
})
export class AddRecommendationsInsuComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,

  };
  displayedColumns: string[] = ['policyName', 'sum', 'premium', 'returns', 'advice'];
  dataSource: any;
  inputData: any;
  isLoading: any;
  adviceData: any;
  isAdviceGiven: boolean;
  ids =[];
  constructor(private activityService: ActiityService, private cusService: CustomerService, public dialog: MatDialog, private planService: PlanService, private eventService: EventService, private subInjectService: SubscriptionInject) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getHolderNames(this.inputData)
    this.getRecommendations();
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  getHolderNames(obj) {
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
  getRecommendations() {
    this.isLoading = true;
    // this.planService.getInsuranceRecommendation(this.inputData.id).subscribe(
    //   data => {
    //     if (data) {
    //       this.dataSource = data
    //       this.isLoading = false;
    //       console.log(data)
    //     } else {
    //       this.dataSource = [];
    //       this.isLoading = false;
    //     }
    //   },
    //   err => {
    //     this.dataSource = [];
    //     this.isLoading = false;
    //     this.eventService.openSnackBar(err, 'Dismiss');
    //   }
    // );
    const obj2 = {
      advisorId: AuthService.getAdvisorId(),
      clientId: AuthService.getClientId(),
      insuranceTypeId: 1,
      id: 0
    };
    let obj = {
      advisorId: AuthService.getAdvisorId(),
      clientId: AuthService.getClientId(),
      categoryMasterId: 3,
      categoryTypeId: 3,
      statusFlag: 0
    }
    const AdviceAsset = this.activityService.getAllAsset(obj).pipe(
      catchError(error => of(''))
    );
    const portfolioLi = this.cusService.getInsuranceData(obj2).pipe(
      catchError(error => of(''))
    );
    forkJoin(AdviceAsset, portfolioLi).subscribe(result => {
      if (result[0] && result[1]) {
        this.adviceData = result[0]
        let data = this.compareData(result[1]);
        if (data.length > 0) {
          this.dataSource = data
          this.isLoading = false;
          console.log(result[1])
        } else {
          this.dataSource = [];
          this.isLoading = false;
        }
      } else {
        this.dataSource = [];
        this.isLoading = false;
      }

    }, (error) => {
      this.dataSource = [];
      this.isLoading = false;
      this.eventService.openSnackBar(error, 'Dismiss');
    });
  }
  compareData(data) {
    let mergeArray;
    if (this.adviceData) {
      mergeArray = [...this.adviceData['TERM_LIFE_INSURANCE'], ...this.adviceData['TRADITIONAL_LIFE_INSURANCE'], ...this.adviceData['ULIP_LIFE_INSURANCE']]
      console.log(mergeArray);
    }
    if (data.insuranceList.length > 0) {
      if (this.inputData.displayHolderId == 0) {
        this.inputData.displayHolderId = AuthService.getClientId()
      }
      data.insuranceList = data.insuranceList.filter(d => d.familyMemberIdLifeAssured == this.inputData.displayHolderId);
      data.insuranceList = data.insuranceList.filter(d => d.realOrFictitious === 1);
      data.insuranceList.forEach(element => {
        element.insurance = element;
        if (mergeArray.length > 0) {
          mergeArray.forEach(ele => {
            if (ele.InsuranceDetails.id == element.id) {
              let adviceId = ele.adviceDetails.adviceId;
              element.insurance.adviceDetails = ele.adviceDetails;
              if(ele.adviceDetails.adviceId){
                this.ids.push(element.id);
              }
              element.insurance.advice = (adviceId == 1 ? 'Continue' : adviceId == 2 ? 'Surrender' : adviceId == 3 ? 'Stop paying premium' : adviceId == 5 ? 'Partial withdrawl' : null)
            }
          });
        }
      });
    } else {
      data.insuranceList = [];
    }
    console.log('id',this.ids);
    return data.insuranceList;
  }
  recommend(data) {
    const obj = {
      id: this.inputData.id,
      insuranceId: data.insurance.id
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
  saveRecommendations() {
    this.barButtonOptions.active = true;
    const obj = {
      id: this.inputData.id,
      needAnalysis: this.ids
    }
    this.planService.lifeInsurancePlanAdd(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.isAdviceGiven = true;
        this.close(true);
        console.log(data)
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  openDialog(value, data): void {
    value = { smallHeading: 'life insurance', inputData: this.inputData }
    const dialogRef = this.dialog.open(HelthInsurancePolicyComponent, {
      width: '780px',

      data: { value, data }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isRefreshedRequired) {
        this.isAdviceGiven = true;
        this.getRecommendations()
      }
      console.log('The dialog was closed', result);
    });
  }
  close(flag) {
    if (this.isAdviceGiven) {
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
    } else {
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
    }
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

