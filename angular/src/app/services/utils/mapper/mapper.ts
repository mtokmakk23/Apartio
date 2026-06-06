import { Observable,of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';
import {keys} from './decorator';

export class Mapper<T>{
  call$: Observable<any>;

  constructor(){ }

  mapper<T>(data: any):Observable<any>{
    this.call$ = of(data);
    return this.call$.pipe(
      map(res => (res.constructor === Object)? this.transformResponse(res): res)
    )
  }

  transformResponse(response){
    if(response.constructor === Array){
      return response.map(item => this.transformToPlain(item));
    }
   
    return this.transformToPlain(response);
  }

  transformToPlain(plainOrClass){
    if(plainOrClass && plainOrClass.constructor !== Object){
      const result =  classToPlain(plainOrClass);
      return result;
    }else{
      return plainOrClass;
    } 
  }
}