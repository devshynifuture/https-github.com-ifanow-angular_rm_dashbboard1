export function relationListFilterOnID(clientType) {
    let relationList;
    // if (clientType == 1) {
    relationList = [
        { name: 'Brother', value: 8 },
        { name: 'Sister', value: 9 },
        { name: 'Daughter_In_Law', value: 11 },
        { name: 'Sister_In_Law', value: 12 },
        { name: 'Son', value: 4 },
        { name: 'Daughter', value: 5 },
        { name: 'Wife', value: 3 },
        { name: 'Husband', value: 2 },
        { name: 'Others', value: 10 },
        { name: 'Grandmother', value: 13 },
        { name: 'Grandfather', value: 14 },
        { name: 'Father', value: 6 },
        { name: 'Mother', value: 7 },
        //     ];
        // }
        // if (clientType == 2) {
        // relationList = [
        { name: 'Niece', value: 15 },
        { name: 'Nephew', value: 16 },
        //     ]
        // }
        // if (clientType == 3) {
        // relationList = [
        { name: 'HUF', value: 18 },
        { name: 'Private Limited', value: 19 },
        // ]
        // }
        // if (clientType == 4) {
        // relationList = [
        { name: 'Sole proprietorship', value: 17 },
        // ]
        // }
    ]
    return relationList;

}