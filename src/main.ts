import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpHandler, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';

function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {

    console.log("[Outgoing request]");
    console.log(request)

    const req = request.clone({
        headers: request.headers.set('X_DEBUG', 'TESTING')
    });

    return next(req);
}


bootstrapApplication(AppComponent, { providers: [provideHttpClient(withInterceptors([loggingInterceptor]))] }).catch((err) => console.error(err));
