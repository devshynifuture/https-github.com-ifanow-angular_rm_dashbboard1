import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-scrip',
  templateUrl: './add-scrip.component.html',
  styleUrls: ['./add-scrip.component.scss']
})
export class AddScripComponent implements OnInit {
  advisorId: any;
  clientId: any;
  maxDate = new Date();

  constructor(private eventService: EventService, private fb: FormBuilder, public dialogRef: MatDialogRef<AddScripComponent>, private cusService: CustomerService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  scripForm = this.fb.group({
    scripType: [, [Validators.required]],
    scripName: [, [Validators.required]],
    priceDetailsMarketPrice: [, [Validators.required]],
    priceDetailsPriceAsOn: [, [Validators.required]]
  })
  saveScrip() {
    if (this.scripForm.invalid){
      this.scripForm.get('scripName').markAsTouched();
      this.scripForm.get('priceDetailsMarketPrice').markAsTouched();
      this.scripForm.get('priceDetailsPriceAsOn').markAsTouched();
    }
    else{

      let obj =
      {
        "code":null,
        "bseCode":null,
        "stockCategoryId":null,
        "scripType":this.scripForm.get('scripType').value,
        "name": this.scripForm.get('scripName').value,
        "currentValue": this.scripForm.get('priceDetailsMarketPrice').value
      }
      this.cusService.addScrip(obj).subscribe(
        data => {
          console.log(data)
          this.eventService.openSnackBar("Scrip is added", "Dismiss")
          this.close();
        },
        error => this.eventService.showErrorMessage(error)
      )
    }
  }
  close() {
    this.dialogRef.close();
  }
}
