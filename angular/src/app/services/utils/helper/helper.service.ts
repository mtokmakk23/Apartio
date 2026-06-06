import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  isStringIsNullOrEmpty = (val: string) => {
    if (val == null) {
      return true;
    }
    if (val == undefined) {
      return true;
    }
    if (val.trim() == '') {
      return true;
    }
    return false;
  };

  isNullOrUndefined = (val: any) => {
    if (val == null) {
      return true;
    }
    if (val == undefined) {
      return true;
    }
    return false;
  };
  getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(' ', '');
      if (newValue.indexOf(',') === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(' ', '');
          return color;
        } else return newValue;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = 'rgba(' + rgbaColor + ',' + val[1] + ')';
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }


  searchByField(field: string) {
  return (term: string, item: any) => {
    if (!term) return true;

    const value = item[field];

    const normalize = (val: string) =>
      val
        ?.toLocaleLowerCase('tr-TR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    return normalize(value).includes(normalize(term));
  };
}
}
