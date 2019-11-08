import { Component, OnInit } from '@angular/core';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-insurance',
  templateUrl: './add-insurance.component.html',
  styleUrls: ['./add-insurance.component.scss']
})
export class AddInsuranceComponent implements OnInit {
  advisorId: any;

  constructor(private subInjectService:SubscriptionInject,private fb:FormBuilder) { }

  ngOnInit() {
    this.advisorId=AuthService.getAdvisorId();
  }
  lifeInsuranceForm=this.fb.group({
    lifeAssured:[,[Validators.required]],
    proposer:[,[Validators.required]],
    policyName:[,[Validators.required]],
    policyNum:[,[Validators.required]],
    commencementDate:[,[Validators.required]],
    sumAssured:[,[Validators.required]],
    premiumDetailsAmount:[,[Validators.required]],
    premiumDetailsFrequency:[,[Validators.required]],
    tenureDetailsPolicy:[,[Validators.required]],
    premiumPayingTerm:[,[Validators.required]],
    policyStatus:[,[Validators.required]],
    policyStatusLastUnpaid:[,[Validators.required]]
  })
  getLifeInsuranceFormFields(controlName)
  {
    
    return this.lifeInsuranceForm.get(controlName).value
  }
  saveAddInsurance()
  { 
    const obj={
      "familyMemberIdLifeAssured":112233,
      "familyMemberIdProposer":112233,
      "clientId":555111,
      "advisorId":this.advisorId,
      "ownerName":"swapnil",
      "commencementDate":this.getLifeInsuranceFormFields('commencementDate'),
      "sumAssured":this.getLifeInsuranceFormFields('sumAssured'),
      "policyStatusId":1,
      "lastUnpaidPremium":this.getLifeInsuranceFormFields('policyStatusLastUnpaid'),
      "premiumAmount":this.getLifeInsuranceFormFields('premiumDetailsAmount'),
      "frequency":1,
      "policyTenure":this.getLifeInsuranceFormFields('tenureDetailsPolicy'),
      "premiumPayingTerm":this.getLifeInsuranceFormFields('premiumPayingTerm'),
      "riskCover":5000,
      "surrenderValue":500,
      "nominee":"nominee two",
      "vestedBonus":2000,
      "assumedRate":1000,
      "cashflowType":"cash flow 4",
      "cashflowYear":"2020-12-12",
      "cashFlowApproxAmount":4000,
      "ridersAccidentalBenifits":1000,
      "ridersDoubleAccidentalBenefit":500,
      "ridersTermWaiver":1000,
      "ridersCriticalIllness":2000,
      "ridersPremiumWaiver":1000,
      "ridersFemaleCriticalIllness":1000,
      "loanAvailable":10000,
      "loanTaken":8000,
      "loanTakenOn":"2019-12-12",
      "premiumPaymentMode":"premium payment mode 4",
      "advisorName":"advisor 4",
      "serviceBranch": " branch 4",
      "policyName":this.getLifeInsuranceFormFields('policyName'),
      "policyTypeId":1,
      "policyNumber":this.getLifeInsuranceFormFields('policyNum')
      }
  }
  close(){
    this.subInjectService.changeNewRightSliderState({ state: 'close' });

  }

}
