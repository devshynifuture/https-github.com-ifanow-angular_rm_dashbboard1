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
    private eventService: EventService,
    private allocateOtherAssetService: AddGoalService

  ) { }

  ngOnInit() {
    console.log('singleObj',this.dialogData.singleObj)
    this.initializeForm()
  }
  initializeForm() {
    this.singleYearGoalForm = this.fb.group({
      // getMilestoneName: this.fb.array([]),

    });
    if (this.dialogData.data.length > 0) {

      
        this.singleYearGoalForm.addControl('getMilestoneName', this.fb.array([]))
        this.getMilestoneName.push(this.fb.group({
          onRetirementOrDemise: [(this.dialogData.singleObj.onRetirementOrDemise), [Validators.required]],
          milestoneTypeId: [this.dialogData.singleObj.milestoneTypeId, [Validators.required]],
          amount: [this.dialogData.singleObj.amount, Validators.required],
          id: this.dialogData.singleObj.id
        }));
    } else {
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
  }

  get getMilestoneName() {
    return this.singleYearGoalForm.get('getMilestoneName') as FormArray;
  }
  removeMilestone(item, obj1) {
    this.disabledMember(null, null);
    this.getMilestoneName.removeAt(item);
    let obj = {
      milestoneId: obj1.value.id,
    }
    this.plansService.deleteMilestone({ milestoneId: obj1.value.id }).subscribe(res => {
      this.allocateOtherAssetService.refreshAssetList.next();
    }, err => {
      this.eventService.openSnackBar(err);
    })
  }
  disabledMember(value, type) {
    this.callMethod = {
      methodName: 'disabledMember',
      ParamValue: value,
      disControl: type
    };
  }
  addMilestone(data) {
    this.getMilestoneName.push(this.fb.group({
      onRetirementOrDemise: [0],
      milestoneTypeId: [0],
      amount: [0],
    }));
  }
  saveMilestone() {

    if (this.dialogData.flag == 'Edit') {
      let obj = {
        onRetirementOrDemise: this.singleYearGoalForm.value.getMilestoneName[0].onRetirementOrDemise,
        milestoneTypeId: this.singleYearGoalForm.value.getMilestoneName[0].milestoneTypeId,
        amount: this.singleYearGoalForm.value.getMilestoneName[0].amount,
        id:this.singleYearGoalForm.value.getMilestoneName[0].id,
      }
      this.plansService.saveMileStone('obj').subscribe(res => {
        // this.loadAllGoals();
        this.allocateOtherAssetService.refreshAssetList.next();
        this.eventService.openSnackBar("Milestone updated successfully");
        this.dialogRef.close();
      }, err => {
        this.eventService.openSnackBar(err);
      })
    } else {
      let obj = {}
      obj['milestoneModels'] = [];
      obj['id'] = this.dialogData.otherData.remainingData.id
      this.singleYearGoalForm.value.getMilestoneName.forEach(element => {
        if (element.onRetirementOrDemise != 0) {
          element.id = this.dialogData.otherData.remainingData.id
          obj['milestoneModels'].push(element)
        }
      });

      this.plansService.saveMileStone(obj).subscribe(res => {
        // this.loadAllGoals();
        this.allocateOtherAssetService.refreshObservable.next();
        this.eventService.openSnackBar("Milestone added successfully");
        this.dialogRef.close();
      }, err => {
        this.eventService.openSnackBar(err);
      })
    }
  }

}
