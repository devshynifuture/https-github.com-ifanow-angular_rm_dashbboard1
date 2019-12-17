import {Component, OnInit} from '@angular/core';
import {PlanService} from '../../../plan.service';
import {FormBuilder} from '@angular/forms';
import * as Highcharts from 'highcharts';
import {AuthService} from 'src/app/auth-service/authService';

const HighchartsMore = require('highcharts/highcharts-more.src');
HighchartsMore(Highcharts);
const HC_solid_gauge = require('highcharts/modules/solid-gauge.src');
HC_solid_gauge(Highcharts);

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
  score;
  showRisk = false;
  clickMessage = '';
  name = 'Angular';

  onClickMe(referenceKeyName) {
    alert(referenceKeyName.id);
  }

  constructor(private fb: FormBuilder, public planService: PlanService,) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getRiskProfileList();
    this.getdataForm('');
    this.chartFunc('devshyni');
    this.sendRiskList = [];
  }

  chartFunc(chartId) {
    // @ts-ignore
    Highcharts.chart(chartId, {
      chart: {
        type: 'solidgauge'
      },
      title: {
        text: 'Monthly Average Temperature'
      },
      pane: {
        center: ['50%', '50%'],
        size: '300px',
        startAngle: -90,
        endAngle: 270,
        background: {
          backgroundColor: '#FFFE',
          innerRadius: '100%',
          outerRadius: '100%',
          borderWidth: 0
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        labels: {
          enabled: true
        },

        lineWidth: 0,
        minorTickInterval: null,
        tickPixelInterval: 400,
        tickWidth: 0
      },
      plotOptions: {
        solidgauge: {
          innerRadius: '70%'
        }
      },
      series: [{
        name: 'Speed',
        data: [50],
        dataLabels: {
          enabled: false
        },
        type: 'solidgauge'

      }]
    });
  }

  checkState(item, data) {

    console.log('$$$$$$$$$', this.sendRiskList);
  }

  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
    this.riskProfile = this.fb.group({});
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
    console.log(data);
    this.riskAssessments = data.riskAssessments;
    this.riskAssessmentQuestionList = this.riskAssessments.riskAssessmentQuestionList;
    console.log(this.riskAssessmentQuestionList);
  }

  submitRiskAnalysis(data) {
    this.clientRiskAssessmentResults = [];
    const obj = {
      riskAssessmentId: 1,
      clientId: this.clientId,
      advisorId: this.advisorId,
      clientRiskAssessmentResults: []
    };
    this.riskAssessmentQuestionList.forEach(element => {
      this.clientRiskAssessmentResults.push({
        riskAssessmentQuestionId: element.id,
        riskAssessmentChoiceId: element.selectedChoiceId,
        weight: element.weight
      });
    });
    obj.clientRiskAssessmentResults = this.clientRiskAssessmentResults;
    console.log('RiskProfileComponent submitRiskAnalysis solutionList : ', obj);

    this.planService.submitRisk(obj).subscribe(
      data => this.submitRiskRes(data)
    );
  }

  submitRiskRes(data) {
    console.log(data);
    this.showRisk = true;
    this.score = data.score;
  }
}
