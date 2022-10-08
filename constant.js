export const barData = [
    {
        value: 7000000,
        label: '1',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 12000000,
        label: '2',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 8000000,
        label: '3',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 8000000,
        label: '4',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 9000000,
        label: '5',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 8500000,
        label: '6',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 9500000,
        label: '7',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 11000000,
        label: '8',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 8000000,
        label: '9',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 9000000,
        label: '10',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 9500000,
        label: '11',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },
    {
        value: 9000000,
        label: '12',
        labelTextStyle: { color: 'gray' },
        frontColor: '#177AD5',

    },

];
export const barData2 = [
    {
        value: 7000000,
        label: '1',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 12000000,
        label: '2',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 8000000,
        label: '3',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 8000000,
        label: '4',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 9000000,
        label: '5',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 8500000,
        label: '6',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 9500000,
        label: '7',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 11000000,
        label: '8',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 8000000,
        label: '9',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 9000000,
        label: '10',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 9500000,
        label: '11',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },
    {
        value: 9000000,
        label: '12',
        labelTextStyle: { color: 'gray' },
        frontColor: '#ED6665',
    },

];

export const pieData = [
    { value: 3000000, color: '#177AD5', text: '54%', content: 'Ăn uống' },
    { value: 1000000, color: '#79D2DE', text: '30%', content: 'Đi lại' },
    { value: 500000, color: '#ED6665', text: '26%', content: 'Dịch vụ' },
    { value: 6500000, color: '#FFFFFF', text: '26%', content: 'Còn lại' },
];
export const DayFormat = (date, type) => {
    const value = new Date(date);
    // const value = values.toDate()
    // console.log(`=> value 1`, value.toLocaleDateString("vi-VN"))
    switch (type) {
        case "DATE":
            return `${value.toLocaleDateString("vi-VN")}`
        case "TIME":
            return `${value.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}`
        default:
            return `${value.toLocaleDateString("vi-VN")} | ${value.toLocaleTimeString("vi-VN")}`
    }
}
export const addSpace = (text) => {
    let newText = ''
    for (let i = 0; i < text.length; i++) {
        if (i === 3 || i === 7 || i === 11) {
            newText += text[i]
            newText += ' '
        } else {
            newText += text[i]
        }
    }
    const arr = newText.split(/\b(\s)/);
    arr.forEach((item, index) => {
        if (item === " " || item === "") {
            arr.splice(index, 1)
        }
    })
    // arr.splice(4, 1)
    return arr
}
export const creditArr = [{
    accountNum: '012345679800',
    creditNum: '012345678900',
    expDate: '12/23',
    typeCredit: 'visa',
    brandCredit: 'Sacombank'
}, {
    accountNum: '789456123000',
    creditNum: '789456312000',
    expDate: '12/50',
    typeCredit: 'debit',
    brandCredit: 'Sacombank'
}, {
    accountNum: '545642131230',
    creditNum: '812315760000',
    expDate: '13/50',
    typeCredit: 'debit',
    brandCredit: 'Sacombank'
}]

export const TaskList1 = [
    {
        "_id": "1a1",
        "titleTask": "tiêu đề Task1",
        "date": "Mon Aug 08 2022 02:12:04 GMT+0700 (Indochina Time)",
        "notification": false,
        "taskGroup": [
            {
                "title": "title2",
                "list": [{
                    "task": "task",
                    "complete": true
                }, {
                    "task": "task",
                    "complete": true
                }, {
                    "task": "task2",
                    "complete": true
                }]
            },
            {
                "title": "title1",
                "list": [{
                    "task": "task4",
                    "complete": false
                }, {
                    "task": "task5",
                    "complete": true
                }, {
                    "task": "task6",
                    "complete": false
                }]
            }
        ]
    }, {
        "_id": "2a2",
        "titleTask": "tiêu đề Task2",
        "notification": false,
        "date": "Mon Aug 08 2022 02:12:04 GMT+0700 (Indochina Time)",
        "taskGroup": [
            {
                "title": "title3",
                "list": [{
                    "task": "task",
                    "complete": true
                }, {
                    "task": "task111",
                    "complete": false
                }, {
                    "task": "task222",
                    "complete": true
                }]
            },
            {
                "title": "title4",
                "list": [{
                    "task": "task444",
                    "complete": false
                }, {
                    "task": "task555",
                    "complete": true
                }, {
                    "task": "task66",
                    "complete": false
                }]
            }
        ]
    }

]
export const numberFormat = (value) =>
    new Intl.NumberFormat('it-IT').format(value);

export const spending = [
    {
        content: 'Ăn sáng',
        value: 25000,
        date: '022-10-05T18:11:50.882Z',
        type: 'EATING'
    },
    {
        content: 'Ăn trưa',
        value: 25000,
        date: '022-10-05T18:11:50.882Z',
        type: 'EATING'
    },
    {
        content: 'Youtube Premium',
        value: 50000,
        date: '022-10-05T18:11:50.882Z',
        type: 'SERVICE'
    },
    {
        content: 'Đổ xăng',
        value: 500000,
        date: '022-10-05T18:11:50.882Z',
        type: 'MOVING'
    },
    {
        content: 'Lương',
        value: 5000000,
        date: '022-10-05T18:11:50.882Z',
        type: 'INCOME'
    },
]