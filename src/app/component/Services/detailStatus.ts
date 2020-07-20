export const detailStatusObj = {
  transactionDetailStatus: {
    ORDER: [
      {
        name: 'Pending authorization',
        helper: 'You will soon receive OTP/Payment link via Email & SMS. It could take upto 10 minutes.',
        checked: false, isShow: false, status: 2
      },
      {name: 'OTP authorised', checked: false, isShow: false, status: 3},
      {name: 'Payment successful', checked: false, isShow: false, status: 3},
      {name: 'Pending submission to AMC', checked: false, isShow: false, status: 4},
      {name: 'Order submitted to AMC', checked: false, isShow: false, status: 5},
      {name: 'Order processed', checked: false, isShow: false, status: 6},
      {name: 'Units allotted', checked: false, isShow: false, status: 8},
    ],
    REDEMPTION: [
      {
        name: 'Pending authorization',
        helper: 'You will soon receive OTP via Email & SMS. It could take upto 10 minutes.',
        checked: false, status: 2
      },
      {name: 'OTP authorised', checked: false, status: 3},
      {name: 'Pending submission to AMC', checked: false, status: 4},
      {name: 'Order submitted to AMC', checked: false, status: 5},
      {name: 'Order processed', checked: false, status: 6},
      {name: 'Units redeemed', checked: false, status: 8},
    ],
    SWP: [
      {
        name: 'Pending authorization',
        helper: 'You will soon receive OTP via Email & SMS. It could take upto 10 minutes.',
        checked: false, status: 2
      },
      {name: 'OTP authorised', checked: false, status: 3},
      {name: 'Pending submission to AMC', checked: false, status: 4},
      {name: 'Order submitted to AMC', checked: false, status: 5},
      {name: 'Order processed', checked: false, status: 6},
    ],
    SWITCH: [
      {
        name: 'Pending authorization',
        helper: 'You will soon receive OTP via Email & SMS. It could take upto 10 minutes.',
        checked: false, status: 2
      },
      {name: 'OTP authorised', checked: false, status: 3},
      {name: 'Pending submission to AMC', checked: false, status: 4},
      {name: 'Order submitted to AMC', checked: false, status: 5},
      {name: 'Order processed', checked: false, status: 6},
      {name: 'Units transferred', checked: false, status: 8},
    ],
    STP: [
      {
        name: 'Pending authorization',
        helper: 'You will soon receive OTP via Email & SMS. It could take upto 10 minutes.',
        checked: false, status: 2
      },
      {name: 'OTP authorised', checked: false, status: 3},
      {name: 'Pending submission to AMC', checked: false, status: 4},
      {name: 'Order submitted to AMC', checked: false, status: 5},
      {name: 'Order processed', checked: false, status: 6},
      {name: 'Units redeemed', checked: false, status: 8},
    ],

  }
};
