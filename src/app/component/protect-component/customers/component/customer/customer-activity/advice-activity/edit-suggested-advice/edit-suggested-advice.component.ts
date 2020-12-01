import { Component, OnInit, QueryList, ViewChildren, Input } from '@angular/core';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { ValidatorType } from 'src/app/services/util.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ActiityService } from '../../actiity.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-edit-suggested-advice',
  templateUrl: './edit-suggested-advice.component.html',
  styleUrls: ['./edit-suggested-advice.component.scss']
})
export class EditSuggestedAdviceComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'PROCEED',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  adviceHeaderList: any;
  count = 0;
  adviceToCategoryTypeMasterId: any;
  adviceToCategoryId: any;
  formStep: number = 1;
  componentRef;
  validatorType = ValidatorType;

  adviceForm: FormGroup = this.fb.group({
    "header": [],
    "headerEdit": [],
    "rationale": [],
    "status": [, Validators.required],
    "givenOnDate": [, Validators.required],
    "implementDate": [, Validators.required],
    // "withdrawalAmt": [, Validators.required],
    "consentOption": ['1', Validators.required],
  })
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  dataForEdit: any;
  flag: string;
  id: any;
  constructor(private subInjectService:SubscriptionInject,private datePipe: DatePipe,private activityService:ActiityService,private event:EventService,private fb: FormBuilder) { }
  @Input() set data(data) {
    this.adviceHeaderList = data ? data.adviceHeaderList : '';
    this.adviceToCategoryId = data.adviceToCategoryId;
    this.adviceToCategoryTypeMasterId = data ? data.adviceDetails.adviceToCategoryTypeMasterId : ''
    this.getFormData(data);
    // this.setInsuranceDataFormField(data);
    console.log(data);
  }
  ngOnInit() {
  }
  getFormData(data) {
    if (data ? data.adviceDetails == null : data == null) {
      data = {};
      this.dataForEdit = null;
      this.flag = 'Add';
    } else {
      this.dataForEdit = data ? data.adviceDetails : '';
      this.dataForEdit.adviceStatus = (this.dataForEdit ? (this.dataForEdit.adviceStatusId == 1 ? 'GIVEN' : this.dataForEdit.adviceStatusId == 2 ? 'AWAITING CONSENT' : this.dataForEdit.adviceStatusId == 3 ? 'ACCEPTED' : this.dataForEdit.adviceStatusId == 4 ? 'IN PROGRESS' : this.dataForEdit.adviceStatusId == 5 ? 'IMPLEMENTED' : this.dataForEdit.adviceStatusId == 6 ? 'DECLINED' : this.dataForEdit.adviceStatusId == 7 ? 'PENDING' : this.dataForEdit.adviceStatusId == 8 ? 'SYSTEM GENERATED' : this.dataForEdit.adviceStatusId == 9 ? 'REVISED' : '') : null)
      this.id = this.dataForEdit.id;
      this.flag = 'Edit';
    }
    this.adviceForm = this.fb.group({
      header: [this.dataForEdit ? this.dataForEdit.adviceId + '' : ''],
      headerEdit: [this.dataForEdit ? this.dataForEdit.adviceId + '' : '1'],
      rationale: [(this.dataForEdit ? this.dataForEdit.adviceDescription : '')],
      status: [(this.dataForEdit ? this.dataForEdit.adviceStatus : 'GIVEN'), [Validators.required]],
      givenOnDate: [this.dataForEdit ? new Date(this.dataForEdit.adviceGivenDate) : new Date(), [Validators.required]],
      implementDate: [this.dataForEdit ? new Date(this.dataForEdit.applicableDate) : null, [Validators.required]],
      // withdrawalAmt: [(this.dataForEdit ? this.dataForEdit.adviceAllotment : null)],
      consentOption: [this.dataForEdit ? (this.dataForEdit.consentOption ? this.dataForEdit.consentOption + '' : '1') : '1'],
    });
    // ==============owner-nominee Data ========================\\
    /***owner***/

  }
  editAdvice(){
    this.barButtonOptions.active = true;
    const stringObj = {
      adviceDescription: this.adviceForm.get('rationale').value,
      insuranceCategoryTypeId: this.adviceToCategoryId,
      suggestedFrom: 1,
      adviceToCategoryTypeMasterId:this.adviceToCategoryTypeMasterId,
      adviceToLifeInsurance: { "insuranceAdviceId": this.dataForEdit ? parseInt(this.adviceForm.get('headerEdit').value) : null },
      adviceToCategoryId: this.dataForEdit ? this.dataForEdit.adviceToCategoryId : null,
      adviceId: this.adviceForm.get('headerEdit').value,
      clientId: AuthService.getClientId(),
      advisorId: AuthService.getAdvisorId(),
      adviceGivenDate: this.datePipe.transform(this.adviceForm.get('givenOnDate').value, 'yyyy-MM-dd'),
      applicableDate: this.datePipe.transform(this.adviceForm.get('implementDate').value, 'yyyy-MM-dd')
    }
    this.activityService.editAdvice(stringObj).subscribe(
      data => this.getAdviceRes(data),
      err => this.event.openSnackBar(err, "Dismiss")
    );
  }
  dateChange(value) {
    let adviceHeaderDate = this.datePipe.transform(this.adviceForm.controls.givenOnDate.value, 'yyyy/MM/dd')
    console.log(adviceHeaderDate);
    let implementDate = this.datePipe.transform(this.adviceForm.controls.implementDate.value, 'yyyy/MM/dd')
    if (adviceHeaderDate && implementDate) {
      if (value == 'givenOnDate') {
        if (implementDate > adviceHeaderDate) {
          this.adviceForm.get('givenOnDate').setErrors(null);
        } else {
          this.adviceForm.get('givenOnDate').setErrors({ max: 'Date Issue' });
          this.adviceForm.get('givenOnDate').markAsTouched();
        }
      } else {
        if (implementDate > adviceHeaderDate) {
          this.adviceForm.get('implementDate').setErrors(null);
        } else {
          this.adviceForm.get('implementDate').setErrors({ max: 'Date of repayment' });
          this.adviceForm.get('implementDate').markAsTouched();
        }

      }
    }


  }
  getAdviceRes(data) {
    this.barButtonOptions.active = false;
    console.log(data)
    this.close(true)
    this.event.openSnackBar('Added successfully', "Ok")
  }
  close(flag) {
      this.subInjectService.changeNewRightSliderState({ state: 'close',refreshRequired: flag});
  }
}
