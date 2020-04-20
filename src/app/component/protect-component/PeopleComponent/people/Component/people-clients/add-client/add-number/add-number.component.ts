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
  @Input() isResidential = false;
  @Output() numberArray = new EventEmitter();
  @Input() classObj = {
    topPadding: 'pt-60',
    label: 'col-md-4',
    code: 'col-md-3',
    mobile: 'col-md-3',
    addRemove: 'col-md-1',
  }
  placeHolderObj = ['Enter Primary Number', 'Enter Secondary Number']
  countryCodes: Array<string> = ['+91', '+92', "+93"];
  isdCodes: any;
  countryCode: any;
  lengthControl: number;

  ngOnInit() {
    if (this.isResidential) {
      this.countryCodes = ['+1'];
    }
  }

  constructor(private fb: FormBuilder, private utilService: UtilService, private peopleService: PeopleService) {
  }
  @Input() set userData(userdetailData) {
    if (userdetailData == undefined) {
      return;
    }
    else {
      if (userdetailData.taxStatusId == 1) {
        this.isdCodes = { code: '+91' }
      }
      else {
        this.getIsdCodesData();
      }
    }
  };
  getIsdCodesData() {
    let obj = {};
    this.peopleService.getIsdCode(obj).subscribe(
      data => {
        if (data) {
          console.log(data);
          this.isdCodes = data;
          this.isdCodes.filter(element => element.code != '+91');
          this.countryCode = data[0]
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
          code: [''],
          number: [data.mobileNo, [Validators.pattern(this.validatorType.TEN_DIGITS), Validators.required]]
        }));
      } else {
        this.getMobileNumList.push(this.fb.group({
          code: [''],
          number: [data.mobileNo, Validators.pattern(this.validatorType.TEN_DIGITS)]
        }));
      }
      this.numberArray.emit(this.getMobileNumList);
    }
    // this.lengthControl = this.getMobileNumList.length
  }
}
