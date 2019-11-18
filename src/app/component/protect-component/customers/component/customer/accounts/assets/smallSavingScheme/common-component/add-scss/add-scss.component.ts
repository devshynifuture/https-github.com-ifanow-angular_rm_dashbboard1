import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-scss',
  templateUrl: './add-scss.component.html',
  styleUrls: ['./add-scss.component.scss']
})
export class AddScssComponent implements OnInit {
  inputData: any;
  familyMemberId: any;
  ownerName: any;
  scssSchemeForm: any;
  scssOptionalSchemeForm: any;
  advisorId: any;
  ownerData: any;
  isOptionalField: any;

  constructor( private subInjectService: SubscriptionInject,private fb: FormBuilder,private cusService: CustomerService,private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
    this.isOptionalField=true
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
    this.scssSchemeForm = this.fb.group({
      ownerName: [, [Validators.required]],
      amtInvested: [, [Validators.required]],
      commDate: [, [Validators.required]],
      ownershipType: [, [Validators.required]]
    })
    this.scssOptionalSchemeForm = this.fb.group({
      poBranch: [],
      nominee: [],
      bankAccNumber: [],
      description: []
    })
    this.ownerData = this.scssSchemeForm.controls;
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  addScss() {
    if (this.ownerName == undefined) {
      return
    }
    else if (this.scssSchemeForm.get('amtInvested').invalid) {
      return
    }
    else if (this.scssSchemeForm.get('commDate').invalid) {
      return
    }
    else if (this.scssSchemeForm.get('ownershipType').invalid) {
      return
    }
    else {
      let obj =
      {
        "clientId": 2978,
        "familyMemberId": this.familyMemberId,
        "advisorId": this.advisorId,
        "ownerName": this.ownerName,
        "amountInvested": this.scssSchemeForm.get('amtInvested').value,
        "commencementDate": this.scssSchemeForm.get('commDate').value,
        "postOfficeBranch": this.scssOptionalSchemeForm.get('poBranch').value,
        "bankAccountNumber": this.scssOptionalSchemeForm.get('bankAccNumber').value,
        "ownerTypeId": this.scssSchemeForm.get('ownershipType').value,
        "nominee": this.scssOptionalSchemeForm.get('nominee').value,
        "description": this.scssOptionalSchemeForm.get('description').value
      }
      this.cusService.addSCSSScheme(obj).subscribe(
        data=>this.addScssResponse(data),
        err=>this.eventService.openSnackBar(err)
      )
    }
  }
  addScssResponse(data)
  {
   console.log(data)
  }

  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
