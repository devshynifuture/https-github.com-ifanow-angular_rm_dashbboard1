import { Injectable } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { PlanService } from '../../plan.service';
import { Subject } from 'rxjs';
import { copyArrayItem } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class AddGoalService {

  constructor(
    private eventService: EventService,
    private plansService: PlanService,
  ) { }

  refreshObservable = new Subject();
  refreshAssetList = new Subject();

  allocateOtherAssetToGoal(event, advisor_client_id, selectedGoal) {
    let dashBoardData = selectedGoal.dashboardData
    if (dashBoardData.debt_monthly == 0  && dashBoardData.equity_monthly == 0 && dashBoardData.lump_debt ==0 && dashBoardData.lump_equity ==0) {
      this.eventService.openSnackBar("Asset allocation unsuccessful !! your goal is already achieved", "Dismiss");
    } else {
      let asset: any = event.item.data;
      let obj = this.createAllocationObject(asset, advisor_client_id, selectedGoal)
      if (asset.absAllocation < 100) {
        asset.goalAssetMapping.forEach(element => {
          obj.percentAllocated = 100 - element.percentAllocated
        });
        obj.lump_debt = selectedGoal.dashboardData.lump_debt
        obj.lump_equity = selectedGoal.dashboardData.lump_equity
        obj.currentValue = asset.currentValue
        this.allocateAsset(obj);
      } else {
        this.eventService.openSnackBar("Asset already 100% allocated!!", "Dismiss");
      }
    }

  }
  allocateMFToGoal(mfAsset, advisor_client_id, selectedGoal) {
    let dashBoardData = selectedGoal.dashboardData
    if (dashBoardData.debt_monthly == 0  && dashBoardData.equity_monthly == 0 && dashBoardData.lump_debt ==0 && dashBoardData.lump_equity ==0) {
      this.eventService.openSnackBar("Asset allocation unsuccessful !! your goal is already achieved", "Dismiss");
    } else {
      let obj = this.createAllocationObjectForMf(mfAsset, advisor_client_id, selectedGoal);
      if (mfAsset.absAllocation < 100) {
        // mfAsset.goalAssetMapping.forEach(element => {
        //   obj.percentAllocated = 100 - element.percentAllocated
        // });
        obj.lump_debt = selectedGoal.dashboardData.lump_debt
        obj.lump_equity = selectedGoal.dashboardData.lump_equity
        obj.currentValue = mfAsset.currentValue
        obj.sipPercent = parseInt(mfAsset.sipPercent)
        obj.lumpsumPercent = parseInt(mfAsset.lumpsumPercent)
        this.allocateAsset(obj);
      } else {
        this.eventService.openSnackBar("Asset already 100% allocated!!", "Dismiss");
      }
    }

  }

  createAllocationObject(asset, advisor_client_id, selectedGoal) {
    return {
      ...advisor_client_id,
      assetId: asset.assetId,
      assetType: asset.assetType,
      goalId: selectedGoal.remainingData.id,
      goalType: selectedGoal.goalType,
      percentAllocated: 100
    }
  }
  createAllocationObjectForMf(asset, advisor_client_id, selectedGoal) {
    return {
      ...advisor_client_id,
      assetId: asset.id,
      assetType: 5,
      goalId: selectedGoal.remainingData.id,
      goalType: selectedGoal.goalType,
      percentAllocated: 0,
      isMutualFund: 1
    }
  }

  allocateAsset(obj) {
    this.plansService.allocateOtherAssetToGoal(obj).subscribe(res => {
      this.refreshObservable.next();
      this.plansService.assetSubject.next(res);
      this.refreshAssetList.next();
      this.eventService.openSnackBar("Asset allocated to goal", "Dismiss");
    }, err => {
      this.eventService.openSnackBar(err);
    })
  }
}
