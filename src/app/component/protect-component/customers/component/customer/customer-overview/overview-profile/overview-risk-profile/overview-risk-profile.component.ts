import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UtilService, LoaderFunction } from 'src/app/services/util.service';
import * as Highcharts from 'highcharts';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import more from 'highcharts/highcharts-more';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../../plan/plan.service';
import { HistoryRiskProfileComponent } from '../../../plan/profile-plan/history-risk-profile/history-risk-profile.component';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
more(Highcharts);

@Component({
  selector: 'app-overview-risk-profile',
  templateUrl: './overview-risk-profile.component.html',
  styleUrls: ['./overview-risk-profile.component.scss'],
  providers: [LoaderFunction]
})
export class OverviewRiskProfileComponent implements OnInit {
  riskAssessments: any;
  riskAssessmentQuestionList: any;
  riskProfile: any;
  public selection: string;
  sendRiskList: any;
  flag: boolean;
  gaugeOptions: any;
  advisorId: any;
  score;
  showResults = false;
  clickMessage = '';
  showLoader: boolean;
  isLoading = false
  statusArray: any[] = [];
  showErrorMsg
  showButton;
  scoreStatus;
  hasError: boolean = false;

  clientRiskAssessmentResults;

  globalRiskProfile:any;
  feedsRiskProfile:any = {};
  clientId;
  clientInfo:any;
  count:number = 0;
  showRetakeTestsButton: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    public planService: PlanService,
    private customerService: CustomerService,
    public loaderFn: LoaderFunction,
    private subInjectService: SubscriptionInject,
    private eventService: EventService
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientInfo = AuthService.getClientData();
  }

  ngOnInit() {
    this.loadGlobalRiskProfile();
    this.loadRiskProfile();
    this.getdataForm('');
    this.sendRiskList = [];
    // this.progressBar = [];
    this.statusArray = [];
    this.showLoader = true;
    this.showErrorMsg = false
    this.showButton = false
    this.count = 0
  }

  percentage(data) {
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
        labels: { style: { fontWeight: 'bold' } },
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
    this.callFun(data)
  }
  callFun(data) {
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
          { from: 0, to: data.equityAllocationLowerLimit, color: '#D9DEE1' },
          { from: data.equityAllocationLowerLimit, to: data.equityAllocationUpperLimit, color: '#4790ff' },
          { from: data.equityAllocationUpperLimit, to: 100, color: '#D9DEE1' },]
      },
      series: [{ name: 'Measure', pointWidth: 10, data: [0], type: undefined },
      { name: 'Target', type: 'scatter', }]
    });
  }

  checkState(item, i, choice) {
    item.selectedChoiceId = choice.id;
    item.weight = choice.weight;
    item.done = false;
    item.choice = choice.choice;
    if (this.statusArray.length > 0 && item.question) {
      let checkIfQuestionExist = this.statusArray.find(question => question.question == item.question);
      if (!checkIfQuestionExist) {
        this.statusArray.push(item)
      }
    } else if (this.statusArray.length == 0) {
      this.statusArray.push(item)
    }
    const index = item.id
    this.riskAssessmentQuestionList[index].done = true
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

  getRiskProfileList(flag) {
    this.isLoading = true
    this.showButton = false
    this.planService.getRiskProfile('').subscribe(
      data => this.getRiskProfilRes(data, flag)
    );
  }

  getRiskProfilRes(data, flag) {
    this.showButton = true
    this.isLoading = false
    this.statusArray = [];
    console.log(data);
    this.showLoader = false;
    this.riskAssessments = data.riskAssessments;
    this.riskAssessmentQuestionList = this.riskAssessments.riskAssessmentQuestionList;
    this.riskAssessmentQuestionList.forEach(element => {
      element.done = false
    });
    this.riskAssessmentQuestionList[0].done = true
    console.log(this.riskAssessmentQuestionList);
    // if (flag == false) {
    //   this.reset(false)
    // }
  }

  submitRiskAnalysis() {
    this.clientRiskAssessmentResults = [];
    const obj = {
      riskAssessmentId: 1,
      clientId: this.clientId,
      advisorId: this.advisorId,
      clientRiskAssessmentResults: []
    };
    this.riskAssessmentQuestionList.forEach(element => {
      if (element.selectedChoiceId == undefined) {
        this.showErrorMsg = true
      } else {
        this.clientRiskAssessmentResults.push({
          riskAssessmentQuestionId: element.id,
          riskAssessmentChoiceId: element.selectedChoiceId,
          weight: element.weight
        });
        this.showErrorMsg = false
      }
    });
    if (this.showErrorMsg == false) {
      obj.clientRiskAssessmentResults = this.clientRiskAssessmentResults;
      console.log('RiskProfileComponent submitRiskAnalysis solutionList : ', obj);
      this.planService.submitRisk(obj).subscribe(
        data => this.submitRiskRes(data), error => {
          this.showErrorMsg = true
          //this.submitRiskRes(data);
        }
      );
    }
  }

  submitRiskRes(data) {
    this.isLoading = false
    this.showResults = true;
    setTimeout(() => {
      this.percentage(data)
    }, 300);
    if (data) {
      this.feedsRiskProfile = {
        "riskAssessmentScore": data.score,
        "riskProfileId": data.id,
        "riskProfileStatus": data.riskProfileName,
      }
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
        if (UtilService.isDialogClose(sideBarData)) {
          this.getResultData(sideBarData)
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  getResultData(data) {
    if (data != undefined) {
      this.showResults = false
      if (data.refreshRequired == false) {
        this.reset();
      } else if (data.refreshRequired) {
        this.riskAssessmentQuestionList = data.refreshRequired
        this.statusArray = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        this.showButton = false
        this.showRetakeTestsButton = true;
      } else {
        this.reset();
      }
    }
  }

  reset() {
    this.showRetakeTestsButton = false;
    this.getRiskProfileList(true);
    this.showResults = false;
  }

  loadGlobalRiskProfile() {
    this.customerService.getGlobalRiskProfile({}).subscribe(res => {
      if (res == null) {
        this.globalRiskProfile = [];
      } else {
        this.globalRiskProfile = res;
      }
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadRiskProfile() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.loaderFn.increaseCounter();
    this.customerService.getRiskProfile(obj).subscribe(res => {
      if (res) {
        this.feedsRiskProfile = res[0];
        this.showResults = true;
      }
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }


  riskProfileMaxScore(id) {
    if (this.globalRiskProfile.length > 0) {
      return this.globalRiskProfile.find(data => data.id == id).scoreUpperLimit;
    } else {
      return 0;
    }
  }

  riskProfileDesc(id) {
    if (this.globalRiskProfile.length > 0) {
      return this.globalRiskProfile.find(data => data.id == id).description;
    } else {
      return '';
    }
  }
}
