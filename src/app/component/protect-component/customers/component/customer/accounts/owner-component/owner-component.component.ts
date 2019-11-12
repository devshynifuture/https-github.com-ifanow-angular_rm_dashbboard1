import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-owner-component',
  templateUrl: './owner-component.component.html',
  styleUrls: ['./owner-component.component.scss']
})
export class OwnerComponentComponent implements OnInit {
  isownerName = false;
  fixedDeposit: any;
  s: string[] = ['Sneha', 'gayatri', 'Shivani'];

  family: Observable<string[]>;
  constructor(private fb: FormBuilder,private custumService : CustomerService) { }

  ngOnInit() {
    this.getListFamilyMem()
    this.getdataForm()
  }
getListFamilyMem(){
  let obj = {
    clientId : 2980
  }
  this.custumService.getListOfFamilyByClient(obj).subscribe(
    data => this.getListOfFamilyByClientRes(data)
  );
}
getListOfFamilyByClientRes(data){

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
