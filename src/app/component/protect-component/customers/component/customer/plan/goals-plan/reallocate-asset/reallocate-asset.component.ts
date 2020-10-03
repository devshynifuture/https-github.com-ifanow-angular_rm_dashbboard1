import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { PlanService } from '../../plan.service';
import { Subscription, Subscriber } from 'rxjs';
import { AuthService } from 'src/app/auth-service/authService';
import { AddGoalService } from '../add-goal/add-goal.service';
import { ValidatorType } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-reallocate-asset',
  templateUrl: './reallocate-asset.component.html',
  styleUrls: ['./reallocate-asset.component.scss']
})
export class ReallocateAssetComponent implements OnInit {

  remainingAllocation: number = 0;
  availableAllocation: number = 0;
  reallocationFG: FormGroup;
  allocationData: any = {};
  goalData: any = {};
  subscriber = new Subscriber();
  advisorId: any;
  clientId: any;
  decimalValidator = ValidatorType.NUMBER_ONLY_WITH_TWO_DECIMAL;
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
  allocationToThisGoal: number = 0;
  allocated: any;
  allocation: any;
  showMf: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ReallocateAssetComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    private eventService: EventService,
    private plansService: PlanService,
    private allocateOtherAssetService: AddGoalService
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.allocationData = this.dialogData.allocationData;
    this.goalData = this.dialogData.goalData;
    this.allocated = this.dialogData.allocated
    this.allocation = this.dialogData.allocation
    if (this.allocationData) {
      if (this.allocationData.assetName == 'Mutual Funds') {
        this.showMf = true
      }
    } else if (this.allocated.assetType == 5) {
      this.showMf = true
    } else {
      this.showMf = false
    }
  }

  ngOnInit() {
    if (this.allocated && this.showMf == true) {
      this.availableAllocation = this.allocated.allocatedToOtherGoal;
      if (this.allocated && this.allocationData.lumpsumOrSip == 2 && this.allocationData.sipPercent != 0) {
         this.availableAllocation = 100 - this.allocated.allocatedToOtherGoal;
        this.remainingAllocation = 100 - this.allocated.allocatedToOtherGoal - ((this.allocated) ? this.allocated.sipPercent : this.allocationData.sipPercent);
      } else if (this.allocated && this.allocationData.lumpsumOrSip == 1 && this.allocationData.lumpsumPercent != 0) {
         this.availableAllocation = 100 - this.allocated.allocatedToOtherGoal;
        this.remainingAllocation = 100 - this.allocated.allocatedToOtherGoal - ((this.allocated) ? this.allocated.lumpsumPercent : this.allocationData.lumpsumPercent);
      } else {
        this.availableAllocation = 100 - this.allocationData.allocatedToOtherGoal;
        this.remainingAllocation = 100 - this.allocationData.allocatedToOtherGoal - this.allocationData.percentAllocated;
      }
    } else {
      this.availableAllocation = 100 - this.allocationData.allocatedToOtherGoal;
      this.remainingAllocation = 100 - this.allocationData.allocatedToOtherGoal - this.allocationData.percentAllocated;
    }

    this.reallocationFG = this.fb.group({
      allocatedPercentage: [this.allocationData.percentAllocated, [Validators.required, Validators.max(this.availableAllocation), Validators.min(1)]]
    });
    if (this.showMf == true) {
      this.reallocationFG.addControl('sipPercent', this.fb.control((this.allocated) ? this.allocated.sipPercent : this.allocationData.sipPercent, [Validators.required]))
      this.reallocationFG.addControl('lumpsumPercent', this.fb.control((this.allocated) ? this.allocated.lumpsumPercent : this.allocationData.lumpsumPercent, [Validators.required]))
      this.reallocationFG.controls.allocatedPercentage.setValue(this.availableAllocation)
    }

    this.subscriber.add(
      this.reallocationFG.controls.allocatedPercentage.valueChanges.subscribe((value:string) => {
        if(value) {
          this.remainingAllocation = (this.availableAllocation - parseFloat(value));
        } else {
          this.remainingAllocation = 0;
        }
      })
    )
    this.subscriber.add(
      this.reallocationFG.controls.lumpsumPercent.valueChanges.subscribe((value:string) => {
        if(value) {
          this.remainingAllocation = (this.availableAllocation - parseFloat(value));
        } else {
          this.remainingAllocation = 0;
        }
      })
    )
    this.subscriber.add(
      this.reallocationFG.controls.sipPercent.valueChanges.subscribe((value:string) => {
        if(value) {
          this.remainingAllocation = (this.availableAllocation - parseFloat(value));
        } else {
          this.remainingAllocation = 0;
        }
      })
    )
  }

  reallocate() {
    // if(this.reallocationFG.invalid || this.barButtonOptions.active) {
    //   this.reallocationFG.markAllAsTouched();
    //   return;
    // }
    this.barButtonOptions.active = true;
    let obj = {
      id: this.allocationData.id,
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetId: this.allocationData.assetId,
      assetType: this.allocationData.assetType,
      goalId: this.goalData.remainingData.id,
      allocateOrEdit: 2,
      lumpsumPercent: null,
      sipPercent: null,
      goalType: this.goalData.goalType,
      percentAllocated: parseFloat(parseFloat(this.reallocationFG.controls.allocatedPercentage.value).toFixed(2))
    }
    if (this.allocationData.assetName == 'Mutual Funds') {
      obj.lumpsumPercent = parseInt(parseFloat(this.reallocationFG.controls.lumpsumPercent.value).toFixed(2));
      obj.sipPercent = parseInt(parseFloat(this.reallocationFG.controls.sipPercent.value).toFixed(2));
    }

    this.plansService.allocateOtherAssetToGoal(obj).subscribe(res => {
      this.eventService.openSnackBar("Asset allocation updated");
      this.allocateOtherAssetService.refreshObservable.next();
      this.dialogRef.close();
    }, err => {
      this.eventService.openSnackBar(err);
      this.barButtonOptions.active = false;
    })
  }

}
