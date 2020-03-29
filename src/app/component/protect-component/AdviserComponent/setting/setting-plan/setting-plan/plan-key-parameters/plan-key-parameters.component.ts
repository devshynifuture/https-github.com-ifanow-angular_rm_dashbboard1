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

  constructor(private orgSetting : OrgSettingServiceService,private eventService :EventService, private fb : FormBuilder) { }

  ngOnInit() {
    this.getKeyParameter()
    this.getdataForm('')
    this.advisorId = AuthService.getAdvisorId()
  }

//   lifeExpectancy: (11) [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
// retirementAge: (9) [40, 45, 50, 55, 60, 65, 70, 75, 80]
// savingType: {1: "Group all years together", 2: "Divide"}
// savingStatus: {1: "Break up", 2: "Total"}
// InsurancePlanGrowthRate: (19) [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20]
// key-Params: []
// configuration_type_id: {1: "SavingsType", 2: "RetirementAge", 3: "InsurancePlanning", 4: "SavingsStatus", 5: "LifeExpectancy"


getdataForm(data) {
  this.keyParameter = this.fb.group({
    lifeExpectancy: [(!data.fdType) ? '' : (data.name), [Validators.required]],
    retirementAge: [(!data) ? '' : data.emailId, [Validators.required]],
    savingType: [(!data) ? '' : data.mobileNo, [Validators.required]],
    savingStatus: [(!data) ? '' : data.userName, [Validators.required]],
    InsurancePlanGrowthRate: [(!data) ? '' : data.userName, [Validators.required]],
  });
}

getFormControl(): any {
  return this.keyParameter.controls;
}
  getKeyParameter(){
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getKeyAndParameters(obj).subscribe(
      data => this.getKeyAndParametersRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getKeyAndParametersRes(data){
    console.log('key parameters == ', data)
    this.allParameters = data
    this.lifeExpectancy = data.lifeExpectancy
    this.retirementAge=data.retirementAge
    this.savingType = data.savingType
    this.savingStatus=data.savingStatus
    this.InsurancePlanGrowthRate=data.InsurancePlanGrowthRate
  }
  updateKeyParameter(value){
    console.log('option',value)
    let obj = {
      parameter:1,
      configurationTypeId:1,
      advisorId:this.advisorId

    }
    this.orgSetting.updateKeyParameter(obj).subscribe(
      data => this.updateKeyParameterRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  updateKeyParameterRes(data){
    console.log('update key parameter',data)
  }
}
