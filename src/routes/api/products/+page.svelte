<script lang="ts">
    import { onMount } from 'svelte';
    import type { ProdData } from '@/types/+types';
    import Header from "$lib/+header.svelte";
    import Footer from "$lib/+footer.svelte";
    let products: ProdData[] = [];
    let error: string | null = null;
  
    onMount(async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }
        products = await response.json();
        console.log(products); // Debugging: Log the products to the console
      } catch (err) {
        error = (err as Error).message;
        console.error(err); // Debugging: Log the error to the console
      }
    });
    import { onDestroy } from 'svelte';

    let interval: NodeJS.Timeout;

    onMount(() => {
      interval = setInterval(async () => {
        try {
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error(`Error fetching products: ${response.statusText}`);
          }
          products = await response.json();
          console.log(products); // Debugging: Log the products to the console
        } catch (err) {
          error = (err as Error).message;
          console.error(err); // Debugging: Log the error to the console
        }
      }, 1000);

      return () => clearInterval(interval);
    });

    onDestroy(() => {
      clearInterval(interval);
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
          <th>ID</th>
          <th>Fertigungsnummer</th>
          <th>Platz</th>
          <th>Gruppe</th>
          <th>Zeile</th>
          <th>Spalte</th>
        </tr>
      </thead>
      <tbody>
        {#each products as ProdData}
          <tr>
            <td>{ProdData.ID}</td>
            <td>{ProdData.Fertigungsnummer}</td>
            <td>{ProdData.Place}</td>
            <td>{ProdData.Group}</td>
            <td>{ProdData.row}</td>
            <td>{ProdData.column}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <Footer />
  </div>