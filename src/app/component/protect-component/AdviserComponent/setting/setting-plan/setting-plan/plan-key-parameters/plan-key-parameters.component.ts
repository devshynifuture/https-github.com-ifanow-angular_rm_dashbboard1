import { Component, OnInit } from '@angular/core';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-plan-key-parameters',
  templateUrl: './plan-key-parameters.component.html',
  styleUrls: ['./plan-key-parameters.component.scss']
})
export class PlanKeyParametersComponent implements OnInit {
  allParameters: any;
  lifeExpentancy: any;
  retirementAge: any;
  savingType: any;
  savingStatus: any;
  InsurancePlanGrowthRate: any;
  lifeExpectancy: any;
  keyParameter: any;
  advisorId: any;
  isLoading = false;
  idWiseData: any;
  getSavingType: any;
  getRetirementData: any;
  getSavingStatus: any;
  getInsurancePlanningData: any;
  getLifeExpentancy: any;
  hasError: boolean = false;
  constructor(private orgSetting: OrgSettingServiceService, private eventService: EventService, private fb: FormBuilder) {
    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.getKeyParameter()
    this.getdataForm()

  }

  //   lifeExpectancy: (11) [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
  // retirementAge: (9) [40, 45, 50, 55, 60, 65, 70, 75, 80]
  // savingType: {1: "Group all years together", 2: "Divide"}
  // savingStatus: {1: "Break up", 2: "Total"}
  // InsurancePlanGrowthRate: (19) [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  // key-Params: []
  // configuration_type_id: {1: "SavingsType", 2: "RetirementAge", 3: "InsurancePlanning", 4: "SavingsStatus", 5: "LifeExpectancy"


  getdataForm() {
    this.keyParameter = this.fb.group({
      lifeExpectancy: [(!this.getLifeExpentancy) ? '' : (this.getLifeExpentancy.parameter), [Validators.required]],
      retirementAge: [(!this.getRetirementData) ? '' : this.getRetirementData.parameter, [Validators.required]],
      savingType: [(!this.getSavingType) ? '' : (this.getSavingType.parameter) + "", [Validators.required]],
      savingStatus: [(!this.getSavingStatus) ? '' : (this.getSavingStatus.parameter) + "", [Validators.required]],
      InsurancePlanGrowthRate: [(!this.getInsurancePlanningData) ? '' : this.getInsurancePlanningData.parameter, [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.keyParameter.controls;
  }
  getKeyParameter() {
    this.isLoading = true;
    this.hasError = false;
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getKeyAndParameters(obj).subscribe(
      data => {
        this.getKeyAndParametersRes(data)
        this.isLoading = false;
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
        this.isLoading = false;
        this.hasError = true;
      }
    );
  }
  getKeyAndParametersRes(data) {
    if (data) {
      this.allParameters = data
      this.idWiseData = data.key_Params;

      this.getSavingType = this.idWiseData.filter(element => element.configurationTypeId == 1)
      this.getSavingType = this.getSavingType[0]
      this.getRetirementData = this.idWiseData.filter(element => element.configurationTypeId == 2)
      this.getRetirementData = this.getRetirementData[0]
      this.getInsurancePlanningData = this.idWiseData.filter(element => element.configurationTypeId == 3)
      this.getInsurancePlanningData = this.getInsurancePlanningData[0]
      this.getSavingStatus = this.idWiseData.filter(element => element.configurationTypeId == 4)
      this.getSavingStatus = this.getSavingStatus[0]
      this.getLifeExpentancy = this.idWiseData.filter(element => element.configurationTypeId == 5)
      this.getLifeExpentancy = this.getLifeExpentancy[0]

      this.lifeExpectancy = data.lifeExpectancy
      this.retirementAge = data.retirementAge
      this.savingType = data.savingType
      this.savingStatus = data.savingStatus
      this.InsurancePlanGrowthRate = data.InsurancePlanGrowthRate
      this.getdataForm()
    } else {
      this.allParameters = []
    }
  }
  updateKeyParameter(value, id) {
    let obj = {
      parameter: (value.value == undefined) ? value : value.value,
      configurationTypeId: id,
      advisorId: this.advisorId
    }
    this.orgSetting.updateKeyParameter(obj).subscribe(
      data => {},
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
}
