import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.component.html',
  styleUrls: ['./add-portfolio.component.scss']
})
export class AddPortfolioComponent implements OnInit {
  clientId: any;
  advisorId: any;

  constructor(private fb: FormBuilder, private cusService: CustomerService,
    public dialogRef: MatDialogRef<AddPortfolioComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any, private eventService: EventService) { }

  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    console.log(this.dialogData)
  }
  portfolioGroup = this.fb.group({
    portfolioName: [, [Validators.required]]
  })
  addPortfolio() {
    if (this.portfolioGroup.get('portfolioName').invalid) {
      this.portfolioGroup.get('portfolioName').markAsTouched();
      return;
    }
    this.dialogData.positiveMethod();
  }
  close() {
    this.dialogRef.close();
  }
}
