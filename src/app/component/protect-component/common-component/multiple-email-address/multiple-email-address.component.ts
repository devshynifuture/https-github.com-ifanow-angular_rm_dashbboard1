import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { PeopleService } from '../../PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { element } from 'protractor';

@Component({
  selector: 'app-multiple-email-address',
  templateUrl: './multiple-email-address.component.html',
  styleUrls: ['./multiple-email-address.component.scss']
})
export class MultipleEmailAddressComponent implements OnInit {
  emailFormGroup;
  emailAddressResponse: any;
  validatorType: any;
  isLoader: boolean;

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private eventService: EventService
  ) { }

  ngOnInit() {
  }
  @Input() fieldFlag;

  @Output() emailFireEvent = new EventEmitter();

  @Input() set emailList(data) {
    this.validatorType = ValidatorType
    this.emailFormGroup = this.fb.group({
      emailList: new FormArray([])
    });

    if (data == undefined || data.length == 0) {
      data = {};
      this.addEmail(data);
      this.emailAddressResponse = data;
      return;
    } else {
      this.emailAddressResponse = data;
      data.forEach(element => {
        this.addEmail(element);
      });
    }
  }


  get getEmailAddressForm() {
    return this.emailFormGroup.controls;
  }

  get getEmailAddressFormList() {
    return this.getEmailAddressForm.emailList as FormArray;
  }

  addEmail(data) {
    (!data) ? data = {} : ''
    this.getEmailAddressFormList.push(this.fb.group({
      id: [data.id],
      userId: [data.userId],
      userType: [data.userType],
      markAsPrimary: [data.defaultFlag ? data.defaultFlag : false],
      emailAddress: [data.email],
      isLoading: [false]
    }));
    this.getEmailAddressFormList.controls.forEach(element => {
      element.get('emailAddress').setValidators(this.fieldFlag != 'familyMember' ? [Validators.pattern(this.validatorType.EMAIL), Validators.required] : [Validators.pattern(this.validatorType.EMAIL)]);
    });
    this.emailFireEvent.emit(this.getEmailAddressFormList)
  }

  removeEmail(index) {
    (this.emailFormGroup.controls.emailList.length == 1) ? '' : this.emailFormGroup.controls.emailList.removeAt(index);
  }

  checkUniqueEmail(formControl) {
    let emailArray = []
    if (this.getEmailAddressFormList.length > 1) {
      emailArray = this.getEmailAddressFormList.value.filter(element => element.emailAddress === formControl.value);
      if (emailArray.length > 1) {
        formControl.setErrors({ notUnique: true });
      }
    }
  }
  changePrimaryEmail(i) {
    this.getEmailAddressFormList.controls.forEach((element, index) => {
      (index == i) ? element.get('markAsPrimary').setValue(true) : element.get('markAsPrimary').setValue(false);
    });
  }


  deleteEmail(index, data) {
    data.get('isLoading').setValue(true)
    const obj = {
      "userId": data.get('userId').value,
      "userType": data.get('userType').value,
      "id": data.get('id').value,
      "clientOrFamilyMember": (this.fieldFlag != 'familyMember') ? 2 : 3
    }
    this.peopleService.deleteEmail(obj).subscribe(
      res => {
        data.get('isLoading').setValue(false)
          (this.emailFormGroup.controls.emailList.length == 1) ? '' : this.emailFormGroup.controls.emailList.removeAt(index);
        this.eventService.openSnackBar("Email deleted sucessfully!", "Dismiss")
      }, err => {
        data.get('isLoading').setValue(false)
        this.eventService.openSnackBar(err, "Dismiss")
      }
    )
  }
}

