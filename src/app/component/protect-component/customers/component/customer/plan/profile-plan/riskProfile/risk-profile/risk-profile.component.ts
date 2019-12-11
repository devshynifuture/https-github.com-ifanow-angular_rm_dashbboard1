import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../plan.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.scss']
})
export class RiskProfileComponent implements OnInit {
  [x: string]: any;
  riskAssessments: any;
  riskAssessmentQuestionList: any;
  riskProfile: any;
  public selection: string;
  sendRiskList: any;
  flag: boolean;
  advisorId: any;
  score
  showRisk = false

  constructor(private fb: FormBuilder, public planService: PlanService, ) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getRiskProfileList();
    this.getdataForm('');
    this.sendRiskList = [];
  }
  checkState(item, data) {

    console.log('$$$$$$$$$', this.sendRiskList)
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.riskProfile = this.fb.group({
    });
  }
  getFormControl(): any {
    return this.riskProfile.controls;
  }
  getRiskProfileList() {
    // let obj = {}
    this.planService.getRiskProfile('').subscribe(
      data => this.getRiskProfilRes(data)
    );
  }
  getRiskProfilRes(data) {
    console.log(data)
    this.riskAssessments = data.riskAssessments
    this.riskAssessmentQuestionList = this.riskAssessments.riskAssessmentQuestionList
    console.log(this.riskAssessmentQuestionList)
  }
  submitRiskAnalysis(data) {
    this.clientRiskAssessmentResults = []
    const obj = {
      riskAssessmentId:1,
      clientId:this.clientId,
      advisorId:this.advisorId,
      clientRiskAssessmentResults:[]
    }
    this.riskAssessmentQuestionList.forEach(element => {
      this.clientRiskAssessmentResults.push({ riskAssessmentQuestionId: element.id, riskAssessmentChoiceId: element.selectedChoiceId, weight : element.weight});
    });
    obj.clientRiskAssessmentResults = this.clientRiskAssessmentResults
    console.log('RiskProfileComponent submitRiskAnalysis solutionList : ', obj)

    this.planService.submitRisk(obj).subscribe(
      data => this.submitRiskRes(data)
    );
  }
  submitRiskRes(data) {
    console.log(data)
    this.showRisk = true
    this.score = data.score
  }
}
