import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { GenresComponent } from './genres/genres.component';
import { SingleGenreComponent } from './single-genre/single-genre.component';
import {HttpClientModule} from '@angular/common/http';

const appRoutes: Routes = [
  {path: '', component: GenresComponent},
  {path: 'genre/:genre_name', component: SingleGenreComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    GenresComponent,
    SingleGenreComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
