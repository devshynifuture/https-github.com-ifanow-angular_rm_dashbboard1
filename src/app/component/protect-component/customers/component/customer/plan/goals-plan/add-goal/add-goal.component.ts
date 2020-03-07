import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})
export class AddGoalComponent implements OnInit {

  @Input() data: any = {};
  @Input() popupHeaderText: string = 'KEY INFO';

  // TODO:- replace tempDisplayData with data
  tempDisplayData = {
    data: [
      {
        "id": "1",
        "asset_owner": "Rahul Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 50,
        "asset_owner_id": "1",
        "current_value": 48941,
        "maturity_value": 951456,
        "maturity_year": 2029,
        "allocation_status": "partially allocated"
      },
      {
        "id": "2",
        "asset_owner": "Rahul Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 0,
        "asset_owner_id": "1",
        "current_value": 9842,
        "maturity_value": 198436,
        "maturity_year": 2040,
        "allocation_status": "unallocated"
      },
      {
        "id": "3",
        "asset_owner": "Rahul Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 0,
        "asset_owner_id": "1",
        "current_value": 3541,
        "maturity_value": 768541,
        "maturity_year": 2035,
        "allocation_status": "unallocated"
      },
      {
        "id": "4",
        "asset_owner": "Shilpa Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 50,
        "asset_owner_id": "2",
        "current_value": 65378,
        "maturity_value": 15498,
        "maturity_year": 2030,
        "allocation_status": "partially allocated"
      },
      {
        "id": "5",
        "asset_owner": "Shilpa Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 0,
        "asset_owner_id": "2",
        "current_value": 4443,
        "maturity_value": 8815785,
        "maturity_year": 2039,
        "allocation_status": "unallocated"
      },
      {
        "id": "6",
        "asset_owner": "Shilpa Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 100,
        "asset_owner_id": "2",
        "current_value": 55343,
        "maturity_value": 9785125,
        "maturity_year": 2032,
        "allocation_status": "allocated"
      },
      {
        "id": "7",
        "asset_owner": "Shilpa Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 0,
        "asset_owner_id": "2",
        "current_value": 12345,
        "maturity_value": 6354545,
        "maturity_year": 2038,
        "allocation_status": "unallocated"
      },
      {
        "id": "8",
        "asset_owner": "Ganesh Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 50,
        "asset_owner_id": "3",
        "current_value": 89754,
        "maturity_value": 789816,
        "maturity_year": 2036,
        "allocation_status": "partially allocated"
      },
      {
        "id": "9",
        "asset_owner": "Ganesh Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 0,
        "asset_owner_id": "3",
        "current_value": 63433,
        "maturity_value": 1657841,
        "maturity_year": 2031,
        "allocation_status": "unallocated"
      }
    ]
  }

  familyList:any[] = [];
  displayedAssets:any[] = [];
  currentAllocationFilter:string = 'all';
  currentFamilyFilter:any;
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
      filter: 'deployed',
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


  
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.data = this.tempDisplayData;
    this.createFamilyList();
    this.filterAndSortAssets(this.currentFamilyFilter, this.currentAllocationFilter);
    // this.displayData = this.data;
  }

  // Creates list of family members from the given assets list for the family filter buttons.
  createFamilyList(){
    this.familyList = this.data.data.map((obj) => {
      return {name: obj.asset_owner, asset_owner_id: obj.asset_owner_id, selected: false};
    }).filter((member, index, arr) => {
      return arr.findIndex(m => m.asset_owner_id === member.asset_owner_id) === index;
    });
    this.familyList.unshift({name: 'All family', asset_owner_id: -1});
    this.currentFamilyFilter = this.familyList[0];
  }

  filterByFamily(member) {
    if(member.asset_owner_id == -1) {
      this.displayedAssets = this.data.data;
    } else {
      this.displayedAssets = this.data.data.filter((obj) => {
        return obj.asset_owner_id === member.asset_owner_id
      });
    }
  }

  filterByAllocation(filterType) {
    if(filterType == 'all') {
      return; // Since filter by family is already taking fresh data
    } else {
      this.displayedAssets = this.displayedAssets.filter((obj)=> {
        return obj.allocation_status === filterType
      })
    }
  }

  filterAndSortAssets(member, filterType){
    this.currentFamilyFilter = member;
    this.currentAllocationFilter = filterType;
    this.filterByFamily(this.currentFamilyFilter);
    this.filterByAllocation(this.currentAllocationFilter);
    this.sortList(this.currentSort);
  }

  sortList(sortType) {
    this.currentSort = sortType;
    switch (sortType) {
      case 'v-H2L': // value high to low
        this.displayedAssets = this.displayedAssets.sort((a,b)=>{
          return b.current_value - a.current_value;
        });
        break;

      case 'v-L2H': // value low to high
        this.displayedAssets = this.displayedAssets.sort((a,b)=>{
          return a.current_value - b.current_value;
        });
        break;

      case 'asset': // asset type
        this.displayedAssets = this.displayedAssets.sort((a,b) => {
          return b.asset_id - a.asset_id;
        });
        break;

      case 'm-N2F': // maturity near to far
        this.displayedAssets = this.displayedAssets.sort((a,b)=> {
          return a.maturity_year - b.maturity_year;
        });
        break;

      case 'm-F2N': // maturity far to near
        this.displayedAssets = this.displayedAssets.sort((a,b) => {
          return b.maturity_year - a.maturity_year;
        });
        break;
    }
  }

  getAssetClass(allocated_percentage) {
    if(allocated_percentage == 100) {
      return 'btn-danger';
    } else if(allocated_percentage > 0) {
      return 'btn-success';
    } else {
      return 'btn-primary';
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
