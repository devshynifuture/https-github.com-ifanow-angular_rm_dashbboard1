import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
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
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from '../../customer-overview.service';
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
  showErrorMsg = false;
  showButton;
  scoreStatus;
  hasError: boolean = false;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('riskTemp', { static: false }) riskTemp: ElementRef;

  clientRiskAssessmentResults;

  globalRiskProfile: any[] = [];
  feedsRiskProfile: any = {};
  clientId;
  clientInfo: any;
  count: number = 0;
  showRetakeTestsButton: boolean = false;

  isEmpty: boolean = true;
  showQuestionnaire: boolean = false;
  getOrgData: any;
  userInfo: any;
  reportDate: Date;
  fragmentData = { isSpinner: false };
  returnValue: any;
  svg: any;
  chart: Highcharts.Chart;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Output() loadsvg = new EventEmitter();

  @Input() finPlanObj: any;
  dateOfTest: any;
  riskProfileCapability: any = {};

  constructor(
    private fb: FormBuilder,
    public planService: PlanService,
    private customerService: CustomerService,
    public loaderFn: LoaderFunction,
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private utilService: UtilService,
    private ref: ChangeDetectorRef,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientInfo = AuthService.getClientData();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.reportDate = new Date()
    console.log('clientInfo', this.clientInfo)
  }

  ngOnInit() {
    this.riskProfileCapability = this.roleService.overviewPermission.subModules.profile.subModule.riskProfile.capabilityList
    console.log(this.finPlanObj)
    if (this.finPlanObj && this.finPlanObj.data) {
      if (!this.customerOverview.globalRiskProfileData) {
        this.loadGlobalRiskProfile();
      } else {
        this.loaderFn.increaseCounter();
        this.loadGlobalRiskProfileRes(this.customerOverview.globalRiskProfileData);
      }
      this.riskAssessmentQuestionList = this.finPlanObj.data.assessmentResult
      this.dateOfTest = this.finPlanObj.data.assessmentScore.riskAssessmentDate
      this.mergeRiskProfile(this.finPlanObj.data.assessmentScore);
      this.showQuestionnaire = true;
      this.showResults = true;
      this.showErrorMsg = false;
      this.statusArray = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
      this.showButton = false
      this.showRetakeTestsButton = true;

    }
    if (!this.customerOverview.globalRiskProfileData) {
      this.loadGlobalRiskProfile();
    } else {
      this.loaderFn.increaseCounter();
      this.loadGlobalRiskProfileRes(this.customerOverview.globalRiskProfileData);
    }
    this.getdataForm('');
    this.sendRiskList = [];
    // this.progressBar = [];
    this.statusArray = [];
    this.showLoader = true;
    this.showErrorMsg = false
    this.showButton = false
    this.count = 0
  }
  download(template, tableTitle) {
    this.svg = this.chart.getSVG();
    //let rows = this.tableEl._elementRef.nativeElement.rows;
    this.fragmentData.isSpinner = true;
    const para = document.getElementById(template);
    const obj = {
      htmlInput: para.innerHTML,
      name: tableTitle,
      landscape: true,
      key: 'showPieChart',
      svg: this.svg
    };
    let header = null
    this.returnValue = this.utilService.htmlToPdf(header, para.innerHTML, tableTitle, false, this.fragmentData, 'showPieChart', this.svg, true, null);
    console.log('return value ====', this.returnValue);
    return obj;
  }
  percentage(data) {
    Highcharts.setOptions({
      chart: {
        type: 'bar',
        margin: [5, 25, 30, 60],
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
    this.chart = new Highcharts.Chart({

      chart: { renderTo: 'container1' },
      xAxis: { categories: ['<span class="hc-cat-title"></span>'] },
      yAxis: {
        min: 0,
        max: 100,
        offset: 18,
        lineWidth: 2,
        lineColor: 'black',
        tickLength: 4,
        labels: { y: 10, format: '{value}%', style: { fontSize: '12px', fontWeight: 'bold', color: 'black' } },
        plotBands: [
          { from: 0, to: data.equityAllocationLowerLimit, color: '#D9DEE1' },
          { from: data.equityAllocationLowerLimit, to: data.equityAllocationUpperLimit, color: '#008FFF' },
          { from: data.equityAllocationUpperLimit, to: 100, color: '#D9DEE1' },]
      },
      series: [{ name: 'Measure', pointWidth: 10, data: [0], type: undefined },
      { name: 'Target', type: 'scatter', }]
    });
  }

  checkState(item, i, choice) {
    item.selectedChoiceId = choice.id;
    item.weight = choice.weight;
    item.done = true;
    item.choice = choice.choice;
    if (this.statusArray.length > 0 && item.question) {
      let checkIfQuestionExist = this.statusArray.find(question => question.question == item.question);
      if (!checkIfQuestionExist) {
        this.statusArray.push(item)
      }
    } else if (this.statusArray.length == 0) {
      this.statusArray.push(item)
    }
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
    this.showButton = false;
    this.hasError = false;
    this.loaderFn.increaseCounter();
    this.planService.getRiskProfile('').subscribe(
      data => this.getRiskProfilRes(data, flag)
    ), err => {
      this.hasError = true;
      this.loaderFn.decreaseCounter();
    };
  }

  getRiskProfilRes(data, flag) {
    this.showButton = true
    this.loaderFn.decreaseCounter();
    this.statusArray = [];
    this.showLoader = false;
    this.riskAssessments = data.riskAssessments;
    this.riskAssessmentQuestionList = this.riskAssessments.riskAssessmentQuestionList;
    this.riskAssessmentQuestionList.forEach(element => {
      element.done = false
    });
    this.showQuestionnaire = true;
    this.isEmpty = false;
    this.showRetakeTestsButton = false;
    this.showResults = false;
  }

  takeTests() {
    this.getRiskProfileList(true);
  }


  submitRiskAnalysis() {
    this.clientRiskAssessmentResults = [];
    const obj = {
      riskAssessmentId: 1,
      clientId: this.clientId,
      advisorId: this.advisorId,
      clientRiskAssessmentResults: []
    };
    this.showErrorMsg = false;
    this.riskAssessmentQuestionList.forEach(element => {
      if (element.selectedChoiceId == undefined) {
        this.showErrorMsg = true
      } else {
        this.clientRiskAssessmentResults.push({
          riskAssessmentQuestionId: element.id,
          riskAssessmentChoiceId: element.selectedChoiceId,
          weight: element.weight
        });
      }
    });
    if (!this.showErrorMsg) {
      obj.clientRiskAssessmentResults = this.clientRiskAssessmentResults;
      this.planService.submitRisk(obj).subscribe(
        data => this.submitRiskRes(data), error => {
          this.showErrorMsg = true;
          this.eventService.openSnackBar(error, "Dismiss")
          //this.submitRiskRes(data);
        }
      );
    }
  }

  submitRiskRes(data) {
    this.customerOverview.riskProfileData = undefined;
    this.isLoading = false
    this.showResults = true;
    this.isEmpty = false;
    this.showQuestionnaire = false;
    if (data) {
      this.mergeRiskProfile(data);
    }
  }

  mergeRiskProfile(data) {
    const globalProfile = this.globalRiskProfile.find(risk => risk.id == data.id);
    if (globalProfile) {
      this.feedsRiskProfile = {
        "riskAssessmentScore": data.score,
        "riskProfileId": data.id,
        "riskProfileStatus": data.riskProfileName,
        equityAllocationUpperLimit: globalProfile.equityAllocationUpperLimit,
        equityAllocationLowerLimit: globalProfile.equityAllocationLowerLimit,
      }
    } else {
      this.feedsRiskProfile = {
        "riskAssessmentScore": data.score,
        "riskProfileId": data.id,
        "riskProfileStatus": data.riskProfileName,
        equityAllocationUpperLimit: data.equityAllocationUpperLimit,
        equityAllocationLowerLimit: data.equityAllocationLowerLimit,
      }
    }
    setTimeout(() => {
      this.percentage(this.feedsRiskProfile)
    }, 300);
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
      if (data.refreshRequired == false) {
      } else if (data.refreshRequired) {
        this.showQuestionnaire = true;
        this.showResults = true;
        this.riskAssessmentQuestionList = data.data.assessmentResult;
        this.dateOfTest = data.data.assessmentScore.riskAssessmentDate
        this.mergeRiskProfile(data.data.assessmentScore);
        this.showErrorMsg = false;
        this.statusArray = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        this.showButton = false
        this.showRetakeTestsButton = true;
      }
    }
  }
  loadGlobalRiskProfile() {
    this.loaderFn.increaseCounter();
    this.hasError = false;
    this.customerService.getGlobalRiskProfile({}).subscribe(res => {
      this.loadGlobalRiskProfileRes(res);
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadGlobalRiskProfileRes(res) {
    this.customerOverview.globalRiskProfileData = res;
    if (res == null) {
      this.globalRiskProfile = [];
    } else {
      res.forEach(element => {
        element['selected'] = false;
      });
      this.globalRiskProfile = res;
    }
    if (!this.customerOverview.riskProfileData) {
      this.loadRiskProfile();
    } else {
      this.loaderFn.increaseCounter();
      this.loadRiskProfileRes(this.customerOverview.riskProfileData);
    }
    this.loaderFn.decreaseCounter();
  }

  loadRiskProfile() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.loaderFn.increaseCounter();
    this.hasError = false;
    this.customerService.getRiskProfile(obj).subscribe(res => {
      this.loadRiskProfileRes(res);
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  retakeTest() {
    this.isEmpty = true;
  }

  loadRiskProfileRes(res) {
    this.customerOverview.riskProfileData = res;
    if (res) {
      this.feedsRiskProfile = res[0];
      this.showResults = true;
      this.isEmpty = false;

      const globalProfile = this.globalRiskProfile.find(risk => risk.id == this.feedsRiskProfile.riskProfileId);
      if (globalProfile) {
        this.feedsRiskProfile = {
          equityAllocationUpperLimit: globalProfile.equityAllocationUpperLimit,
          equityAllocationLowerLimit: globalProfile.equityAllocationLowerLimit,
          ...this.feedsRiskProfile
        }
      } else {
        this.feedsRiskProfile = {
          equityAllocationUpperLimit: 0,
          equityAllocationLowerLimit: 0,
          ...this.feedsRiskProfile
        }
      }
      setTimeout(() => {
        this.percentage(this.feedsRiskProfile)
      });
      if (this.chart) {
        this.svg = this.chart.getSVG();
      }
      if (this.finPlanObj) {
        this.ref.detectChanges();//to refresh the dom when response come
        this.loaded.emit(this.riskTemp.nativeElement);
        this.loadsvg.emit(this.svg)

      }
    } else {

      this.showResults = false;
      this.isEmpty = true;
    }
    this.loaderFn.decreaseCounter();
  }

  cancelTest() {
    this.showQuestionnaire = false;
    this.loadRiskProfile();
  }


  riskProfileMaxScore(id) {
    if (this.globalRiskProfile.length > 0) {
      return this.globalRiskProfile.find(data => data.id == id).scoreUpperLimit;
    } else {
      return 0;
    }
  }

  riskProfileDesc(id) {
    if (id) {
      if (this.globalRiskProfile.length > 0) {
        return this.globalRiskProfile.find(data => data.id == id).description;
      } else {
        return '';
      }
    }

  }
}
