import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-single-genre',
  templateUrl: './single-genre.component.html',
  styleUrls: ['./single-genre.component.css']
})
export class SingleGenreComponent implements OnInit {

  constructor(private location: Location, private apiService: ApiService) { }
  path = '';
  genre = '';
  topAlbums = [];
  ngOnInit(): void {
    this.path = this.location.path();
    this.genre = this.parsePath(this.path);
    this.getTopAlbums(this.genre);
  }
  getTopAlbums(genre: string): void{
    this.apiService.getGenreTopAlbums(genre).subscribe(
      data => {
        this.topAlbums = data.albums.album;
      }
    );
  }
  parsePath(path: string): string{
    const last = path.lastIndexOf('/');
    const genre = path.slice(last + 1);
    return genre;
  }
}
