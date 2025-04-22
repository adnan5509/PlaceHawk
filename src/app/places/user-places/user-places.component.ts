import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { catchError, map, Subscription, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  isFetching = signal(false);
  error = signal('');
  userPlaces = signal<Place[] | undefined>(undefined);

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.isFetching.set(true);
    this.subscriptions.push(
      this.httpClient.get<{ places: Place[] }>('http://localhost:3000/user-places').pipe(
        map((response) => response.places),
        catchError((error) => {
          console.log(error);
          return throwError(
            () => {
              return new Error('Could not fetch user places. Please try again later.');
            }
          );

        })
      ).subscribe({
        next: (places) => {
          this.userPlaces.set(places);
        },
        complete: () => {
          this.isFetching.set(false);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        }

      })

    );


  }
  ngOnDestroy() {
    throw new Error('Method not implemented.');
  }




}
