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
  uploadCasFileForm = this.fb.group({
    file: [, Validators.required],
    password: [, Validators.required]
  });
  clientId = AuthService.getClientId();
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'member'];
  dataSource = ELEMENT_DATA;
  displayedColumns2: string[] = ['position', 'name', 'weight', 'symbol', 'member'];
  dataSource2 = ELEMENT_DATA2;
  displayedColumns3: string[] = ['position', 'weight'];
  dataSource3 = ELEMENT_DATA3;
  displayedColumns5: string[] = ['position', 'name', 'weight'];
  dataSource5 = ELEMENT_DATA5;

  ngOnInit() { }


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

  getClientCASFileDetailData() {
    this.cusService.getClientCasFileDetailData({ clientId: this.clientId })
      .subscribe(res => {
        if (res) {
          console.log(res);
        }
      })
  }
}
export interface PeriodicElement {
  name: string;
  // position: number;
  weight: number;
  symbol: string;
  member: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth	', weight: 34549593 / 90, symbol: 'AATDF9032L', member: 'Rahul Jain' },

];
export interface PeriodicElement2 {
  name: string;
  // position: number;
  weight: string;
  symbol: string;
  member: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth	', weight: '5,00,000', symbol: 'Redemption - ELECTRONIC PAYMENT', member: 'Purchase' },

]

export interface PeriodicElement3 {
  position: string;
  // position: number;
  weight: string;

}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { position: 'Aditya Birla Sun Life Frontline Equity Fund-Growth	', weight: 'B12' },

]
export interface PeriodicElement5 {
  position: string;
  name: string;
  weight: string;

}

const ELEMENT_DATA5: PeriodicElement5[] = [
  { position: '0201765602028054DL4B6A8188390701PA3CPIMBCP107033681.pdf	', name: '10/11/2020 12.30PM', weight: 'In Queue. Click to Refresh' },

]