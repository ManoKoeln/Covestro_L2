<script lang="ts">
    import { onMount } from 'svelte';
    import type { Track } from '../../types';
    import Header from "$lib/+header.svelte";
    import Footer from "$lib/+footer.svelte";
    let tracks: Track[] = [];
    let error: string | null = null;
  
    onMount(async () => {
      try {
        const response = await fetch('/api/tracks');
        if (!response.ok) {
          throw new Error(`Error fetching tracks: ${response.statusText}`);
        }
        tracks = await response.json();
        console.log(tracks); // Debugging: Log the tracks to the console
      } catch (err) {
        error = err.message;
        console.error(err); // Debugging: Log the error to the console
      }
    });
  </script>
  
  <div class="max-h-full">
    <Header />
    {#if error}
      <p class="error">{error}</p>
    {/if}
    <table>
      <thead>
        <tr>
          <th>Track ID</th>
          <th>Track Name</th>
          <th>Album ID</th>
          <th>Album Title</th>
          <th>Artist ID</th>
          <th>Artist Name</th>
          <th>Genre</th>
        </tr>
      </thead>
      <tbody>
        {#each tracks as track}
          <tr>
            <td>{track.TrackId}</td>
            <td>{track.trackname}</td>
            <td>{track.albumId}</td>
            <td>{track.albumTitel}</td>
            <td>{track.artistID}</td>
            <td>{track.artistName}</td>
            <td>{track.genre}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <Footer />
  </div>