import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  readonly isBrowser!: Boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('this.isBrowser :>> ', this.isBrowser);
  }
  setLocalStorage(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }
  getLocalStorage(key: string): string | null | undefined | void {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
  }
  removeLocalStorage(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }
  clearLocalStorage(): void {
    if (this.isBrowser) {
      localStorage.clear();
    }
  }
  setSessionStorage(key: string, value: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(key, value);
    }
  }
  getSessionStorage(key: string): string | null | undefined | void {
    if (this.isBrowser) {
      return sessionStorage.getItem(key);
    }
  }
  removeSessionStorage(key: string): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(key);
    }
  }
  clearSessionStorage(): void {
    if (this.isBrowser) {
      sessionStorage.clear();
    }
  }
}
