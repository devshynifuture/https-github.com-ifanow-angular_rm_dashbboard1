import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {MAT_DATE_FORMATS} from '@angular/material';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';
import {UtilService} from 'src/app/services/util.service';

@Component({
  selector: 'app-add-scss',
  templateUrl: './add-scss.component.html',
  styleUrls: ['./add-scss.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ]
})
export class AddScssComponent implements OnInit {
  inputData: any;
  familyMemberId: any;
  ownerName: any;
  scssSchemeForm: any;
  scssOptionalSchemeForm: any;
  advisorId: any;
  clientId: number;
  ownerData: any;
  isOptionalField: any;
  editApi: any;

  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder,
              private cusService: CustomerService, private eventService: EventService,public utils: UtilService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

    this.isOptionalField = true;
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }

  getdataForm(data) {
    if (data == undefined) {
      data = {};
    } else {
      this.editApi = data;
    }
    this.scssSchemeForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      amtInvested: [data.amountInvested, [Validators.required, Validators.min(1500), Validators.max(1500000)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      ownershipType: [data.ownerTypeI ? String(data.ownerTypeId) : '1', [Validators.required]]
    });
    this.scssOptionalSchemeForm = this.fb.group({
      poBranch: [],
      nominee: [],
      bankAccNumber: [],
      description: [data.description]
    });
    this.ownerData = this.scssSchemeForm.controls;
  }

  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true;
  }

  addScss() {

    if (this.scssSchemeForm.get('amtInvested').invalid) {
      this.scssSchemeForm.get('amtInvested').markAsTouched();
      return;
    } else if (this.scssSchemeForm.get('commDate').invalid) {
      this.scssSchemeForm.get('commDate').markAsTouched();
      return;
    } else if (this.scssSchemeForm.get('ownershipType').invalid) {
      this.scssSchemeForm.get('ownershipType').markAsTouched();
      return;
    } else {
      const obj = {
        id: 0,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        advisorId: this.advisorId,
        ownerName: this.ownerName,
        amountInvested: this.scssSchemeForm.get('amtInvested').value,
        commencementDate: this.scssSchemeForm.get('commDate').value,
        postOfficeBranch: this.scssOptionalSchemeForm.get('poBranch').value,
        bankAccountNumber: this.scssOptionalSchemeForm.get('bankAccNumber').value,
        ownerTypeId: this.scssSchemeForm.get('ownershipType').value,
        nominee: this.scssOptionalSchemeForm.get('nominee').value,
        description: this.scssOptionalSchemeForm.get('description').value
      };
      if (this.editApi) {
        obj.id = this.editApi.id;
        this.cusService.editSCSSData(obj).subscribe(
          data => this.addScssResponse(data),
          error => this.eventService.showErrorMessage(error)
        );
      } else {
        this.cusService.addSCSSScheme(obj).subscribe(
          data => this.addScssResponse(data),
          error => this.eventService.showErrorMessage(error)
        );
      }
    }
  }

  addScssResponse(data) {
    console.log(data);
    this.close();
  }

  close() {
    this.isOptionalField = true;
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
