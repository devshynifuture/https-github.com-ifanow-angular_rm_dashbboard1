import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
} from "@angular/forms";
import { ValidatorType } from "src/app/services/util.service";
import { MatProgressButtonOptions } from "src/app/common/progress-button/progress-button.component";
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { EventService } from 'src/app/Data-service/event.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: "app-minor-form",
  templateUrl: "./minor-form.component.html",
  styleUrls: ["./minor-form.component.scss"],
})
export class MinorFormComponent implements OnInit {
  minorForm: FormGroup;
  validatorType = ValidatorType;
  minorData: any;
  invCategory = new FormControl();
  taxStatus = new FormControl();
  callMethod: { methodName: string; ParamValue: any; disControl: any };
  ownerName: any;
  // maxDateForAdultDob:any;
  familyMemberId: any;
  // maxDate:any;
  name: any;
  // capitalise:any;
  // close:any;
  ownerData: any;
  nomineesListFM: any = [];
  idData: any;
  fieldFlag: string = "familyMember";
  // prod issues
  maxDateForAdultDob = new Date();
  maxDate = new Date();
  capitalise(event) {
    console.log(event);
  }

  @Output() tabChange = new EventEmitter();
  @Output() cancelTab = new EventEmitter();
  @Output() saveNextData = new EventEmitter();

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: "SAVE & CLOSE",
    buttonColor: "accent",
    barColor: "accent",
    raised: true,
    stroked: false,
    mode: "determinate",
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  constructor(private fb: FormBuilder,
    private subInjectService: SubscriptionInject,
    private datePipe: DatePipe,
    private eventService: EventService,
    private peopleService: PeopleService) { }
  ngOnInit() { }

  @Input() set data(data) {
    this.minorData = data;
    this.createMinorForm(data);
  }

  createMinorForm(data) {
    this.idData = this.minorData.familyMemberId;
    data == undefined ? (data = {}) : "";
    this.invCategory.setValue(data.familyMemberType);
    this.taxStatus.setValue(data.residentFlag);
    this.minorForm = this.fb.group({
      minorFullName: [data.name, [Validators.required]],
      dobAsPerRecord: [
        data.dateOfBirth == null ? "" : new Date(data.dateOfBirth),
      ],
      gender: [data.genderId ? String(data.genderId) : "1"],
      getNomineeName: new FormArray([]),
    });
    this.addNewNominee({});
    this.ownerData = {
      Fmember: this.nomineesListFM,
      controleData: this.minorForm,
    };
  }

  get getNominee() {
    return this.minorForm.get("getNomineeName") as FormArray;
  }



  display(value) {
    console.log("value selected", value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
  }

  disabledMember(value, type) {
    this.callMethod = {
      methodName: "disabledMember",
      ParamValue: value,
      disControl: type,
    };
  }

  displayControler(con) {
    console.log("value selected", con);
    if (con.owner != null && con.owner) {
      this.minorForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.minorForm.controls.getNomineeName = con.nominee;
    }
  }



  /***owner***/

  /***nominee***/

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
  }

  addNewNominee(data) {
    this.getNominee.push(
      this.fb.group({
        name: [data ? data.name : ""],
        sharePercentage: [0],
        familyMemberId: [data ? data.familyMemberId : 0],
        id: [data ? data.id : 0],
        isClient: [data ? data.isClient : 0],
      })
    );
  }


  editFamilyMember(flag) {
    const obj = {
      adminAdvisorId: AuthService.getAdminId(),
      advisorId: AuthService.getClientData().advisorId,
      familyMemberId: this.minorData.familyMemberId,
      clientId: this.minorData.clientId,
      name: this.minorForm.value.minorFullName,
      displayName: null,
      dateOfBirth: this.datePipe.transform(this.minorForm.value.dobAsPerRecord, 'dd/MM/yyyy'),
      martialStatusId: null,
      genderId: this.minorForm.value.gender,
      occupationId: 1,
      pan: this.minorForm.value.pan,
      residentFlag: parseInt(this.taxStatus.value),
      // taxStatusId: taxStatusId,
      relationshipId: this.minorData.relationshipId,
      familyMemberType: parseInt(this.invCategory.value),
      isKycCompliant: 1,
      aadhaarNumber: null,
      bio: null,
      remarks: null,
      emailList: [
        {
          email: null,
          verificationStatus: 0
        }
      ],
      guardianClientFamilyMappingModelList: [],
      invTypeCategory: 0,
      categoryTypeflag: null,
      anniversaryDate: null,
    };
    obj.bio = this.minorData.bio;
    obj.remarks = this.minorData.remarks;
    obj.aadhaarNumber = this.minorData.aadhaarNumber;
    obj.martialStatusId = this.minorData.martialStatusId;
    obj.occupationId = this.minorData.occupationId;
    obj.displayName = this.minorData.displayName;
    obj.anniversaryDate = this.datePipe.transform(this.minorData.anniversaryDate, 'dd/MM/yyyy');
    this.peopleService.editFamilyMemberDetails(obj).subscribe(
      data => {
        data.invTypeCategory = this.invCategory.value;
        data.categoryTypeflag = 'familyMinor';
        if (flag == 'Next') {
          this.tabChange.emit(1);
          this.saveNextData.emit(true);
        }
        else {
          this.close(data);
        }
      },
      err => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }


  close(data) {
    (data == 'close') ? this.cancelTab.emit('close') : this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
  }

}
