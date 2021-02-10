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
  counter = 0;
  path = '';
  genre = '';
  topAlbums: any[] = [];
  inputValue = '';
  searchedAlbums: any[] = [];
  storedAlbums: any[] = [];
  ngOnInit(): void {
    this.path = this.location.path();
    this.genre = this.parsePath(this.path);
    this.getTopAlbums(this.genre);
    this.storedAlbums = this.allStorage();
  }
  getTopAlbums(genre: string): void{
    this.apiService.getGenreTopAlbums(genre).subscribe(
      data => {
        this.topAlbums = data.albums.album;
        this.topAlbums.forEach((e: any) => {
          e.liked = null;
        });
        this.searchedAlbums = this.topAlbums;
        this.checkForLike(this.topAlbums, this.storedAlbums);
        this.countLikedAlbums(this.storedAlbums);
      }
    );

  }

  checkForLike(topAlbums: any[], storedAlbums: any[]): void{
    for (let topAlbum of topAlbums) {
      for (let storedAlbum of storedAlbums) {
        if (topAlbum.name === storedAlbum.name) {
          topAlbum.liked = true;
        }
      }
    }
  }
  countLikedAlbums(storedAlbums: any[]): void{
    storedAlbums.forEach((e: any) => {
      this.counter++;
    })
  }
  allStorage(): any {
    let values: any[] = [],
      parsedValues = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while ( i-- ) {
      values.push( localStorage.getItem(keys[i]) );
    }
    for (const value of values) {
      parsedValues.push(JSON.parse(value));
    }
    return parsedValues;
  }

  addToLocalStorage(album: any): void {
    localStorage.setItem(`${album.name}`, JSON.stringify(album));
  }

  removeFromLocalStorage(album: any): void {
    localStorage.removeItem(`${album.name}`);
  }

  likeAlbum(album: any): boolean {
    if (album.liked === null || album.liked === false) {
      this.counter++;
      album.liked = true;
      this.addToLocalStorage(album);
      return album.liked;
    } else {
      this.counter--;
      album.liked = false;
      this.removeFromLocalStorage(album);
      return album.liked;
    }
  }

  out(): void {
    this.searchedAlbums = [];
    if (this.inputValue !== ''){
      this.topAlbums.forEach((e: any) => {
        const lowerName = e.name.toLowerCase();
        const lowerInput = this.inputValue.toLowerCase();
        if (lowerName.includes(lowerInput)) {
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
