import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

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
  userPlaces = this.placesService.loadedUserPlaces;

  constructor(private placesService: PlacesService) {
  }

  ngOnInit() {
    this.isFetching.set(true);
    this.subscriptions.push(this.placesService.loadUserPlaces().subscribe({
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
    this.subscriptions.forEach((subscribtion) => {
      subscribtion.unsubscribe();
    })
  }

  onDeleteUserPlace(selectedUserPlace: Place) {
    this.subscriptions.push(
      this.placesService.removeUserPlace(selectedUserPlace).subscribe({
        complete: () => {
          console.log("Completed");
        }
      })
    );
  }




}
