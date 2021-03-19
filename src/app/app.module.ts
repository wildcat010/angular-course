import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './service/authentication/authentication.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { NotFoundComponent } from './not-found/not-found.component';
import { InterceptorProviders } from './interceptor/interceptorProviders';
import { SharedModule } from './shared/module/shared.module';
import { ErrorService } from './service/error/error.service';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from './service/language/language.service';
import { LocalStorageService } from './service/local-storage/local-storage.service';
import { Subscription } from 'rxjs';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatDividerModule,
    MatMenuModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    AuthenticationService,
    InterceptorProviders,
    ErrorService,
    LanguageService,
    LocalStorageService,
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule],
})
export class AppModule {
  private languageSubscription: Subscription;
  constructor(
    public translate: TranslateService,
    private langugage: LanguageService
  ) {
    translate.addLangs(['en', 'fr']);

    this.languageSubscription = this.langugage.currentUserSubject.subscribe(
      (userLang) => {
        if (userLang) {
          translate.use(userLang);
        } else {
          this.translate.setDefaultLang('en');
        }
      }
    );
  }

  ngOnDestroy() {
    this.languageSubscription.unsubscribe();
  }
}
