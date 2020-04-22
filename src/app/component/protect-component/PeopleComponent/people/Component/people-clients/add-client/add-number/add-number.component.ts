import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ValidatorType, UtilService } from 'src/app/services/util.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-add-number',
  templateUrl: './add-number.component.html',
  styleUrls: ['./add-number.component.scss']
})
export class AddNumberComponent implements OnInit {
  numberFormGroup;
  validatorType = ValidatorType;
  mobileListResponse: any;

  create;
  compulsionCount = 0;

  @Input() flag;
  @Input() minimumCompulsary = 0;
  // @Input() isResidential = false;
  @Output() numberArray = new EventEmitter();
  @Input() classObj = {
    topPadding: 'pt-44',
    label: 'col-md-4',
    code: 'col-md-3 pl-0',
    mobile: 'col-md-3 p-0',
    addRemove: 'col-md-1',
  }
  placeHolderObj = ['Enter Primary Number', 'Enter Secondary Number']
  isdCodes: any;
  countryCode: any;
  lengthControl: number;

  ngOnInit() {
  }

  constructor(private fb: FormBuilder, private utilService: UtilService, private peopleService: PeopleService) {
  }

  // if this input not used anywhere then remove it
  @Input() set isResidential(userdetailData) {
    if (userdetailData == undefined) {
      return;
    }
    this.getIsdCodesData(userdetailData);
  }

  getIsdCodesData(invTypeData) {
    let obj = {};
    this.peopleService.getIsdCode(obj).subscribe(
      data => {
        if (data) {
          console.log(data);
          this.isdCodes = data;
          if (invTypeData == 0) {
            this.isdCodes = this.isdCodes.filter(element => element.code == '+91');
          } else {
            this.isdCodes = this.isdCodes.filter(element => element.code != '+91');
          }
        }
      }
    )
  }

  @Input() set numberList(data) {
    this.numberFormGroup = this.fb.group({
      mobileNo: new FormArray([])
    });
    if (data == undefined || data.length == 0) {
      data = {};
      this.addNumber(data);
      this.mobileListResponse = data;
      return;
    } else {
      this.mobileListResponse = data;
      data.forEach(element => {
        this.addNumber(element);
      });
    }
  }

  get getBasicDetails() {
    return this.numberFormGroup.controls;
  }

  get getMobileNumList() {
    return this.getBasicDetails.mobileNo as FormArray;
  }

  removeNumber(index) {
    this.compulsionCount--;
    (this.numberFormGroup.controls.mobileNo.length == 1) ? '' : this.numberFormGroup.controls.mobileNo.removeAt(index);
    // this.lengthControl = this.getMobileNumList.length;
  }

  addNumber(data) {
    if (!data) {
      data = {};
    }
    if (this.getMobileNumList, length < 3) {
      if (this.compulsionCount < this.minimumCompulsary) {
        this.compulsionCount++;
        this.getMobileNumList.push(this.fb.group({
          code: [data.isdCodeId],
          number: [data.mobileNo, [Validators.pattern(this.validatorType.TEN_DIGITS), Validators.required]]
        }));
      } else {
        this.getMobileNumList.push(this.fb.group({
          code: [data.isdCodeId],
          number: [data.mobileNo, Validators.pattern(this.validatorType.TEN_DIGITS)]
        }));
      }
      this.numberArray.emit(this.getMobileNumList);
    }
  }
  checkUniqueNumber() {
    if (this.getMobileNumList.length == 2) {
      (this.getMobileNumList.controls[0].value.number === this.getMobileNumList.controls[0].value.number) ? this.getMobileNumList.controls[0].get('number').setErrors({ notUnique: true }) : '';
    }
  }
}
