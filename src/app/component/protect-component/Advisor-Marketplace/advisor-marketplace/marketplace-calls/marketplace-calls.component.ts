import { Component, OnInit } from '@angular/core';
import { AdvisorMarketplaceService } from '../../advisor-marketplace.service';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-marketplace-calls',
  templateUrl: './marketplace-calls.component.html',
  styleUrls: ['./marketplace-calls.component.scss']
})
export class MarketplaceCallsComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
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
  minStart = new Date();
  validatorType = ValidatorType;
  // "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30",
  timeArr = [ "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:20", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "24:00"]
  advisorId: any;
  callDetails;
  callSetting: any;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'mail', 'deatils', 'menus'];
  dataSource = ELEMENT_DATA;
  constructor(private advisorMarketplaceService: AdvisorMarketplaceService, private datePipe: DatePipe, public utils: UtilService, private fb: FormBuilder, private eventService: EventService) { }

  ngOnInit() {
    this.callDetails = this.fb.group({
      callDate: this.fb.array([this.fb.group({
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        callSettingsId: 0,
        id: 0,
        isDeleted: 0
      })]),
      callDurationId: ["", [Validators.required]],
      rollingDays: ["", [Validators.required]],
      startTime: ["", [Validators.required]],
      endTime: ["", [Validators.required]],
      description: ["", [Validators.required]],
      id: [""],
    })
    this.advisorId = AuthService.getAdvisorId();
    this.getCallDetails();
  }
  callNonWorkingDays: any = [];
  getCallDetails() {
    const obj = {
      advisorId: this.advisorId,
    }
    this.advisorMarketplaceService.getCallDetails(obj).subscribe((data) => {
      if (data) {
        this.callSetting = data;
        console.log(this.callDetails.value, data, "callDetails");
        this.callDetails.get("callDurationId").setValue(data.callDurationId);
        this.callDetails.get("rollingDays").setValue(data.rollingDays);
        this.callDetails.get("startTime").setValue(data.startTimeString);
        this.callDetails.get("endTime").setValue(data.endTimeString);
        this.callDetails.get("description").setValue(data.description);

        if (data.callNonWorkingDays.length > 0) {
          this.getAvailability.removeAt(0);
          data.callNonWorkingDays.forEach((d, i) => {
            this.addCallDates(d, i);
          });
        }
        this.callNonWorkingDays = data.callNonWorkingDays;
      }
    });
    console.log(this.callDetails.value, "callDetails");
  }

  dateChange(mode, obj, i){
    // let availCon = this.callDetails.controls['callDate'].controls[i];
    // if(mode == 'start'){
    //   availCon.controls['startDate'].setValue(new Date(obj.value.startDate._d).getTime());
    // }else{
    //   availCon.controls['endDate'].setValue(new Date(obj.value.endDate._d).getTime());
    // }

    // console.log( this.callDetails.value.callDate);
    
  }

  addCallSetting() {
    if (this.callDetails.invalid) {
      this.callDetails.markAllAsTouched();
    }
    else {
      this.barButtonOptions.active = true;
      const obj = {
        "id": !this.callSetting ? null : this.callSetting.id,
        "advisorId": this.advisorId,
        "callDurationId": this.callDetails.get("callDurationId").value,
        "rollingDays": this.callDetails.get("rollingDays").value,
        "startTimeString": this.callDetails.get("startTime").value,
        "endTimeString": this.callDetails.get("endTime").value,
        "description": this.callDetails.get("description").value
      }
      this.advisorMarketplaceService.addCallDetails(obj).subscribe((data) => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBarNoDuration('Call setting done successfully', "DISMISS");
      },
        err => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBarNoDuration('Something went worng', "DISMISS");
        }
      );

      // =======================availability add call

      const obj2 = this.callDetails.value.callDate;
     
      if (this.deletedCallDates.length > 0) {
        this.deletedCallDates.forEach(deleted => {
          obj2.push(deleted)
        });
      }
      obj2.forEach(d => {
          d.startDate = this.datePipe.transform(d.startDate, 'yyyy-MM-dd');
          d.endDate = this.datePipe.transform(d.endDate, 'yyyy-MM-dd');
      });
      this.advisorMarketplaceService.addCallAvailable(obj2).subscribe((data) => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBarNoDuration('Availability setting done successfully', "DISMISS");
      },
        err => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBarNoDuration('Something went worng', "DISMISS");
        }
      );
    }
  }

  get getAvailability() {
    return this.callDetails.get('callDate') as FormArray;
  }

  addCallDates(data, i) {
    this.getAvailability.push(
      this.fb.group({
        startDate: [data ? new Date(data.startDate) : '', [Validators.required]],
        endDate: [data ? new Date(data.endDate) : '', [Validators.required]],
        callSettingsId: [this.callSetting ? this.callSetting.callNonWorkingDays[i].callSettingsId : null],
        id: [data ? this.callSetting.callNonWorkingDays[i].id : null],
        isDeleted: 0
      })
    )
  }

  deletedCallDates: any = [];
  removeCoOwner(item, deteleObj) {
    if (deteleObj.value.callSettingsId) {
      deteleObj.value.isDeleted = 1;
      this.deletedCallDates.push(deteleObj.value);
    }
    this.getAvailability.removeAt(item);
  }


}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  mail: string;
  deatils: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: '01/02/2020', name: '11.00 AM - 11.30 AM (30 mins)', weight: 'Rahul Jain', symbol: '9874539874', mail: 'Rahuljain@mail.com', deatils: 'Views' },

];