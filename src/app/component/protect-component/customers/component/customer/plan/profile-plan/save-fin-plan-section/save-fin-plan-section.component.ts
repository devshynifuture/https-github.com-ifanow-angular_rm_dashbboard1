import { Component, OnInit, Inject } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { PlanService } from '../../plan.service';

@Component({
  selector: 'app-save-fin-plan-section',
  templateUrl: './save-fin-plan-section.component.html',
  styleUrls: ['./save-fin-plan-section.component.scss']
})
export class SaveFinPlanSectionComponent implements OnInit {
  selectedElement: any;
  savePlan: any;

  constructor(public dialogRef: MatDialogRef<SaveFinPlanSectionComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public planService: PlanService,
    private eventService: EventService, ) {
  }

  ngOnInit() {
    console.log('preview == ', this.data);
    this.selectedElement = this.data.selectedElement
    console.log('preview == ', this.selectedElement);
    this.getdataForm(this.selectedElement)
  }
  getdataForm(data) {
    if (!data) {
      data = {
        address: {}
      };
    } else if (!data.address) {
      data.address = null;
    }
    console.log('getdataForm data: ', data);
    this.savePlan = this.fb.group({
      reportName: [!data ? '' : (data.name) ? data.name : data.reportName, [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.savePlan.controls;
  }
  onNoClick(value): void {
    this.dialogRef.close(this.savePlan.get('reportName').value);

  }
  savePlanSection() {
    this.dialogRef.close(this.savePlan.get('reportName').value);
  }

}
