import {Component, OnInit} from '@angular/core';
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
  isLikedAlbumsOpened = false;
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
        if (this.isLikedAlbumsOpened) {
          this.searchedAlbums = this.storedAlbums;
        }
        this.checkForLike(this.topAlbums, this.storedAlbums);
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
  removeFromStoredAlbums(album: any): void {
    for (let i = 0; i < this.storedAlbums.length; i++) {
      if (this.storedAlbums[i].name === album.name) {
        this.storedAlbums.splice(i,1);
      }
    }
  }
  likeAlbum(album: any): boolean {
    if (album.liked === null || album.liked === false) {
      this.counter++;
      album.liked = true;
      this.addToLocalStorage(album);
      this.storedAlbums = this.allStorage();
    } else {
      this.counter--;
      album.liked = false;
      this.removeFromLocalStorage(album);
      this.removeFromStoredAlbums(album);
    }
    return album.liked;
  }
  searchAlbums(albums: any[]): void {
    this.searchedAlbums = [];
    if (this.inputValue !== ''){
      albums.forEach((e: any) => {
        const lowerName = e.name.toLowerCase();
        const lowerInput = this.inputValue.toLowerCase();
        if (lowerName.includes(lowerInput)) {
          this.searchedAlbums.push(e);
        }
      });
    } else {
      this.searchedAlbums = albums;
    }
  }
  out(): void {
    if (this.isLikedAlbumsOpened) {
      this.searchAlbums(this.storedAlbums);
    } else {
      this.searchAlbums(this.topAlbums);
    }
  }
  openLikedAlbums(): void {
    this.isLikedAlbumsOpened = !this.isLikedAlbumsOpened;
    if (this.isLikedAlbumsOpened){
      this.searchedAlbums = this.storedAlbums;
    } else {
      this.searchedAlbums = this.topAlbums;
      this.getTopAlbums(this.genre);
    }
  }

  parsePath(path: string): string{
    const last = path.lastIndexOf('/');
    return path.slice(last + 1);
  }
}
