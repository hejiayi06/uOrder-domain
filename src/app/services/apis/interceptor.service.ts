import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WindowService } from '../local/window.service';
import { storageKeys } from 'src/app/share/configs';
import { MessageService } from 'src/app/share/components/message/message.service';
import { ErrorsService } from '../local/errors.service';

interface CustomHttpConfig {
  headers?: HttpHeaders;
}
// const ERR_MSG = '请求失败';
@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(
    private windowServe: WindowService,
    private errorServe: ErrorsService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('interceptor');
    // console.log('req :>> ', req);
    const auth = this.windowServe.getLocalStorage(storageKeys.auth);
    const merchant_id = this.windowServe.getLocalStorage(storageKeys.merchant);
    const store_id = this.windowServe.getLocalStorage(storageKeys.store);
    const user_id = this.windowServe.getLocalStorage(storageKeys.user);
    // const needToken = req.headers.get(storageKeys.needToken);
    let httpConfig: CustomHttpConfig = { headers: req.headers };
    // let reqHeaders = req.headers;
    if (auth) {
      httpConfig.headers = httpConfig.headers?.set(
        'Authorization',
        `Bearer ${auth}` || ''
      );
    }
    if (merchant_id) {
      httpConfig.headers = httpConfig.headers?.set(
        'merchantId',
        `${merchant_id}` || ''
      );
    }
    if (store_id) {
      httpConfig.headers = httpConfig.headers?.set(
        'storeId',
        `${store_id}` || ''
      );
    }
    if (user_id) {
      httpConfig.headers = httpConfig.headers?.set(
        'userId',
        `${user_id}` || ''
      );
    }
    const copyReq = req.clone(httpConfig);
    return next
      .handle(copyReq)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.errorServe.errorHandler(error);
    return throwError(error);
  }
}
