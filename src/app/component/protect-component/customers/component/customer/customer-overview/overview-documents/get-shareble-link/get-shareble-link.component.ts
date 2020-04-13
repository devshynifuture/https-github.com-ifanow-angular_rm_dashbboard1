import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-get-shareble-link',
  templateUrl: './get-shareble-link.component.html',
  styleUrls: ['./get-shareble-link.component.scss']
})
export class GetSharebleLinkComponent implements OnInit {


  dataCount: number;
  displayedColumns: string[] = ['checkbox', 'no', 'ownerName'];
  bankList: any;
  popUP: any;
  email: any;
  emailVierify: any;
  link: any;
  flag: any;
  validatorType = ValidatorType;
  emailIdList: any;
  docObj: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public dialogRef: MatDialogRef<GetSharebleLinkComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private eventService :EventService,) { }


  isLoading = false
  dataS = []
  ngOnInit() {
    const ELEMENT_DATA = this.dataS;
    console.log('investorList == ', this.data)
    this.link = this.data.bank;
    this.flag =this.data.flag
    this.getdataForm(this.link)
    this.emailIdList =[]
  }
  getdataForm(data) {
    this.emailVierify = this.fb.group({
      emailId: [(!data) ? '' : data.emailId, [Validators.required]],
      link:[(!data) ? '' : data.link, [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.emailVierify.controls;
  }
  saveEmail() {
    let obj ={
      email : this.emailIdList,
      link:this.emailVierify.controls.link.value
    }
    this.dialogRef.close(obj);
  }
  onNoClick(value): void {
   if(value == 'sendEmail'){
    this.dialogRef.close(this.link);
   }else{
     console.log('37563756 link ==',this.link)
    this.dialogRef.close('');

   }
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    if (value && value.length > 0) {
      if (this.validatorType.EMAIL.test(value)) {
        this.emailIdList.push({ emailAddress: value });
      } else {
        this.eventService.openSnackBar('Enter valid email address');
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(singleEmail): void {
    this.docObj.splice(singleEmail, 1);

  }
}
