import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth-service/authService';

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

  constructor(private fb: FormBuilder, private custumService: CustomerService) { }
  @Output() valueChange = new EventEmitter();
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
    this.getListFamilyMem('');
    this.getdataForm()
    this.family = this.s;
  }
  getListFamilyMem(data) {
    let obj = {
      advisorId: this.advisorId,
      clientId: 2978
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
    this.family = data.familyMembersList
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
