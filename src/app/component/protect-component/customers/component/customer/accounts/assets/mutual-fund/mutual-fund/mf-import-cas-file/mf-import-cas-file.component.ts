import { AuthService } from './../../../../../../../../../../auth-service/authService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';

@Component({
  selector: 'app-mf-import-cas-file',
  templateUrl: './mf-import-cas-file.component.html',
  styleUrls: ['./mf-import-cas-file.component.scss']
})
export class MfImportCasFileComponent implements OnInit {

  constructor(
    private cusService: CustomerService,
    private fb: FormBuilder
  ) { }
  clientId = AuthService.getClientId();

  ngOnInit() { }

  uploadCasFileForm = this.fb.group({
    file: [, Validators.required],
    password: [, Validators.required]
  });

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadCasFileForm.get('file').setValue(file);
    }
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.uploadCasFileForm.get('file').value);
    formData.append('clientId', this.clientId);
    formData.append('password', this.uploadCasFileForm.get('password').value);
    this.cusService.postUploadCasFile(formData)
      .subscribe(res => {
        if (res) {
          console.log(res);
        }
      }, err => {
        console.error(err);
      })
  }


  getClientLatestCasLog() {
    let data = {
      clientId: this.clientId
    }
    this.cusService.getClientLatestCASFileLogs(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
        }
      }, err => {
        console.error(err);
      })
  }




}
