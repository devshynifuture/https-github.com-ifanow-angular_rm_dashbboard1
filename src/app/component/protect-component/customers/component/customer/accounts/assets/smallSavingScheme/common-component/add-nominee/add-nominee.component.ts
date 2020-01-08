import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../../customer.service';

@Component({
  selector: 'app-add-nominee',
  templateUrl: './add-nominee.component.html',
  styleUrls: ['./add-nominee.component.scss']
})
export class AddNomineeComponent implements OnInit {
  nomineeForm: any;
  advisorId: any;
  clientId: any;
  familyList: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService) { }

  ngOnInit() {
    console.log("add nominee component")
    this.nomineeForm = this.fb.group({
      nomineeList: new FormArray([])
    })
    this.getListFamilyMem();
    this.addNominee();
  }
  get getNomineeForm() { return this.nomineeForm.controls; }
  get getNomineeList() { return this.getNomineeForm.nomineeList as FormArray; }

  addNominee() {

    this.getNomineeList.push(this.fb.group({
      name: [, [Validators.required]],
      share: [, [Validators.required]],
    }))
  }
  removeNominee(index) {
    if (this.getNomineeList.length == 1) {
      return;
    }
    this.nomineeForm.controls.nomineeList.removeAt(index);
  }
  getListFamilyMem() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.custumService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }
  getListOfFamilyByClientRes(data) {
    console.log(data)
    this.familyList = data.familyMembersList;
  }
  deleteFamilyMember(data) {

  }
}
