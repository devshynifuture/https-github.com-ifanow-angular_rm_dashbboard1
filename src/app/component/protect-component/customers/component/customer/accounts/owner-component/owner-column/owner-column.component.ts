import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {CustomerService} from '../../../customer.service';
import {AuthService} from 'src/app/auth-service/authService';

@Component({
  selector: 'app-owner-column',
  templateUrl: './owner-column.component.html',
  styleUrls: ['./owner-column.component.scss'],

})
export class OwnerColumnComponent implements OnInit {

  isownerName = false;
  owner;
  family = [];
  advisorId: any;
  ownerData: any;
  clientId: any;
  sendData: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService/*, private ref: ChangeDetectorRef*/) {
  }

  @Output() valueChange = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();

  @Input() set checkValid(checkValid){
    this.checkFrom(checkValid)
  }

  @Input()
  set data(data) {
    this.ownerData = !data?'':data;
    console.log('1111121212121212121212 OwnerColumnComponent data : ', data);
    if (data) {
    }
  }

  get data() {
    return this.ownerData;
  }

  ngOnInit() {
    console.log('ownerData', this.ownerData);
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getdataForm();
    this.getListFamilyMem();
    if(this.ownerData != undefined){
      this.owner.get('ownerName').setValue(this.ownerData)
    }

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

  getOwnerName() {
    // console.log('selected', value);
    // value.familyList = this.family;
    // this.valueChange.emit(value);
    let owerJson = this.family.filter(f => f.userName == this.owner.get('ownerName').value);
    this.valueChange.emit(owerJson[0]);

  }

  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data);
    this.family = data.familyMembersList;
    // this.sendData = data;
    // if (data.familyMembersList && data.familyMembersList.length > 0) {
    //   data.familyMembersList.forEach((singleData) => {
    //     if (this.ownerData.ownerName.value && this.ownerData.ownerName.value.length > 0) {
    //       if (singleData.userName == this.ownerData.ownerName.value) {
    //         console.log('family Member matched Value singleData : ', singleData);
    //         this.getFormControl().ownerName.setValue(singleData.userName);
    //       }
    //     }
    //     this.family.push(singleData);
    //   });
    // }
    // this.valueChange1.emit(this.owner.get('ownerName').value);
  }

  getdataForm() {
    if (this.owner) {
      // this.owner = this.fb.group({
      //   ownerName: [(this.ownerData.ownerName.value == null) ? '' : this.ownerData.ownerName.value, [Validators.required]],
      // });
      // console.log('OwnerColumn impossible getdataForm this.ownerData.ownerName.value : ', this.ownerData.ownerName.value);
      // this.getFormControl().ownerName.setValue(this.ownerData.ownerName.value);
    } else {
      this.owner = this.fb.group({
        ownerName: [this.ownerData, [Validators.required]],
      });
    }
  }

  getFormControl(): any {
    return (this.owner.controls);
  }

  checkFrom(checkValid){
    if(checkValid){
      if(this.owner.invalid){
        this.owner.get('ownerName').markAsTouched()
      }
    }
  }
}
