<script lang="ts">
  import { onMount } from "svelte";
  import type {
    ApiSearchResponse,
    ApiPlayerProfile,
    ApiMatchResponse,
    ApiMatchTeam,
    ApiMatch,
  } from "../types";

  let duprToken = $state("");
  let inUsername = $state("christine gonzales");
  let results = $state<ApiSearchResponse | null>(null);
  let player = $state<ApiPlayerProfile | null>(null);
  let playerHistory = $state<ApiMatch[] | null>(null);

  let visibleColumns = $state({
    date: true,
    event: false,
    playerAndPartner: false,
    opponent: true,
    score: true,
    result: true,
  });

  function toggleColumn(column: keyof typeof visibleColumns) {
    visibleColumns[column] = !visibleColumns[column];
  }

  async function searchUser(event: Event) {
    event.preventDefault();
    const url = "https://api.dupr.gg/player/v1.0/search";
    console.log("about to search");
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${duprToken}`,
      },
      body: JSON.stringify({
        limit: 10,
        offset: 0,
        query: inUsername,
        exclude: [],
        includeUnclaimedPlayers: true,
        filter: {
          lat: 45.5051064,
          lng: -122.6750261,
          rating: {
            maxRating: null,
            minRating: null,
          },
          locationText: "",
        },
      }),
    });
    const data = await response.json();
    results = data as ApiSearchResponse;
    player = data.result.hits[0] as ApiPlayerProfile;

    if (player && player.id) {
      fetchPlayerHistory(player.id);
    }
  }

  async function fetchPlayerHistory(playerId: number) {
    const url = `https://api.dupr.gg/player/v1.0/${playerId}/history?limit=25&offset=0`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${duprToken}`,
      },
    });
    const data = (await response.json()) as ApiMatchResponse;
    playerHistory = data.result.hits;
  }

  async function saveToken() {
    localStorage.setItem("dupr-token", duprToken);
  }

  onMount(async () => {
    duprToken = localStorage.getItem("dupr-token") || "";
  });
</script>

<div class="flow">
  <h1 class="text-2xl font-bold">PB Insight</h1>

  <!-- Token Input -->
  <details class="collapse collapse-arrow bg-base-100 border-base-300 border">
    <summary class="collapse-title font-semibold">DUPR Token Input</summary>
    <div class="collapse-content">
      <div class="form-control">
        <label class="label" for="token">Token</label>
        <input
          id="token"
          type="text"
          placeholder="eY..."
          class="input input-bordered"
          bind:value={duprToken}
        />
      </div>
      <button class="btn btn-primary w-fit mt-4" onclick={saveToken}
        >Store token</button
      >
    </div>
  </details>

  <!-- Search Form -->
  <div class="card bg-base-100 border-base-300">
    <div class="card-body">
      <h2 class="card-title">Search for a player</h2>
      <form class="flow" onsubmit={searchUser}>
        <div class="form-control">
          <label class="label" for="username">Username</label>
          <input
            id="username"
            type="text"
            class="input input-bordered"
            bind:value={inUsername}
          />
        </div>
        <button type="submit" class="btn btn-primary">Search</button>
      </form>
    </div>
  </div>

  {#if player}
    <div class="card bg-base-100 border-base-300">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">{player.fullName}</h2>
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-sm">Columns</div>
            <ul
              class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <label class="label cursor-pointer">
                  <span class="label-text">Date</span>
                  <input
                    type="checkbox"
                    class="toggle toggle-sm"
                    checked={visibleColumns.date}
                    onchange={() => toggleColumn("date")}
                  />
                </label>
              </li>
              <li>
                <label class="label cursor-pointer">
                  <span class="label-text">Event</span>
                  <input
                    type="checkbox"
                    class="toggle toggle-sm"
                    checked={visibleColumns.event}
                    onchange={() => toggleColumn("event")}
                  />
                </label>
              </li>
              <li>
                <label class="label cursor-pointer">
                  <span class="label-text">Player and Partner</span>
                  <input
                    type="checkbox"
                    class="toggle toggle-sm"
                    checked={visibleColumns.playerAndPartner}
                    onchange={() => toggleColumn("playerAndPartner")}
                  />
                </label>
              </li>
              <li>
                <label class="label cursor-pointer">
                  <span class="label-text">Opponent</span>
                  <input
                    type="checkbox"
                    class="toggle toggle-sm"
                    checked={visibleColumns.opponent}
                    onchange={() => toggleColumn("opponent")}
                  />
                </label>
              </li>
              <li>
                <label class="label cursor-pointer">
                  <span class="label-text">Score</span>
                  <input
                    type="checkbox"
                    class="toggle toggle-sm"
                    checked={visibleColumns.score}
                    onchange={() => toggleColumn("score")}
                  />
                </label>
              </li>
              <li>
                <label class="label cursor-pointer">
                  <span class="label-text">Result</span>
                  <input
                    type="checkbox"
                    class="toggle toggle-sm"
                    checked={visibleColumns.result}
                    onchange={() => toggleColumn("result")}
                  />
                </label>
              </li>
            </ul>
          </div>
        </div>
        <p>Location: {player.shortAddress}</p>
        <p>Doubles DUPR: {player.ratings.doubles}</p>

        {#if playerHistory}
          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  {#if visibleColumns.date}
                    <th>Date</th>
                  {/if}
                  {#if visibleColumns.event}
                    <th>Event</th>
                  {/if}
                  {#if visibleColumns.playerAndPartner}
                    <th class="min-w-[25ch]">Player and Partner</th>
                  {/if}
                  {#if visibleColumns.opponent}
                    <th class="min-w-[25ch]">Opponent</th>
                  {/if}
                  {#if visibleColumns.score}
                    <th>Score</th>
                  {/if}
                  {#if visibleColumns.result}
                    <th>Result</th>
                  {/if}
                </tr>
              </thead>
              <tbody>
                {#each playerHistory as match}
                  {#if match.teams && match.teams.length > 0}
                    {@const playerTeam = match.teams.find(
                      (team: ApiMatchTeam) =>
                        team.player1.id === player?.id ||
                        team.player2.id === player?.id,
                    )}
                    {@const opponentTeam = match.teams.find(
                      (team: ApiMatchTeam) => team !== playerTeam,
                    )}
                    <tr>
                      {#if visibleColumns.date}
                        <td>{new Date(match.eventDate).toLocaleDateString()}</td
                        >
                      {/if}
                      {#if visibleColumns.event}
                        <td>
                          <div class="truncate">
                            {match.eventName.slice(0, 20)}
                          </div>
                          <div class="text-sm opacity-70">{match.venue}</div>
                        </td>
                      {/if}
                      {#if visibleColumns.playerAndPartner}
                        <td>
                          {#if playerTeam}
                            {@html playerTeam.player1.id === player?.id
                              ? `${playerTeam.player1.fullName} <span class="opacity-70">(${playerTeam.player1.postMatchRating.doubles})</span>`
                              : `${playerTeam.player2.fullName} <span class="opacity-70">(${playerTeam.player2.postMatchRating.doubles})</span>`}
                            <br />
                            {@html playerTeam.player1.id === player?.id
                              ? `${playerTeam.player2.fullName} <span class="opacity-70">(${playerTeam.player2.postMatchRating.doubles})</span>`
                              : `${playerTeam.player1.fullName} <span class="opacity-70">(${playerTeam.player1.postMatchRating.doubles})</span>`}
                          {/if}
                        </td>
                      {/if}
                      {#if visibleColumns.opponent}
                        <td>
                          {#if opponentTeam}
                            {@html `${opponentTeam.player1.fullName} <span class="opacity-70">(${opponentTeam.player1.postMatchRating.doubles})</span>`}
                            <br />
                            {@html `${opponentTeam.player2.fullName} <span class="opacity-70">(${opponentTeam.player2.postMatchRating.doubles})</span>`}
                          {/if}
                        </td>
                      {/if}
                      {#if visibleColumns.score}
                        <td>
                          {#if playerTeam}
                            {playerTeam.game1}-{opponentTeam?.game1}
                            {#if playerTeam.game2 !== undefined && playerTeam.game2 !== -1}
                              <br />
                              {playerTeam.game2}-{opponentTeam?.game2}
                            {/if}
                            {#if playerTeam.game3 !== undefined && playerTeam.game3 !== -1}
                              <br />
                              {playerTeam.game3}-{opponentTeam?.game3}
                            {/if}
                          {/if}
                        </td>
                      {/if}
                      {#if visibleColumns.result}
                        <td>
                          {#if playerTeam}
                            <span
                              class="badge {playerTeam.winner
                                ? 'badge-success'
                                : 'badge-error'}"
                            >
                              {playerTeam.winner ? "W" : "L"}
                            </span>
                          {/if}
                        </td>
                      {/if}
                    </tr>
                  {/if}
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .flow > * + * {
    margin-top: 1em;
  }
</style>
