import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
   userService = inject(UserService);

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.userService.getToken();
    console.log('Intercepted request:', req);
  console.log('Token:', token);

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
