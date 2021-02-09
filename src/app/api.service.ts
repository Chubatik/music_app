import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }
  domen = `http://ws.audioscrobbler.com/2.0/`;
  apiKey = 'api_key=b0414dc9024f62cd2a4524179e9b1b15';
  format = 'format=json';
  public getGenreTopAlbums(genre: string): Observable<any>{
    return this.httpClient.get(`${this.domen}?method=tag.gettopalbums&tag=${genre}&${this.apiKey}&${this.format}`);
  }
}
// http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=GENRE&api_key=ATOKEN&format=json
