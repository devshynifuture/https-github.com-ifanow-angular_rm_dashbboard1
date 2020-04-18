import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {ValidatorType} from 'src/app/services/util.service';

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

  @Input() flag;
  @Output() numberArray = new EventEmitter();

  ngOnInit() {

  }

  constructor(private fb: FormBuilder) {
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
    (this.numberFormGroup.controls.mobileNo.length == 1) ? '' : this.numberFormGroup.controls.mobileNo.removeAt(index);
  }

  addNumber(data) {
    if (!data) {
      data = {};
    }
    this.getMobileNumList.push(this.fb.group({
      code: ['+91'],
      number: [data.mobileNo, Validators.pattern(this.validatorType.TEN_DIGITS)]
    }));
    this.numberArray.emit(this.getMobileNumList);
  }
}
