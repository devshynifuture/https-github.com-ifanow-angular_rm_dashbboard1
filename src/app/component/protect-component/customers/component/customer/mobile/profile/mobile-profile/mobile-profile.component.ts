import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../customer.service';
import { runInThisContext } from 'vm';
import { Validators, FormBuilder } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { LoginService } from 'src/app/component/no-protected/login/login.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PlanService } from '../../../plan/plan.service';
import Highcharts from 'highcharts';
import { SettingsService } from 'src/app/component/protect-component/AdviserComponent/setting/settings.service';

@Component({
  selector: 'app-mobile-profile',
  templateUrl: './mobile-profile.component.html',
  styleUrls: ['./mobile-profile.component.scss']
})
export class MobileProfileComponent implements OnInit {
  openMenue: boolean = false;
  inputData: any;
  clientId: any;
  familyMembers: any;
  advisorId: any;
  clientData: any;
  documentVault: any = {};
  hideShowFlag: string;
  setNewPasswordForm: any;
  validatorType = ValidatorType;
  riskAssessments: any;
  riskAssessmentQuestionList: any;
  showResults: boolean;
  clientRiskAssessmentResults: any[];
  showErrorMsg: boolean;
  globalRiskProfile: any;
  feedsRiskProfile: any = {};
  advisorPersonalData: any;
  orgnisationData: any;
  constructor(private cusService: CustomerService,
    private fb: FormBuilder,
    private loginService: LoginService,
    private event: EventService,
    private planService: PlanService,
    private settingService: SettingsService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.hideShowFlag = "profile";
    this.setNewPasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]]
    });
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.clientData = AuthService.getClientData();
    this.getFamilyMemberList();
    this.getDocumentVaultData();
  }
  loadGlobalRiskProfile() {
    // this.loaderFn.increaseCounter();
    // this.hasError = false;
    this.cusService.getGlobalRiskProfile({}).subscribe(res => {
      if (res == null) {
        this.globalRiskProfile = [];
      } else {
        this.globalRiskProfile = res;
      }
      this.loadRiskProfile();
      // this.loaderFn.decreaseCounter();
    }, err => {
      // this.hasError = true;
      this.event.openSnackBar(err, "Dismiss")
      // this.loaderFn.decreaseCounter();
    })
  }
  loadRiskProfile() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    // this.loaderFn.increaseCounter();
    // this.hasError = false;
    this.cusService.getRiskProfile(obj).subscribe(res => {
      if (res) {
        this.feedsRiskProfile = res[0];
        this.showResults = true;
        // this.isEmpty = false;

        const globalProfile = this.globalRiskProfile.find(risk => risk.id == this.feedsRiskProfile.riskProfileId);
        if (globalProfile) {
          this.feedsRiskProfile = {
            equityAllocationUpperLimit: globalProfile.equityAllocationUpperLimit,
            equityAllocationLowerLimit: globalProfile.equityAllocationLowerLimit,
            ...this.feedsRiskProfile
          }
          // setTimeout(() => {
          //   this.percentage(this.feedsRiskProfile)
          // });
        } else {
          this.getRiskProfileList();
          // this.feedsRiskProfile = {
          //   equityAllocationUpperLimit: 0,
          //   equityAllocationLowerLimit: 0,
          //   ...this.feedsRiskProfile
          // }
        }

      } else {

        this.showResults = false;
        // this.isEmpty = true;
      }
      // this.loaderFn.decreaseCounter();
    }, err => {
      // this.hasError = true;
      this.event.openSnackBar(err, "Dismiss")
      // this.loaderFn.decreaseCounter();
    })
  }
  openMenu(flag) {
    if (flag == false) {
      this.openMenue = true
    } else {
      this.openMenue = false
    }
  }

  getFamilyMemberList() {

    const obj = {
      clientId: this.clientId,
      id: 0
    };
    this.cusService.getFamilyMembers(obj).subscribe(
      data => {
        this.getFamilyMemberListRes(data)
      });

  }

  getFamilyMemberListRes(data) {
    if (data && data.length > 0) {
      this.familyMembers = data;
    }
  }

  getDocumentVaultData() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      limit: 5
    }
    this.cusService.getDocumentsFeed(obj).subscribe(data => {
      this.getDocumentVaultDataRes(data)
    })
  }

  getDocumentVaultDataRes(data) {
    if (data) {
      this.documentVault = data;
      this.documentVault.familyStats.unshift({
        relationshipId: (this.clientData.genderId == 1 ? 2 : 3),
        genderId: 0
      })
    }
  }

  setNewPassword() {
    if (this.setNewPasswordForm.invalid) {
      this.setNewPasswordForm.markAllAsTouched();
      return;
    } else {
      // this.barButtonOptions.active = true;
      const obj = {
        password: this.setNewPasswordForm.controls.oldPassword.value,
        newPassword: this.setNewPasswordForm.controls.confirmPassword.value,
        userId: this.clientData.userId
      };
      this.loginService.resetPasswordPostLoggedIn(obj).subscribe(data => {
        // this.barButtonOptions.active = false;
        this.event.openSnackBar(data, "Dismiss");
        // this.Close();
        this.hideShowFlag = "profile";
      }, err => {
        this.event.showErrorMessage(err.message);
        // this.barButtonOptions.active = false;
      });
    }
  }

  checkPassword() {
    const password = this.setNewPasswordForm.get('newPassword').value;
    const confirm_new_password = this.setNewPasswordForm.get('confirmPassword').value;
    if (password !== '' && confirm_new_password !== '') {
      if (confirm_new_password !== password) {
        this.setNewPasswordForm.get('confirmPassword').setErrors({ mismatch: true });
      } else {
        this.setNewPasswordForm.get('confirmPassword').setErrors(null);
      }
    }
  }

  getRiskProfileList() {
    this.showResults = false;
    this.riskAssessmentQuestionList = []
    this.planService.getRiskProfile('').subscribe(
      data => this.getRiskProfilRes(data)
    ), err => {
    };
  }
  getRiskProfilRes(data) {
    // this.showButton = true
    // this.loaderFn.decreaseCounter();
    // this.statusArray = [];
    // this.showLoader = false;
    this.riskAssessments = data.riskAssessments;
    this.riskAssessmentQuestionList = this.riskAssessments.riskAssessmentQuestionList;
    this.riskAssessmentQuestionList.forEach(element => {
      element.done = false;
    });
    // this.showQuestionnaire = true;
    // this.isEmpty = false;
    // this.showRetakeTestsButton = false;
    // this.showResults = false;
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
          this.event.openSnackBar(error, "Dismiss")
          //this.submitRiskRes(data);
        }
      );
    }
    else {
      this.event.openSnackBar("Please complete all questions for test result", "Dismiss");
    }
  }

  submitRiskRes(data) {
    // this.isLoading = false
    this.showResults = true;
    // this.isEmpty = false;
    // this.showQuestionnaire = false;
    if (data) {
      this.mergeRiskProfile(data);
    }
  }

  mergeRiskProfile(data) {
    const globalProfile = this.globalRiskProfile.find(risk => risk.id == data.id);
    if (globalProfile) {
      this.feedsRiskProfile = {
        "riskAssessmentDate": new Date(),
        "riskAssessmentScore": data.score,
        "riskProfileId": data.id,
        "riskProfileStatus": data.riskProfileName,
        equityAllocationUpperLimit: globalProfile.equityAllocationUpperLimit,
        equityAllocationLowerLimit: globalProfile.equityAllocationLowerLimit,
      }
    } else {
      this.feedsRiskProfile = {
        "riskAssessmentDate": new Date(),
        "riskAssessmentScore": data.score,
        "riskProfileId": data.id,
        "riskProfileStatus": data.riskProfileName,
        equityAllocationUpperLimit: data.equityAllocationUpperLimit,
        equityAllocationLowerLimit: data.equityAllocationLowerLimit,
      }
    }
    // }
    setTimeout(() => {
      this.percentage(this.feedsRiskProfile)
    }, 300);
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
    var chart1 = new Highcharts.Chart({

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


  getOrgaizationDetails() {
    const obj = {
      advisorId: this.advisorId,
    };
    this.settingService.getOrgProfile(obj).subscribe(
      data => {
        this.orgnisationData = data;
      })
  }

  getAdvisorPersonalDetails() {
    const obj = {
      id: this.advisorId
    };

    this.settingService.getPersonalProfile(obj).subscribe(
      data => {
        if (data) {
          this.advisorPersonalData = data;
        }
      })
  }

}
