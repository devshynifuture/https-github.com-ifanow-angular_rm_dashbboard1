import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-nominee',
  templateUrl: './nominee.component.html',
  styleUrls: ['./nominee.component.scss']
})
export class NomineeComponent implements OnInit {


  isownerName = false;

  s: string[] = ['Sneha', 'gayatri', 'Shivani'];
  family: string[];
  advisorId: any;
  nomineeData: any;
  clientId: any;
  nominee: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService) { }
  @Output() valueChange = new EventEmitter();
  @Input()
  set data(data) {
    this.nomineeData = data;
    this.getListFamilyMem(data);
  }

  get data() {
    return this.nomineeData;
  }
  ngOnInit() {
    console.log('ownerData', this.nomineeData)
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
 
  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data)
    this.family = data.familyMembersList
    this.valueChange.emit(data);
  }
  getdataForm() {
    this.nominee = this.fb.group({
      nomineeName: [(this.nomineeData.nomineeName.value == null) ? '' : this.nomineeData.nomineeName.value, [Validators.required]],
    });
    if (this.nominee.controls.nomineeName.value == '') {
      this.getFormControl().nomineeName.setValue(this.nomineeData.nomineeName.value);
    }
  }
  getFormControl(): any {
    return (this.nominee.controls);
  }

}
