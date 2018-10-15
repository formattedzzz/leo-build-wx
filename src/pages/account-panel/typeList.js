
export let outcomeList = [
  {
    typeid: 'T001',
    typedesc: '吃饭',
    typeicon: '/static/svg/food-out.svg'
  },
  {
    typeid: 'T002',
    typedesc: '购物',
    typeicon: '/static/svg/buy-out.svg'
  },
  {
    typeid: 'T003',
    typedesc: '住房',
    typeicon: '/static/svg/house-out.svg'
  },
  {
    typeid: 'T004',
    typedesc: '约会',
    typeicon: '/static/svg/appointment-out.svg'
  }
]
export let incomeList = [
  {
    typeid: 'T101',
    typedesc: '工资',
    typeicon: '/static/svg/income-in.svg'
  },
  {
    typeid: 'T102',
    typedesc: '理财',
    typeicon: '/static/svg/stock-in.svg'
  }
]
export let getNowFormatDate = function () {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}
