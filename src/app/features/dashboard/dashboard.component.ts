import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
      <p class="text-gray-600">Overview of your team performance</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Players Widget -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 uppercase font-semibold">Total Players</p>
            <h3 class="text-3xl font-bold text-gray-800">{{ (playerService.players$ | async)?.length || 0 }}</h3>
          </div>
          <div class="p-3 bg-blue-100 rounded-full text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- My Team Count Widget -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transform hover:scale-105 transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 uppercase font-semibold">My Team</p>
            <h3 class="text-3xl font-bold text-gray-800">
              {{ (playerService.myTeam$ | async)?.length || 0 }} / 11
            </h3>
          </div>
          <div class="p-3 bg-green-100 rounded-full text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Avg Rating Widget -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 uppercase font-semibold">Team Chemistry</p>
            <h3 class="text-3xl font-bold text-gray-800">
              {{ averageRating$ | async | number:'1.0-1' }}
            </h3>
          </div>
          <div class="p-3 bg-purple-100 rounded-full text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions or News? -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-xl font-bold mb-4">Welcome Manager!</h3>
      <p class="text-gray-600 mb-4">
        Build your ultimate team by selecting players from the list. Choose your formation wisely and dominate the pitch.
      </p>
      <div class="flex space-x-4">
        <a href="/players" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Browse Players
        </a>
        <a href="/team" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Manage Squad
        </a>
      </div>
    </div>
  `,
    styles: []
})
export class DashboardComponent {
    playerService = inject(PlayerService);

    averageRating$ = this.playerService.myTeam$.pipe(
        map(team => {
            if (team.length === 0) return 0;
            const total = team.reduce((acc, p) => acc + p.rating, 0);
            return total / team.length;
        })
    );
}
