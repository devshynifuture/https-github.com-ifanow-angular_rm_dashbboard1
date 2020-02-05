import {Component, OnInit} from '@angular/core';
import {PlanService} from '../../../plan.service';
import {FormBuilder} from '@angular/forms';
import {UtilService} from 'src/app/services/util.service';
import * as Highcharts from 'highcharts';
import {AuthService} from 'src/app/auth-service/authService';
import {HistoryRiskProfileComponent} from '../../history-risk-profile/history-risk-profile.component';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import more from 'highcharts/highcharts-more';
more(Highcharts);

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
  showLoader: boolean;

  onClickMe(referenceKeyName) {
    alert(referenceKeyName.id);
  }
  onClick(referenceKeyName1) {
    alert(referenceKeyName1.id);
  }
  constructor(private fb: FormBuilder, public planService: PlanService, private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getRiskProfileList();
    this.getdataForm('');
    this.sendRiskList = [];
    this.progressBar = [];
    this.statusArray = [];
    this.showLoader = true;
    this.showErrorMsg = false
    this.showButton = true
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
        tickLength: 8,
        tickWidth: 4,
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
      xAxis: { categories: ['<span class="hc-cat-title">Equity%</span>'] },
      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 2,
        lineColor: 'black',
        tickLength: 4,
        labels: { y: 10, format: '{value}%', style: { fontSize: '12px', fontWeight: 'bold', color: 'black' } },
        plotBands: [
          { from: 0, to: this.equityAllocationLowerLimit, color: '#CACFD2' },
          { from: this.equityAllocationLowerLimit, to: this.equityAllocationUpperLimit, color: '#4790ff' },
          { from: this.equityAllocationUpperLimit, to: 100, color: '#CACFD2' },]
      },
      series: [{ name: 'Measure', pointWidth: 10, data: [0], type: undefined },
      { name: 'Target', type: 'scatter', }]
    });
  }
  guageFun(chartId) {
    this.gaugeOptions = {
      chart: {
        type: 'gauge'
      },
      title: null,
      pane: {
        center: ['40%', '80%'],
        size: '150%',
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
        min: 0,
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
          valueSuffix: ''
        },
      }]

    }));
  }
  checkState(item) {
    this.statusArray.push(item)
    // this.statusArray = _.uniqBy(this.statusArray, function (e) {
    //   return e.id;
    // });
    this.progressBar = this.statusArray.length * 20
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
      this.equityAllocationLowerLimit = data.equityAllocationLowerLimit
      this.equityAllocationUpperLimit = data.equityAllocationUpperLimit
    }
  }
  open(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      data,
      state: 'open30',
      componentName: HistoryRiskProfileComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        this.getResultData(sideBarData)
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  getResultData(data) {
    console.log(data)

    if (data != undefined) {
      this.showRisk = false
      this.riskAssessmentQuestionList = data.data
      this.showButton = false
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
