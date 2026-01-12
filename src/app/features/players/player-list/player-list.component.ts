import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../../services/player.service';
import { Player } from '../../../models/player.model';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { combineLatest, BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerCardComponent],
  template: `
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 class="text-3xl font-bold text-gray-800">Transfer Market</h2>
        
        <!-- Filters -->
        <div class="flex gap-4 w-full md:w-auto">
          <input type="text" 
                 placeholder="Search player..." 
                 class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 md:w-64"
                 [ngModel]="searchTerm$ | async"
                 (ngModelChange)="searchTerm$.next($event)">
          
          <select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [ngModel]="positionFilter$ | async"
                  (ngModelChange)="positionFilter$.next($event)">
            <option value="">All Positions</option>
            <option value="GK">Goalkeepers</option>
            <option value="DEF">Defenders</option>
            <option value="MID">Midfielders</option>
            <option value="FWD">Forwards</option>
          </select>
        </div>
      </div>

      <!-- Player Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <ng-container *ngFor="let player of filteredPlayers$ | async">
          <app-player-card 
            [player]="player" 
            [actionLabel]="'Add to Team'"
            (select)="addPlayer($event)">
          </app-player-card>
        </ng-container>
      </div>
      
      <div *ngIf="(filteredPlayers$ | async)?.length === 0" class="text-center py-12 text-gray-500">
        No players found matching your criteria.
      </div>
    </div>
  `,
  styles: []
})
export class PlayerListComponent {
  playerService = inject(PlayerService);

  searchTerm$ = new BehaviorSubject<string>('');
  positionFilter$ = new BehaviorSubject<string>('');

  filteredPlayers$ = combineLatest([
    this.playerService.players$,
    this.searchTerm$,
    this.positionFilter$
  ]).pipe(
    map(([players, term, position]) => {
      return players.filter(player => {
        const matchesName = player.name.toLowerCase().includes(term.toLowerCase());
        const matchesPosition = position ? player.position === position : true;
        return matchesName && matchesPosition;
      });
    })
  );

  addPlayer(player: Player) {
    const success = this.playerService.addPlayerToTeam(player);
    if (success) {
      alert(`${player.name} added to your squad!`);
    } else {
      alert(`Cannot add ${player.name}. Team might be full (11 players) or player already selected.`);
    }
  }
}
