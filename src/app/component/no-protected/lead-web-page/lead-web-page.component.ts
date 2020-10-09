import { EventService } from './../../../Data-service/event.service';
import { HttpService } from './../../../http-service/http-service';
import { apiConfig } from './../../../config/main-config';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { appConfig } from 'src/app/config/component-config';

@Component({
  selector: 'app-lead-web-page',
  templateUrl: './lead-web-page.component.html',
  styleUrls: ['./lead-web-page.component.scss']
})
export class LeadWebPageComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private eventService: EventService
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
  otherOptionFC: FormControl = new FormControl('');
  referralCodeFC: FormControl = new FormControl('');
  isFormSubmitted: boolean = false;

  ngOnInit() {
    this.userDetailForm = this.fb.group({
      name: ['',Validators.required],
      mobNo: ['',Validators.required],
      email: ['',Validators.required],
      description:['']
    });
  }
  
  toggleErrorOfFC(event){
    let value = event.value;
    if(+value === 5){
      this.otherOptionFC.setErrors(Validators.required);
    } else {
      this.otherOptionFC.setErrors(null);
    }
  }

  onSubmitForm(){
    if(this.userDetailForm.valid && this.optionsFC.valid){
      console.log("look into it", this.optionsFC.value, this.userDetailForm.value);
      let data = {
        name : this.userDetailForm.get('name').value,
        mobileNumber: this.userDetailForm.get('mobNo').value,
        email: this.userDetailForm.get('email').value,
        sourceId: +this.optionsFC.value
      }
      if(this.userDetailForm.get('description').value !== ''){
        data['description'] = this.userDetailForm.get('description').value;
      }
      if(this.referralCodeFC.value !==''){
        data['referral'] = this.referralCodeFC.value;
      }
      // this.http.post(apiConfig.MAIN_URL + appConfig.POST_LEAD_INTERACTION_RESPONSE, data)
      //   .subscribe(res=>{
      //     if(res){
      //       console.log(res);
      //     }
      //   }, err => {
      //     this.eventService.openSnackBar('Something went wrong', "DISMISS")
      //   })

    } else {
      this.optionsFC.markAsTouched();
      this.userDetailForm.markAllAsTouched();
    }
  }

  

}
