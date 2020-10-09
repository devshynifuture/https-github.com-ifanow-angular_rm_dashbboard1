import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lead-web-page',
  templateUrl: './lead-web-page.component.html',
  styleUrls: ['./lead-web-page.component.scss']
})
export class LeadWebPageComponent implements OnInit {

  constructor(
    private fb: FormBuilder
  ) { }

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Submit',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  optionsFC: FormControl = new FormControl('', Validators.required);
  userDetailForm;

  ngOnInit() {
    this.userDetailForm = this.fb.group({
      name: ['',Validators.required],
      mobNo: ['',Validators.required],
      email: ['',Validators.required],
      description:['']
    });
  }

  onSubmitForm(){
    if(this.userDetailForm.valid && this.optionsFC.valid){
      
    } else {
      this.optionsFC.markAsTouched();
      this.userDetailForm.markAsTouched();
    }
  }

  

}
