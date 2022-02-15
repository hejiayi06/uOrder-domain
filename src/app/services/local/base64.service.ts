import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';

@Injectable({
  providedIn: 'root',
})
export class Base64Service {
  constructor() {}
  encode64(data: string): string {
    if (Base64.isValid(data)) {
      return Base64.encode(data);
    } else {
      return 'data is not valid';
    }
  }
  decode64(data: string): string {
    return Base64.decode(data);
  }
  encodeURI64(data: string): string {
    if (Base64.isValid(data)) {
      return Base64.encodeURI(data);
    } else {
      return 'data is not valid';
    }
  }
  encodeURL64(data: string): string {
    if (Base64.isValid(data)) {
      return Base64.encodeURL(data);
    } else {
      return 'data is not valid';
    }
  }
}
