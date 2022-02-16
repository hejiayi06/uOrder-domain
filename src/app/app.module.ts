import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
      // scope: './',
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
      // registrationStrategy: "registerImmediately",
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
