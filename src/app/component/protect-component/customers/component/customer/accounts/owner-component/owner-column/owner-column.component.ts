import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-owner-column',
  templateUrl: './owner-column.component.html',
  styleUrls: ['./owner-column.component.scss']
})
export class OwnerColumnComponent implements OnInit {

  isownerName = false;
  owner: any;
  s: string[] = ['Sneha', 'gayatri', 'Shivani'];
  family: string[];
  advisorId: any;
  ownerData: any;
  clientId: any;
  sendData: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService) { }
  @Output() valueChange = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();
  @Input()
  set data(data) {
    this.ownerData = data;
    this.getListFamilyMem(data);
  }

  get data() {
    return this.ownerData;
  }
  ngOnInit() {
    console.log('ownerData', this.ownerData)
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getListFamilyMem('');
    this.getdataForm()
    this.family = this.s;
  }
  getListFamilyMem(data) {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.custumService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }
  getOwnerName(value) {
    console.log('selected', value)
    value.familyList = this.family
    this.valueChange.emit(value);
  }
  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data)
    this.sendData = data
    this.family = data.familyMembersList
    this.valueChange1.emit(this.sendData);
  }
  getdataForm() {
    this.owner = this.fb.group({
      ownerName: [(this.ownerData.ownerName.value == null) ? '' : this.ownerData.ownerName.value, [Validators.required]],
    });
    if (this.owner.controls.ownerName.value == '') {
      this.getFormControl().ownerName.setValue(this.ownerData.ownerName.value);
    }
  }
  getFormControl(): any {
    return (this.owner.controls);
  }
}
