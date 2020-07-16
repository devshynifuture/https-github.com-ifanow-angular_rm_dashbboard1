import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PlanService } from '../../plan.service';
import { AuthService } from 'src/app/auth-service/authService';
import { LoaderFunction } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { Subscriber, Subscription } from 'rxjs';
import { AddGoalService } from './add-goal.service';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss'],
  providers: [LoaderFunction]
})
export class AddGoalComponent implements OnInit {

  @Input() data: any = {};
  @Input() popupHeaderText: string = 'KEY INFO';
  allAssetsList:any[] = [];
  clientId:any;

  familyList:any[] = [{familyMemberId: 'all', displayName: 'All'}];
  displayedAssets:any[] = [];
  currentAllocationFilter:string = 'all';
  currentFamilyFilter:any = 'all';
  currentSort:string = 'v-H2L';
  allocationBtnList = [
    {
      name: 'All Assets',
      filter: 'all',
    },
    {
      name: 'Unallocated',
      filter: 'unallocated',
    },
    {
      name: 'Partially allocated',
      filter: 'partially allocated',
    },
    {
      name: 'Fully allocated',
      filter: 'allocated',
    },
    {
      name: 'Un-deployed',
      filter: 'not-deployed',
    },
  ];
  sortBtnList:any[] = [
    {
      name: 'Value - high to low',
      sortKey: 'v-H2L'
    },
    {
      name: 'Value - low to high',
      sortKey: 'v-L2H'
    },
    {
      name: 'Asset type wise',
      sortKey: 'asset'
    },
    {
      name: 'Maturity - near to far',
      sortKey: 'm-N2F'
    },
    {
      name: 'Maturity - far to near',
      sortKey: 'm-F2N'
    },
  ];
  advisorId: any;
  subscription = new Subscription();

  
  constructor(
    private subInjectService: SubscriptionInject, 
    private goalService: PlanService,
    private loaderFn: LoaderFunction,
    private eventService: EventService,
    private peopleService: PeopleService,
    private planService: PlanService,
    private allocateService: AddGoalService,
  ) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.loaderFn.setFunctionToExeOnZero(this, this.filterAndSortAssets)
    this.getFamilyMembersList();
    this.loadAssets();
    this.subscription.add(
      this.planService.assetSubject.subscribe((data:any) => {
        this.allAssetsList = data.map(asset => {
          let absAllocation = 0;
          if(asset.goalAssetMapping) {
            asset.goalAssetMapping.forEach(element => {
              absAllocation += element.percentAllocated;
            });
          }
          return {absAllocation, ...asset};
        })
        this.filterAndSortAssets();
      })
    )
    this.subscription.add(
      this.allocateService.refreshAssetList.subscribe(()=> {
        this.loadAssets();
      })
    )
    
  }

  loadAssets(){
    let obj = {advisorId: this.advisorId, clientId: this.clientId}
    this.loaderFn.increaseCounter();
    this.goalService.getAssetsForAllocation(obj).subscribe((data)=>{
      this.allAssetsList = data;
      this.allAssetsList = this.allAssetsList.map(asset => {
        let absAllocation = 0;
        if(asset.goalAssetMapping) {
          asset.goalAssetMapping.forEach(element => {
            absAllocation += element.percentAllocated;
          });
        }
        return {absAllocation, ...asset};
      })
      this.loaderFn.decreaseCounter();
    }, err => {
      this.loaderFn.decreaseCounter();
      this.eventService.openSnackBar(err, "Dismiss")
    })
  }
  
  getFamilyMembersList() {
    const obj = {
      clientId: this.clientId,
    };
    this.loaderFn.increaseCounter();
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.familyList = data;
        }
        this.familyList.unshift({familyMemberId: 'all', displayName: 'All'})
        this.loaderFn.decreaseCounter();
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss");
        this.loaderFn.decreaseCounter();
      }
    );
  }

  filterAndSortAssets(){
    this.filterByFamily(this.currentFamilyFilter);
    this.filterByAllocation(this.currentAllocationFilter);
    this.sortList();
  }

  filterByFamily(member) {
    if(member.asset_owner_id == -1) {
      this.displayedAssets = this.allAssetsList;
    } else {
      this.displayedAssets = this.allAssetsList.filter((obj) => {
        return obj.familyMemberId === member.familyMemberId
      });
    }
  }

  filterByAllocation(filterType) {
    switch (filterType) {
      case 'all':
        this.displayedAssets = this.displayedAssets
        break;
      case 'unallocated':
        this.displayedAssets = this.displayedAssets.filter(asset => asset.absAllocation == 0);
        break;
      case 'partially allocated':
        this.displayedAssets = this.displayedAssets.filter(asset => asset.absAllocation > 0 && asset.absAllocation < 100)
        break;
      case 'allocated':
        this.displayedAssets = this.displayedAssets.filter(asset => asset.absAllocation == 100);
        break;
      case 'not-deployed':
        this.displayedAssets = this.displayedAssets.filter(asset => !asset.isDeployed);
        break;
    
      default:
        console.error("Invalid asset filter id found", filterType);
        break;
    }
  }

  sortList() {
    switch (this.currentSort) {
      case 'v-H2L': // value high to low
        this.displayedAssets = this.displayedAssets.sort((a,b)=>{
          return b.currentValue - a.currentValue;
        });
        break;

      case 'v-L2H': // value low to high
        this.displayedAssets = this.displayedAssets.sort((a,b)=>{
          return a.currentValue - b.currentValue;
        });
        break;

      case 'asset': // asset type
        this.displayedAssets = this.displayedAssets.sort((a,b) => {
          return b.assetType - a.assetType;
        });
        break;

      case 'm-N2F': // maturity near to far
        this.displayedAssets = this.displayedAssets.sort((a,b)=> {
          return a.maturityDate - b.maturityDate;
        });
        break;

      case 'm-F2N': // maturity far to near
        this.displayedAssets = this.displayedAssets.sort((a,b) => {
          return b.maturityDate - a.maturityDate;
        });
        break;
    }
  }
  
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
