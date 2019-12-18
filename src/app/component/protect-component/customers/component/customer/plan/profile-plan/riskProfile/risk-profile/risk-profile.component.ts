import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../plan.service';
import { FormBuilder } from '@angular/forms';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
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
  showLoader : boolean;

  onClickMe(referenceKeyName) {
    alert(referenceKeyName.id);
  }
  onClick(referenceKeyName1) {
    alert(referenceKeyName1.id);
  }
  constructor(private fb: FormBuilder, public planService: PlanService, ) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getRiskProfileList();
    this.getdataForm('');
    this.sendRiskList = [];
    this.array = [];
    this.showLoader = true;
    this.showErrorMsg = false
    this.count = 0
  }
  percentage(chartId) {
    Highcharts.setOptions({
      chart: {
        type: 'bar',
        margin: [5, 25, 10, 60],
      },
      credits: { enabled: false },
      exporting: { enabled: false },
      legend: { enabled: false },
      title: { text: '' },
      xAxis: {
        tickLength: 2,
        tickWidth: 1,
        lineColor: '#999',
        lineWidth: 1,
        labels: { style: { fontWeight: 'bold' } }
      },
      yAxis: {
        min: 0,
        minPadding: 0,
        maxPadding: 0,
        tickColor: 'black',
        tickWidth: 1,
        tickLength: 3,
        gridLineWidth: 0,
        endOnTick: true,
        title: { text: '' },
        labels: {
          y: 10,
          style: {
            fontSize: '8px'
          },
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, .85)',
        borderWidth: 0,
        shadow: true,
        style: { fontSize: '10px', padding: '2px' },
        formatter: function () {
          return this.series.name + ": <strong>" + Highcharts.numberFormat(this.y, 2) + "</strong>";
        }
      },
      plotOptions: {
        bar: {
          color: '#000',
          shadow: false,
          borderWidth: 0,
        },
        scatter: {
          marker: {
            symbol: 'line',
            lineWidth: 3,
            radius: 8,
            lineColor: '#000'
          }
        }
      }
    });
    this.callFun()
  }
  callFun() {
    var chart1 = new Highcharts.Chart({
      chart: { renderTo: 'container1' },
      xAxis: { categories: ['<span class="hc-cat-title">Equity%</span>']},
      yAxis: {
        min:0,
        max: 100,
        lineWidth: 2,
        lineColor: 'black',
        labels: { y: 10, format: '{value}%', style: { fontSize: '12px' ,fontWeight:'bold',color:'black'} },
        plotBands: [{ from: 0, to: 20, color: '#CACFD2' },
        { from: 20, to: 40, color: '#CACFD2' },
        { from: 40, to: 60, color: '#CACFD2' },
         { from: 60, to: 80, color: '#CACFD2' },
          { from: 80, to: 100, color: '#CACFD2' },]
      },
      
      series: [{ name: 'Measure', pointWidth: 10, data: [80] },
      { name: 'Target', type: 'scatter', data: [90], }]
    });
  //   Highcharts.Renderer.prototype.symbols.line = function(x, y, width, height) {
  //     return ['M',x ,y + width / 2,'L',x+height,y + width / 2];
  // };
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
        data: [this.score],
        dataLabels: 1,
        tooltip: {
          valueSuffix: ' km/h'
        },
      }]

    }));
  }
  checkState(item) {

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
    this.showLoader = false;
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
        this.showErrorMsg = true
        //this.submitRiskRes(data);
      }
    );
  }

  submitRiskRes(data) {
    this.showRisk = true;
    setTimeout(() => {
      this.guageFun('Gauge');
      this.percentage('container1')
    }, 300);
    if (data) {
      console.log(data);
      this.score = data.score;
    }
  }
}
