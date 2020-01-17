import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { Validators, FormBuilder } from '@angular/forms';

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
  dataFM = [];
  familyList: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService) {
  }

  @Output() valueChange = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();

  @Input()
  set data(data) {
    this.ownerData = data;
  }

  get data() {
    return this.ownerData;
  }

  ngOnInit() {
    console.log('OwnerComponentComponent ngOnInit ownerData', this.ownerData)
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
      // var evens = _.reject(this.dataFM, function (n) {
      //   return n.userName == name;
      // });
      let evens = this.dataFM.filter(delData => delData.userName != name)
      this.familyList = evens
    }

    console.log('familyList', this.familyList)
  }
}
