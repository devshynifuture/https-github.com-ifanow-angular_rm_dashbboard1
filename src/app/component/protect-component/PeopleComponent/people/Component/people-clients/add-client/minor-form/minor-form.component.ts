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
  close(value) {
    console.log(value);
  }
  //
  @Output() clientData = new EventEmitter();
  @Output() tabChange = new EventEmitter();

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
  constructor(private fb: FormBuilder) {}
  ngOnInit() {}

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

  get getCoOwner() {
    return this.minorForm.get("getCoOwnerName") as FormArray;
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

  addNewCoOwner(data) {
    this.getCoOwner.push(
      this.fb.group({
        name: [data ? data.name : "", [Validators.required]],
        sharePercentage: [0],
        familyMemberId: [data ? data.familyMemberId : 0],
        id: [data ? data.id : 0],
        isClient: [data ? data.isClient : 0],
      })
    );
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }
  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    this.disabledMember(null, null);
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
}
