import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-owner-component',
  templateUrl: './owner-component.component.html',
  styleUrls: ['./owner-component.component.scss']
})
export class OwnerComponentComponent implements OnInit {

  isownerName = false;
  owner: any;
  s: string[] = ['Sneha', 'gayatri', 'Shivani'];
  family: string[];
  advisorId: any;
  ownerData: any;
  clientId: any;
  sendData: any;
  ownerName: any;
  familyMemberId: any;
  nomineesListFM: any;
  dataFM: any;
  familyList: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService) {
  }

  @Output() valueChange = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();

  @Input()
  set data(data) {
    this.ownerData = data;
    // this.getListFamilyMem(data);

  }

  get data() {
    return this.ownerData;
  }

  ngOnInit() {
    console.log('OwnerComponentComponent ngOnInit ownerData', this.ownerData)
    // this.advisorId = AuthService.getAdvisorId();
    // this.clientId = AuthService.getClientId();
    //this.getListFamilyMem(this.ownerData);
    //  this.getdataForm()
    this.family = this.s;
  }

  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
    this.valueChange.emit(value);
  }
  lisNominee(value) {
    console.log(value)
    this.valueChange1.emit(this.sendData);
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  nomineesList() {
    this.dataFM = this.nomineesListFM
    if (this.dataFM.length > 0) {
      let name = this.ownerName
      var evens = _.reject(this.dataFM, function (n) {
        return n.userName == name;
      });
      this.familyList = evens
    }

    console.log('familyList', this.familyList)
  }
  // getListFamilyMem(data) {
  //   let obj = {
  //     advisorId: this.advisorId,
  //     clientId: this.clientId,
  //   }
  //   this.custumService.getListOfFamilyByClient(obj).subscribe(
  //     data => this.getListOfFamilyByClientRes(data)
  //   );
  // }

  // getOwnerName(value) {
  //   console.log('selected', value)
  //   value.familyList = this.family
  //   this.valueChange.emit(value);
  // }

  // getListOfFamilyByClientRes(data) {
  //   console.log('family Memebers', data)
  //   this.sendData = data
  //   this.family = data.familyMembersList
  //   this.valueChange1.emit(this.sendData);
  // }

  // getdataForm() {
  //   this.owner = this.fb.group({
  //     ownerName: [(this.ownerData.ownerName.value == null) ? '' : this.ownerData.ownerName.value, [Validators.required]],
  //   });
  //   if (this.owner.controls.ownerName.value == '') {
  //     this.getFormControl().ownerName.setValue(this.ownerData.ownerName.value);
  //   }
  // }

  // getFormControl(): any {
  //   return (this.owner.controls);
  // }
}
