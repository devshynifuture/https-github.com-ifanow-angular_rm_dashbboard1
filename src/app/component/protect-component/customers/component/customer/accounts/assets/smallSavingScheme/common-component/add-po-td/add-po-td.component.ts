import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-po-td',
  templateUrl: './add-po-td.component.html',
  styleUrls: ['./add-po-td.component.scss']
})
export class AddPoTdComponent implements OnInit {
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  ownerData: any;
  POTDForm: any;
  POTDOptionalForm: any;
  advisorId: any;
  isOptionalField: any;

  constructor(private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService) { }
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
    this.POTDForm=this.fb.group({
      ownerName: [, [Validators.required]],
      amtInvested:[,[Validators.required]],
      commDate:[,[Validators.required]],
      tenure:[,[Validators.required]],
      ownershipType:[,[Validators.required]]
    })
    this.POTDOptionalForm=this.fb.group({
      poBranch: [],
      nominee: [],
      tdNum: [],
      bankAccNum:[],
      description:[]
    })
    this.ownerData = this.POTDForm.controls;

  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  ngOnInit() {
    this.advisorId=AuthService.getAdvisorId();
    this.isOptionalField=true
  }

}
