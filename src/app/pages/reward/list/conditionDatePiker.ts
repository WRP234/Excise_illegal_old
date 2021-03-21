function setZero(num: number) {
    return num < 10 ? '0' + num : num;
  }

function  toDatePickerFormat(d: any) {
    return { date: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }, formatted: toLocalShort(d.toString()).replace(/ /g, ' ') };
  }

function getDatepiker(d){
    if (d.date.month < 10 && d.date.day< 10){
      var date = d.date.year+"-0"+d.date.month+"-0"+d.date.day;
      return date;
    }else if (d.date.month < 10 && d.date.day >= 10){
      var date = d.date.year+"-0"+d.date.month+"-"+d.date.day;
      return date;
    }else if (d.date.day < 10 && d.date.month >= 10){
      var date = d.date.year+"-"+d.date.month+"-0"+d.date.day;
      return date;
    }else{
      var date = d.date.year+"-"+d.date.month+"-"+d.date.day;
      return date;
    }
  }

export function toLocalShort(date: Date): string {
    if (!date) return null;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const dd = new Date(date);
    return dd.toLocaleString('th-TH', options);
}

function conditionDateFrom(dateFrom,dateTo){
    let date;
    if (dateFrom == null || dateFrom == ''){
      if (dateTo == null || dateTo == ''){
        return date = '';
      }else{
        return date = this.getDatepiker(dateTo);
      }
    }else{
      return date = this.getDatepiker(dateFrom);
    }
  }

function conditionDatePikerFrom(dateFrom,dateTo){
    let date;
    if (dateFrom == null || dateFrom == ''){
      if (dateTo == null || dateTo == ''){
        return date = '';
      }else{
        return date = dateTo;
      }
    }else{
      return date = dateFrom;
    }
  }

function conditionDateTo(dateFrom,dateTo){
    let date;
    if (dateTo == null || dateTo == ''){
      if (dateFrom == null || dateFrom == ''){
        return date = '';
      }else{
        return date = this.getDatepiker(this.toDatePickerFormat(new Date()));
      }
    }else{
      return date = this.getDatepiker(dateTo);
    }
  }

function conditionDatePikerTo(dateFrom,dateTo){
    let date;
    if (dateTo == null || dateTo == ''){
      if (dateFrom == null || dateFrom == ''){
        return date = '';
      }else{
        return date = this.toDatePickerFormat(new Date());
      }
    }else{
      return date = dateTo;
    }
  }

function noYear(year){
    let y;
    if (year == null || year == ''){
        return y = '';
    }else{
      return y = (parseInt(year)-543).toString();
    }
  }
  
  export {toDatePickerFormat ,getDatepiker ,conditionDateFrom , conditionDatePikerFrom, conditionDateTo, conditionDatePikerTo ,noYear};