import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EventService } from './../../../../Data-service/event.service';
import { SupportService } from './../support.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sendy-excel',
  templateUrl: './sendy-excel.component.html',
  styleUrls: ['./sendy-excel.component.scss']
})
export class SendyExcelComponent implements OnInit {

  constructor(
    private supportService: SupportService,
    private eventService: EventService,
    private fb: FormBuilder
  ) { }
  sendyForm: FormGroup;
  isMainLoading: boolean = false;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.sendyForm = this.fb.group({
      listId: [null, Validators.required],
      file: [null, Validators.required]
    })
  }

  onFileSelected(event) {
    console.log(event);
    let data = {
      fileName: event.target.files[0].name
    }
    if (event.target.files) {
      this.formSubmit(data, event);
    }
  }

  formSubmit(data, event) {
    if (this.sendyForm.valid) {
      this.isMainLoading = true;
      this.supportService.getFileUrlForSendy(data)
        .subscribe(res => {
          const { bucketName, s3ObjectKey, uploadUrl } = res;
          this.supportService.putUploadSendyExcelFile(uploadUrl, event.target.files[0])
            .subscribe(response => {
              let obj = {
                s3ObjectKey,
                bucketName,
                listId: this.sendyForm.get('listId').value
              }
              this.supportService.postSendyDataAfterFileUpload(obj)
                .subscribe(value => {
                  console.log("after uplaod", value);
                  this.eventService.openSnackBar("File Uploaded Successfully", "DISMISS");
                  this.sendyForm.reset({ emitEvent: false });
                  // event
                  this.isMainLoading = false;
                }, err => {
                  this.eventService.openSnackBar('Something went wrong', "DISMISS");
                  console.error(err);
                })
            }, err => {
              this.eventService.openSnackBar('Something went wrong', "DISMISS");
              console.error(err);
            });
        }, err => {
          this.eventService.openSnackBar('Something went wrong', "DISMISS");
          console.error(err);
        })
    } else {
      this.sendyForm.markAllAsTouched();
    }
  }

}
