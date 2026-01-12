import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../services/player.service';
import { interval, Subscription, map, takeWhile, tap } from 'rxjs';

@Component({
  selector: 'app-match-sim',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto max-w-4xl p-4">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Scoreboard -->
        <div class="bg-gray-900 text-white p-8 text-center relative">
          <div class="absolute top-4 left-4 text-xs font-mono text-gray-400">Match Simulation</div>
          
          <div class="flex justify-between items-center mb-8">
            <div class="w-1/3 text-right">
              <h2 class="text-3xl font-bold">My Team</h2>
              <p class="text-gray-400 font-mono text-sm">Rating: {{ (teamRating$ | async | number:'1.0-0') || 0 }}</p>
            </div>
            
            <div class="w-1/3 flex flex-col items-center">
              <div class="text-6xl font-black font-mono tracking-widest bg-black/30 px-6 py-2 rounded-lg">
                {{ score.home }} - {{ score.away }}
              </div>
              <div class="mt-2 text-green-400 font-mono font-bold">{{ matchTime }}'</div>
            </div>
            
            <div class="w-1/3 text-left">
              <h2 class="text-3xl font-bold">Opponent</h2>
              <p class="text-gray-400 font-mono text-sm">Rating: {{ opponentRating }}</p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div class="bg-green-500 h-2 rounded-full transition-all duration-300" 
                 [style.width.%]="(matchTime / 90) * 100"></div>
          </div>

          <button *ngIf="!isMatchRunning" 
                  (click)="startMatch()"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
                  [disabled]="(playerService.myTeam$ | async)?.length === 0">
            {{ matchTime === 0 ? 'KICK OFF' : 'RESTART MATCH' }}
          </button>
        </div>

        <!-- Events Log -->
        <div class="p-6 bg-gray-50 h-64 overflow-y-auto border-t">
          <h3 class="text-gray-500 font-bold uppercase text-xs mb-4">Match Commentary</h3>
          <div class="space-y-2">
            <div *ngFor="let event of matchEvents" class="flex items-start animate-fade-in-up">
              <span class="font-mono text-sm font-bold w-12 text-gray-400">{{ event.time }}'</span>
              <span class="flex-1 text-gray-800" [ngClass]="{'font-bold text-blue-600': event.type === 'goal'}">
                {{ event.message }}
              </span>
            </div>
            <div *ngIf="matchEvents.length === 0" class="text-center text-gray-400 italic py-8">
              Match hasn't started yet...
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class MatchSimComponent implements OnDestroy {
  playerService = inject(PlayerService);

  isMatchRunning = false;
  matchTime = 0;
  score = { home: 0, away: 0 };
  opponentRating = Math.floor(Math.random() * 20) + 70; // 70-90
  matchEvents: { time: number; message: string; type: 'info' | 'goal' | 'card' }[] = [];

  private matchSub?: Subscription;

  teamRating$ = this.playerService.myTeam$.pipe(
    map(team => {
      if (team.length === 0) return 0;
      return team.reduce((acc, p) => acc + p.rating, 0) / team.length;
    })
  );

  startMatch() {
    if (this.isMatchRunning) return;

    // Reset
    this.resetMatch();
    this.isMatchRunning = true;
    this.matchEvents.push({ time: 0, message: 'The match begins!', type: 'info' });

    // Assuming we can get rating snapshot
    // In real app, simplify this
    let homeStrength = 50;
    const sub = this.teamRating$.subscribe(r => homeStrength = r);
    sub.unsubscribe();

    this.matchSub = interval(100).pipe( // 100ms = 1 min
      takeWhile(() => this.matchTime < 90),
      tap(() => {
        this.matchTime++;
        this.simulateMinute(homeStrength);
      })
    ).subscribe({
      complete: () => {
        this.isMatchRunning = false;
        this.matchEvents.unshift({ time: 90, message: `FULL TIME! Score: ${this.score.home} - ${this.score.away}`, type: 'info' });
      }
    });
  }

  private simulateMinute(homeStats: number) {
    // Chance of event
    if (Math.random() > 0.92) { // 8% chance per minute
      const isGoal = Math.random() > 0.7; // 30% goal, 70% miss/card
      const isHomeEvent = Math.random() * 100 < homeStats - (this.opponentRating - 50); // Weighted by rating diff

      if (isGoal) {
        if (isHomeEvent) {
          this.score.home++;
          this.matchEvents.unshift({ time: this.matchTime, message: 'GOAAAL! What a finish by your team!', type: 'goal' });
        } else {
          this.score.away++;
          this.matchEvents.unshift({ time: this.matchTime, message: 'Goal for the opponent...', type: 'goal' });
        }
      } else {
        const msg = isHomeEvent ? 'Close chance for your team!' : 'Opponent misses a sitter!';
        this.matchEvents.unshift({ time: this.matchTime, message: msg, type: 'info' });
      }
    }
  }

  resetMatch() {
    this.matchTime = 0;
    this.score = { home: 0, away: 0 };
    this.matchEvents = [];
    this.opponentRating = Math.floor(Math.random() * 20) + 70;
  }

  ngOnDestroy() {
    this.matchSub?.unsubscribe();
  }
}
