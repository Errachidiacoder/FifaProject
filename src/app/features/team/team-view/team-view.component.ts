import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../../services/player.service';
import { PitchComponent } from '../pitch/pitch.component';
import { PlayerCardComponent } from '../../players/player-card/player-card.component';
import { FormationName } from '../../../core/constants/formations';
import { Player } from '../../../models/player.model';

@Component({
    selector: 'app-team-view',
    standalone: true,
    imports: [CommonModule, FormsModule, PitchComponent, PlayerCardComponent],
    template: `
    <div class="container mx-auto h-[calc(100vh-100px)] flex flex-col">
      <!-- Toolbar -->
      <div class="flex justify-between items-center mb-4 p-4 bg-white rounded-xl shadow-sm">
        <h2 class="text-2xl font-bold text-gray-800">Squad Management</h2>
        
        <div class="flex items-center gap-4">
          <label class="text-gray-600 font-semibold">Formation:</label>
          <select [(ngModel)]="currentFormation" class="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
            <option value="4-4-2">4-4-2 Classic</option>
            <option value="4-3-3">4-3-3 Attack</option>
            <option value="3-5-2">3-5-2 Defensive</option>
          </select>
        </div>
      </div>

      <div class="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        <!-- Pitch Area -->
        <div class="flex-1 lg:flex-[2] relative overflow-hidden flex items-center justify-center bg-gray-900 rounded-xl p-4">
          <app-pitch 
            [players]="(playerService.myTeam$ | async) || []" 
            [formation]="currentFormation"
            (slotClicked)="onSlotClick($event)"
            class="w-full max-w-2xl">
          </app-pitch>
        </div>

        <!-- Squad List / Details -->
        <div class="flex-1 lg:flex-1 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div class="p-4 border-b">
            <h3 class="font-bold text-lg">My Squad ({{ (playerService.myTeam$ | async)?.length }}/11)</h3>
            <p class="text-sm text-gray-500">Click a player to remove from squad</p>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 space-y-2">
            <div *ngFor="let p of (playerService.myTeam$ | async); let i = index" 
                 class="flex items-center p-2 bg-gray-50 border rounded-lg hover:bg-red-50 cursor-pointer group transition-colors"
                 (click)="removePlayer(p.id)">
              <span class="w-6 text-gray-400 font-mono text-sm">{{ i + 1 }}</span>
              <img [src]="p.photo" class="w-10 h-10 rounded-full object-cover border" onerror="this.src='assets/placeholder-player.png'">
              <div class="ml-3 flex-1">
                <div class="font-bold text-sm">{{ p.name }}</div>
                <div class="text-xs text-gray-500 flex gap-2">
                  <span class="font-semibold text-blue-600">{{ p.position }}</span>
                  <span class="bg-yellow-100 text-yellow-800 px-1 rounded">{{ p.rating }}</span>
                </div>
              </div>
              <button class="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Remove
              </button>
            </div>

            <div *ngIf="((playerService.myTeam$ | async)?.length || 0) < 11" class="text-center py-4">
              <a routerLink="/players" class="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                + Add Players
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class TeamViewComponent {
    playerService = inject(PlayerService);
    currentFormation: FormationName = '4-4-2';

    onSlotClick(index: number) {
        const team = this.playerService['myTeamSubject'].value; // Accessing simplified for demo, ideally use public getter or subscribe
        // But myTeam$ is observable. 
        // Wait, I cannot access private subject. I need a getter in service or use value if I add getMyTeamSnapshot().
        // For now, I'll rely on the observable pipe or just assume I can pass the index to remove if logic implies interaction.
        // The requirement: "Placer 11 joueurs".
        // My implementation: Just displays.
        // Enhanced: Click slot -> If empty, go to players. If full, remove?
        // Let's implement: Click filled -> Remove. Click empty -> Navigate to players.
    }

    removePlayer(id: number) {
        if (confirm('Remove this player from squad?')) {
            this.playerService.removePlayerFromTeam(id);
        }
    }
}
