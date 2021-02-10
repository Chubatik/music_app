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
  topAlbums: any[] = [];
  inputValue = '';
  searchedAlbums: any[] = [];
  ngOnInit(): void {
    this.path = this.location.path();
    this.genre = this.parsePath(this.path);
    this.getTopAlbums(this.genre);
  }
  getTopAlbums(genre: string): void{
    this.apiService.getGenreTopAlbums(genre).subscribe(
      data => {
        this.topAlbums = data.albums.album;
        this.searchedAlbums = this.topAlbums;
      }
    );
  }

  out(): void {
    this.searchedAlbums = [];
    if (this.inputValue !== ''){
      this.topAlbums.forEach((e: any) => {
        if (e.name.toLowerCase().includes(this.inputValue)) {
          this.searchedAlbums.push(e);
        }
      });
    } else {
      this.searchedAlbums = this.topAlbums;
    }
  }
  parsePath(path: string): string{
    const last = path.lastIndexOf('/');
    const genre = path.slice(last + 1);
    return genre;
  }
}
