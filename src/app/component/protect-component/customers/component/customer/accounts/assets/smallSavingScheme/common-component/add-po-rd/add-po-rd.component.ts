import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-po-rd',
  templateUrl: './add-po-rd.component.html',
  styleUrls: ['./add-po-rd.component.scss']
})
export class AddPoRdComponent implements OnInit {
  isOptionalField: any;
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  advisorId: typeof AuthService;
  ownerData: any;
  PORDForm: any;
  PORDFormoptionalForm: any;

  constructor(private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.isOptionalField = true
    this.advisorId = AuthService.getAdvisorId();
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
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
    this.PORDForm = this.fb.group({
      ownerName: [, [Validators.required]],
      monthlyContribution: [, [Validators.required]],
      commDate: [, [Validators.required]],
      ownership: [, [Validators.required]]
    })
    this.PORDFormoptionalForm = this.fb.group({
      rdNum: [],
      poBranch: [],
      nominee: [],
      linkedBankAcc: [],
      description: []
    })
    this.ownerData = this.PORDForm.controls;

  }
  addPORD() {
    let obj = {
      "clientId": 2978,
      "advisorId": this.advisorId,
      "familyMemberId": this.familyMemberId,
      "ownerName": this.ownerName,
      "monthlyContribution": this.PORDForm.get('monthlyContribution').value,
      "commencementDate": this.PORDForm.get('commDate').value,
      "rdNumber": this.PORDFormoptionalForm.get('rdNum').value,
      "postOfficeBranch": this.PORDFormoptionalForm.get('poBranch').value,
      "ownerTypeId": this.PORDForm.get('ownership').value,
      "nominee": this.PORDFormoptionalForm.get('nominee').value,
      "description": this.PORDFormoptionalForm.get('description').value

    }
    this.cusService.addPORDScheme(obj).subscribe(
      data=>this.addPORDResponse(data),
      err=>this.eventService.openSnackBar(err)
    )
  }
  addPORDResponse(data)
  {
   console.log(data)
  }
}
