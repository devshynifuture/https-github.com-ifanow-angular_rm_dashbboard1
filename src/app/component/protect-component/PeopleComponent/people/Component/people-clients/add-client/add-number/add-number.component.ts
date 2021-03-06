import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    topPadding: 'pt-0',
    label: 'col-md-4',
    code: 'col-md-3 pl-0 col-4 mob-pl-10',
    mobile: 'col-md-3 p-0 col-6',
    addRemove: 'col-md-1 col-2 mob-pr-10',
  };
  placeHolderObj = ['Enter primary number', 'Enter secondary number'];
  isdCodes: any;
  countryCode: any;
  lengthControl: number;

  /** control for the MatSelect filter keyword */
  filterCtrl: FormControl = new FormControl();
  filteredIsdCodes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  selectedISD: any;
  taxstatusId: any;

  ngOnInit() {
    // listen for search field value changes
    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCodes();
      });
  }

  constructor(private fb: FormBuilder, private utilService: UtilService,
    private peopleService: PeopleService, private enumService: EnumServiceService) {
  }

  // if this input not used anywhere then remove it
  @Input() set isResidential(taxStatusId) {
    if (taxStatusId == undefined) {
      return;
    }
    this.taxstatusId = taxStatusId;
    // let taxStatusObj = this.enumService.filterTaxStatusList(taxStatusId);
    this.getIsdCodesData(taxStatusId);
  }

  getIsdCodesData(taxStatusId) {
    let obj = {};
    this.peopleService.getIsdCode(obj).subscribe(
      data => {
        if (data) {
          console.log(data);
          this.isdCodes = data;
          if (taxStatusId == 1) {
            this.isdCodes = this.isdCodes.filter(element => element.code == '+91');
            // this.selectedISD = this.isdCodes[0].id
            this.getMobileNumList.controls.forEach(element => {
              element.get('code').setValue(73);
              element.get('number').setValidators([Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)])
              element.updateValueAndValidity();
            });
          } else {
            data.sort(function (a, b) {
              return a.countryCode.localeCompare(b.countryCode);
            });
            this.isdCodes = data;
          }
          this.filteredIsdCodes.next(this.isdCodes);
        }
      }
    );
  }

  selectedISDMethod(value, index) {
    if (value == 73) {
      this.getMobileNumList.controls[index].get('number').setValidators([Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)])
    } else {
      this.getMobileNumList.controls[index].get('number').setValidators([Validators.required])
    }
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
    if (this.taxstatusId == 1) {
      data.isdCodeId = 73;
    }
    if (this.getMobileNumList.length < 3) {
      if (this.compulsionCount < this.minimumCompulsary) {
        this.compulsionCount++;
        this.getMobileNumList.push(this.fb.group({
          code: [data.isdCodeId, [Validators.required]],
          number: [data.mobileNo != 0 ? data.mobileNo : '', [Validators.pattern(this.validatorType.TEN_DIGITS), Validators.required]],
          defaultFlag: [data.defaultFlag == undefined ? true : data.defaultFlag],
          id: [data.id],
          isUpdate: [data.isUpdate],
          userId: [data.userId],
          isActive: [data.isActive]
        }));
      } else {
        this.getMobileNumList.push(this.fb.group({
          code: [data.isdCodeId],
          number: [data.mobileNo != 0 ? data.mobileNo : '', Validators.pattern(this.validatorType.TEN_DIGITS)],
          defaultFlag: [data.defaultFlag == undefined ? true : data.defaultFlag],
          id: [data.id],
          isUpdate: [data.isUpdate],
          userId: [data.userId],
          isActive: [data.isActive],
        }));
      }

      if (data.isdCodeId && data.isdCodeId == 73) {
        this.getMobileNumList.controls[this.getMobileNumList.length - 1].get('number').setValidators([Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)])
      } else {
        this.getMobileNumList.controls[this.getMobileNumList.length - 1].get('number').setValidators([Validators.required])
      }
      this.numberArray.emit(this.getMobileNumList);
    }
  }

  checkUniqueNumber() {
    if (this.getMobileNumList.length == 2) {
      if (this.getMobileNumList.controls[0].value.number == this.getMobileNumList.controls[1].value.number) {
        this.getMobileNumList.controls[0].get('number').setErrors({ notUnique: true });
      } else {
        this.getMobileNumList.controls[0].get('number').setErrors(null);
      }
      ;
    }
  }

  protected filterCodes() {
    if (!this.isdCodes) {
      return;
    }
    // get the search keyword
    let search = this.filterCtrl.value;
    if (!search) {
      this.filteredIsdCodes.next(this.isdCodes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the codes
    this.filteredIsdCodes.next(this.isdCodes.filter(code => (code.code + code.countryCode).toLowerCase().indexOf(search) > -1));
  }
}
