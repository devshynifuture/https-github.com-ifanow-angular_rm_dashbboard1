import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../../customer.service';

import { from } from 'rxjs';
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
  @Input() ownerName;
  @Input() data;
  @Output() outputEvent = new EventEmitter();
  dataFM = [];
  nexNomineePer: number;
  showError = false;

  constructor(private fb: FormBuilder, private custumService: CustomerService) { }

  ngOnInit() {
    console.log("add nominee component")
    this.nomineeForm = this.fb.group({
      nomineeList: new FormArray([])
    })
    console.log(this.data);
    console.log(this.ownerName);
    this.getListFamilyMem();
    this.getNominee(this.data);
    // this.addNominee();
  }
  get getNomineeForm() { return this.nomineeForm.controls; }
  get getNomineeList() { return this.getNomineeForm.nomineeList as FormArray; }

  addNominee() {
    if (this.getNomineeList) {
      this.getNomineeList.push(this.fb.group({
        name: [, [Validators.required]],
        sharePercentage: [, [Validators.required]],
        id: 0,
        familyMemberId: 0
      }))
    }
    this.outputEvent.emit(this.getNomineeList)

  }
  onChange() {
    this.nexNomineePer = 0;

    this.getNomineeList.value.forEach(element => {
      this.nexNomineePer += (element.sharePercentage) ? parseInt(element.sharePercentage) : null;
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')

    } else {
      this.showError = false
      this.outputEvent.emit(this.getNomineeList)

    }

  }
  getNominee(data) {
    // if(this.getNomineeList){
    //   this.getNomineeList.push(this.fb.group({
    //     name: [, [Validators.required]],
    //     share: [, [Validators.required]],
    //   }))
    // }


    if (data) {
      if (data.nominees != undefined) {
        if (data.nominees.length != 0) {
          data.nominees.forEach(element => {
            this.getNomineeList.push(this.fb.group({
              id: element.id,
              name: [(element.name) ? (element.name) + "" : '', [Validators.required]],
              sharePercentage: [(element.sharePercentage + ""), Validators.required],
              familyMemberId: [(element.familyMemberId)]

            }))
          })
        } else {
          this.getNomineeList.push(this.fb.group({
            name: [, [Validators.required]],
            sharePercentage: [, [Validators.required]],
            id: 0,
            familyMemberId: 0
          }))
        }
      } else {
        this.getNomineeList.push(this.fb.group({
          name: [, [Validators.required]],
          sharePercentage: [, [Validators.required]],
          id: 0,
          familyMemberId: 0
        }))
      }

      // this.getNomineeList.removeAt(0);
      // console.log(this.addrealEstateForm.controls.getNomineeName.value)
    }
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
  nomineesList() {
    this.dataFM = this.familyList
    if (this.dataFM.length > 0) {
      let name = this.ownerName
      // var evens = _.reject(this.dataFM, function (n) {
      //   return n.userName == name;
      // });
      let evens = this.dataFM.filter(delData => delData.userName != name)
      this.familyList = evens
    }

    console.log('familyList', this.familyList)
  }
  getListOfFamilyByClientRes(data) {
    console.log(data)
    this.familyList = data.familyMembersList;
    const singleFamilyMember = this.ownerName
    remove(this.familyList, function (n) {
      return n.userName == singleFamilyMember;
    });
    console.log(this.familyList)
  }

}
