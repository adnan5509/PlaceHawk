import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Subscribable, Subscription, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  constructor(private httpClient: HttpClient) { }

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Could not fetch places. Please try again later.');
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Could not fetch your favourite places. Please try again later.');
  }

  addPlaceToUserPlaces(place: Place) {
    return this.httpClient.put('http://localhost:3000/user-places', { placeId: place.id });
  }

  removeUserPlace(place: Place) {
    return this.httpClient.delete(`http://localhost:3000/user-places/${place.id}`);
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


