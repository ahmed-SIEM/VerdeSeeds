import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterType'
})
export class FilterTypePipe implements PipeTransform {
  transform(items: any[], type: string): any[] {
    if (!items || !type) {
      return items;
    }
    return items.filter(item => item.typeArticle === type);
  }
}
