import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-epf',
  templateUrl: './add-epf.component.html',
  styleUrls: ['./add-epf.component.scss']
})
export class AddEPFComponent implements OnInit {
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  showHide = false;

  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data;
    // this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  display(value){
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  showLess(value){
    if(value  == true){
      this.showHide = false;
    }else{
      this.showHide = true;
    }
  }
  // getDateYMD(){
  //   let now = moment();
  //   this.tenure =moment(this.recuringDeposit.controls.commencementDate.value).add(this.recuringDeposit.controls.tenure.value, 'months');
  //   this.getDate = this.datePipe.transform(this.tenure , 'yyyy-MM-dd')
  //   return this.getDate;
  // }
}
