export interface UpperTableBox {
    description: string;
    month1: string;
    month2: string;
    month3: string;
    month4: string;
    month5: string;
    month6: string;
    month7: string;
    month8: string;
    month9: string;
    month10: string;
    month11: string;
    month12: string;
    total: string;
    remove: string;
}

export interface Group {
    groupName: string
}

export interface GoalTableI {
    goal: string,
    goalYear: string,
    monthlyRequired: string,
    lumpsumRequired: string,
    allocate: string
}

export interface loanTableI {
    loan: string,
    loanYear: string,
    monthlyRequired: string,
    lumpsumRequired: string,
    allocate: string
}