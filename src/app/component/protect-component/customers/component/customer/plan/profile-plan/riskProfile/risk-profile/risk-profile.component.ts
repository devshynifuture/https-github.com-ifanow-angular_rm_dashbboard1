import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../plan.service';
import { FormBuilder } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { AuthService } from 'src/app/auth-service/authService';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';

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

  constructor(private fb: FormBuilder, public planService: PlanService, ) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getRiskProfileList();
    this.getdataForm('');
    this.sendRiskList = [];
  }
  percentage(chartId) {
    Highcharts.setOptions({
      chart: {
          inverted: true,
          marginLeft: 135,
          type: 'bullet'
      },
      title: {
          text: null
      },
      legend: {
          enabled: false
      },
      yAxis: {
          gridLineWidth: 0
      },
      plotOptions: {
          // series: {
          //     pointPadding: 0.25,
          //     borderWidth: 0,
          //     color: '#000',
          //     targetOptions: {
          //         width: '200%'
          //     }
          // }
      },
      credits: {
          enabled: false
      },
      exporting: {
          enabled: false
      }
  });
  this.callFun()
  }
  callFun(){
    Highcharts.chart('container2', {
      xAxis: {
          categories: ['<span class="hc-cat-title">Profit</span><br/>%']
      },
      yAxis: {
          plotBands: [{
              from: 0,
              to: 20,
              color: '#666'
          }, {
              from: 20,
              to: 25,
              color: '#999'
          }, {
              from: 25,
              to: 100,
              color: '#bbb'
          }],
          labels: {
              format: '{value}%'
          },
          title: null
      },
      // series: [{
      //     data: [{
      //         y: 22,
      //         target: 27
      //     }]
      // }],
      tooltip: {
          pointFormat: '<b>{point.y}</b> (with target at {point.target})'
      }
  });
  }
  guageFun(chartId) {
    this.gaugeOptions = {

      chart: {
        type: 'gauge'
      },

      title: null,

      pane: {
        center: ['45%', '80%'],
        size: '140%',
       startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: '#EEE',
          innerRadius: '70%',
          outerRadius: '100%',
          shape: 'solid'
        }
      },

      tooltip: {
        enabled: false
      },

      // the value axis
      yAxis: {
        plotBands: [{
          from: 1,
          to: 40,
          color: '#02B875',
          thickness: '30%'
        }, {
          from: 41,
          to: 80,
          color: '#5DC644',
          thickness: '30%'
        }, {
          from: 81,
          to: 120,
          color: '#FFC100',
          thickness: '30%'
        },
        {
          from: 121,
          to: 160,
          color: '#FDAF40',
          thickness: '30%'
        }, {
          from: 161,
          to: 200,
          color: '#FF7272',
          thickness: '30%'
        }],
        lineWidth: 0,
        minorTickInterval: 1,
        tickPositions: [1, 200],
        tickAmount: 1,
        min: 1,
        max: 200,
        title: {
          y: -70
        },
        labels: {
          y: 16
        }
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
          },
          marker: {
            enabled: true,
            symbol: 'triangle',
          }
        },
      }
    };
    this.container()
  }
  container() {
    var chartSpeed = Highcharts.chart('Gauge', Highcharts.merge(this.gaugeOptions, {
      yAxis: {
        title: {
          text: ''
        },
      },

      credits: {
        enabled: true
      },

      series: [{
        name: '',
        data: [100],
        dataLabels: 1,
        tooltip: {
          valueSuffix: ' km/h'
        },
      }]

    }));
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
      data => this.submitRiskRes(data), error => {
        this.submitRiskRes(data);
      }
    );
  }

  submitRiskRes(data) {
    this.showRisk = true;
    setTimeout(() => {
      this.guageFun('Gauge');

    }, 300);
    if (data) {
      console.log(data);
      this.score = data.score;
    }
  }
}
