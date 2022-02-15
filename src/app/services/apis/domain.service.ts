import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Base, Domain } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DomainService {
  // readonly prefix2= 'http://192.168.0.11:8000/api/v1'
  // readonly prefix= 'api/v1/'
  readonly prefix = 'api/v1/';
  public domainTF: boolean = true;
  constructor(private http: HttpClient) {}
  getDomain(domain: string): Observable<Base<{ item: Domain }>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}stores/domain`, {
        headers: new HttpHeaders({
          Domain: domain,
        }),
      })
      .pipe(map((res: any) => res));
  }
  postDomain(domain: any): Observable<Base<{ item: Domain }>> {
    return this.http
      .post(environment.apiUrl + `${this.prefix}stores/domain`, domain)
      .pipe(map((res: any) => res));
  }
}
