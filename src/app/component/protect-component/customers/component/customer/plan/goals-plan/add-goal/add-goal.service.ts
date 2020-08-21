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

  allocateOtherAssetToGoal(event, advisor_client_id, selectedGoal){
    let dashBoardData = selectedGoal.dashboardData
    if(dashBoardData.debt_monthly && dashBoardData.equity_monthly &&  dashBoardData.lump_debt && dashBoardData.lump_equity){
      let asset:any = event.item.data;
      let obj = this.createAllocationObject(asset, advisor_client_id, selectedGoal)
      if(asset.absAllocation < 100){
        asset.goalAssetMapping.forEach(element => {
          obj.percentAllocated = 100-element.percentAllocated
        });
        this.allocateAsset(obj);
      }else{
        this.eventService.openSnackBar("Asset already 100% allocated!!", "Dismiss");
      }
     
    }else{
      this.eventService.openSnackBar("Asset allocation unsuccessful !! your goal is already achieved", "Dismiss");
    }

  }
  allocateMFToGoal(mfAsset, advisor_client_id, selectedGoal) {
    let dashBoardData = selectedGoal.dashboardData
    if(dashBoardData.debt_monthly && dashBoardData.equity_monthly &&  dashBoardData.lump_debt && dashBoardData.lump_equity){
      let obj = this.createAllocationObjectForMf(mfAsset, advisor_client_id, selectedGoal);
      if(mfAsset.absAllocation < 100){
        this.allocateAsset(obj);
      }else{
        this.eventService.openSnackBar("Asset already 100% allocated!!", "Dismiss");
      }
    }else{
      this.eventService.openSnackBar("Asset allocation unsuccessful !! your goal is already achieved", "Dismiss");
    }

  }

  createAllocationObject(asset, advisor_client_id, selectedGoal){
    return {
      ...advisor_client_id,
      assetId: asset.assetId,
      assetType: asset.assetType,
      goalId: selectedGoal.remainingData.id,
      goalType: selectedGoal.goalType,
      percentAllocated: 100
    }
  }
  createAllocationObjectForMf(asset, advisor_client_id, selectedGoal){
    return {
      ...advisor_client_id,
      assetId: asset.id,
      assetType: asset.assetType,
      goalId: selectedGoal.remainingData.id,
      goalType: selectedGoal.goalType,
      percentAllocated: 100,
      isMutualFund:1
    }
  }

  allocateAsset(obj){
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
