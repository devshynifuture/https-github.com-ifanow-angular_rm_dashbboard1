import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit {
  showHide= false;
  constructor() { }

  ngOnInit() {
  }

  // showLess(value){
  //   if(value == true){
  //     this.showHide = false;
  //   }
  //   else{
  //     this.showHide = true;
  //   }

  // }
  saveFamilyMembers()
  {

  }

}
