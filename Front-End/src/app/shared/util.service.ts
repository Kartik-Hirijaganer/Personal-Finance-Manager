import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  toggle(state: boolean): boolean {
    return !state;
  }
}