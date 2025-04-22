import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Subscribable, Subscription, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  constructor(private httpClient: HttpClient, private errorService: ErrorService) { }

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Could not fetch places. Please try again later.');
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Could not fetch your favourite places. Please try again later.')
      .pipe(
        tap((userPlaces) => {
          this.userPlaces.set(userPlaces);
        })
      );
  }

  addPlaceToUserPlaces(place: Place) {

    const existingUserPlaces = this.userPlaces();
    const isPlaceAlreadyAdded = existingUserPlaces.some((userPlace) => userPlace.id === place.id);
    if (!isPlaceAlreadyAdded) {
      this.userPlaces.set([...this.userPlaces(), place]);
    } else {
      this.errorService.showError('Place already marked as favourite.');
    }

    return this.httpClient.put('http://localhost:3000/user-places', { placeId: place.id })
      .pipe(
        catchError(() => {
          this.userPlaces.set(existingUserPlaces);
          this.errorService.showError('Could not add place to your favourite places. Please try again later.');
          return throwError(() => {
            return new Error('Could not add place to your favourite places. Please try again later.');
          })
        })
      );
  }

  removeUserPlace(place: Place) {
    return this.httpClient.delete(`http://localhost:3000/user-places/${place.id}`)
      .pipe(
        tap(() => {
          this.userPlaces.set(this.userPlaces().filter((userPlace) => userPlace.id !== place.id));
        })
      );
  }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url)
      .pipe(
        map((response) => response.places),
        catchError((error) => {
          console.log(error);
          return throwError(
            () => {
              return new Error(errorMessage);
            }
          );
        })
      )
  }
}


