import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';


@Component({
  selector: 'app-people-team-members',
  templateUrl: './people-team-members.component.html',
  styleUrls: ['./people-team-members.component.scss']
})
export class PeopleTeamMembersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'mobile', 'email', 'type', 'map', 'action'];
  dataSource = ELEMENT_DATA;
  validatorType = ValidatorType;
  constructor(private fb: FormBuilder) { }
teamInviteForm:FormGroup;
  ngOnInit() {
    this.teamInviteForm = this.fb.group({
      name:['',[Validators.required]],
      email:['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      mobile:['',[Validators.required]],
      role:['',[Validators.required]],
      lead:['',[Validators.required]],
      euin:['',[Validators.required]]
    })
  }

  sendInvitation(){
    if(this.teamInviteForm.invalid){
      for(let c in this.teamInviteForm.controls){
        this.teamInviteForm.controls[c].markAsTouched();
      }
    }
    else{
      console.log(this.teamInviteForm.value,"teamInviteForm");
    }
  }
}
export interface PeriodicElement {
  name: string;
  mobile: string;
  email: string;
  type: string;
  map: string;
  action: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Amit Mehta', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: '' },
  { name: 'Amitesh Anand', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: '' },
  { name: 'Hemal Karia', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: '' },
  { name: 'Kiran Kumar', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: '' },
];