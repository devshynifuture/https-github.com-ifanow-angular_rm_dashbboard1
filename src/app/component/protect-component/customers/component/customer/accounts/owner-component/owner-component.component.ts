import { Component, OnInit, Input } from '@angular/core';
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
  fixedDeposit: any;
  s: string[] = ['Sneha', 'gayatri', 'Shivani'];
  family: string[];
  advisorId: any;
  ownerData: any;

  constructor(private fb: FormBuilder,private custumService : CustomerService) { }
  @Input()
  set data(data) {
    this.ownerData = data;
    this.getListFamilyMem(data);
  }

  get data() {
    return this.ownerData;
  }
  ngOnInit() {
    console.log('ownerData',this.ownerData)
    this.advisorId = AuthService.getAdvisorId();
    this.getListFamilyMem('')
    this.getdataForm()
    this.family = this.s;
  }
getListFamilyMem(data){
  let obj = {
    advisorId:this.advisorId,
    clientId : 2978
  }
  this.custumService.getListOfFamilyByClient(obj).subscribe(
    data => this.getListOfFamilyByClientRes(data)
  );
}
getListOfFamilyByClientRes(data){
console.log('family Memebers',data)
this.family = data.familyMembersList
}
getdataForm(){
  this.fixedDeposit = this.fb.group({
    ownerName: [, [Validators.required]],  
  });
  this.getFormControl().ownerName.maxLength = 40;
}
getFormControl():any {
  return this.fixedDeposit.controls;
}
}
