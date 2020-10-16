import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AddGoalService } from '../add-goal/add-goal.service';

@Component({
  selector: 'app-add-milestone',
  templateUrl: './add-milestone.component.html',
  styleUrls: ['./add-milestone.component.scss']
})
export class AddMilestoneComponent implements OnInit {
  singleYearGoalForm: any;
  callMethod: { methodName: string; ParamValue: any; disControl: any; };
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  constructor(
    public dialogRef: MatDialogRef<AddMilestoneComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    private plansService: PlanService,
    private eventService :EventService,
    private allocateOtherAssetService: AddGoalService

    ) { }

  ngOnInit() {
    this.initializeForm()
  }
  initializeForm() {
    this.singleYearGoalForm = this.fb.group({
    
    });
    if (this.dialogData.otherData.goalType === 1) {
      this.singleYearGoalForm.addControl('getMilestoneName', this.fb.array(
        [this.fb.group({
          onRetirementOrDemise: [0],
          milestoneTypeId: [0],
          amount: [0],
        })]),

      )
    }
  }

  get getMilestone() {
    return this.singleYearGoalForm.get('getMilestoneName') as FormArray;
  }
  removeMilestone(item) {
    this.disabledMember(null, null);
    this.getMilestone.removeAt(item);
  }
  disabledMember(value, type) {
    this.callMethod = {
      methodName: 'disabledMember',
      ParamValue: value,
      disControl: type
    };
  }
  addMilestone(data) {
    this.getMilestone.push(this.fb.group({
      onRetirementOrDemise: [0],
      milestoneTypeId: [0],
      amount: [0],
    }));
  }
  saveMilestone(){
    let obj ={}
     obj['milestoneModels'] = [];
    this.singleYearGoalForm.value.getMilestoneName.forEach(element => {
      if(element.onRetirementOrDemise != 0){
        element.goalId = this.dialogData.otherData.remainingData.id
       obj['milestoneModels'].push(element)
      }
   });
   
   this.plansService.saveMileStone(obj).subscribe(res => {
    // this.loadAllGoals();
    this.allocateOtherAssetService.refreshAssetList.next();
    this.eventService.openSnackBar("Asset unallocated");
    this.dialogRef.close();
  }, err => {
    this.eventService.openSnackBar(err);
  })
  }
}
