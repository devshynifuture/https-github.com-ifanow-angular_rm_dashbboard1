import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-po-saving',
  templateUrl: './add-po-saving.component.html',
  styleUrls: ['./add-po-saving.component.scss']
})
export class AddPoSavingComponent implements OnInit {
  isOptionalField: any;
  advisorId: any;
  inputData: any;
  ownerData: any;
  poSavingForm: any;

  constructor(private fb: FormBuilder) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.isOptionalField=true
    this.advisorId=AuthService.getAdvisorId();
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
   this.poSavingForm=this.fb.group({
     accBal:[,[Validators.required]],
     balAsOn:[,[Validators.required]],
     ownershipType:[,[Validators.required]]
   })
    this.ownerData = this.poSavingForm.controls;

  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
}
