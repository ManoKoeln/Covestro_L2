<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { UserData } from '$lib/types/+types';
  
    let name = '';
    let password = '';
    let error = '';
  let tregister : UserData;
  let registerError = '';


    async function login() {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Anmeldeinformationen sind korrekt
        console.log('Login successful', result);
        // Weiterleitung oder andere Aktionen
        goto('/dashboard');
      } else {
        // Fehlerbehandlung
        error = result.error;
      }
    }


    import { writable } from 'svelte/store';
    import RegisterPopup from '../register/+page.svelte';

let showRegisterPopup = writable(false);

import { mount } from 'svelte';

function openRegisterPopup() {

    mount(RegisterPopup, {
        target: document.body,
    //     props: {
    //          show: showRegisterPopup.set(true),
    //     }
    });
}


</script>


  <main>
    <h1>Login</h1>
    <form on:submit|preventDefault={login}>
      <div>
        <label for="name">Name</label>
        <input type="text" id="name" bind:value={name} required />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password} required />
        
      </div>
      {#if error}
        <p class="error">{error}</p>
      {/if}
      <button type="submit">Login</button>
      
    </form>
    <button on:click={openRegisterPopup}>registrieren</button>
  </main>

  <style>
    .error {
      color: red;
    }
  </style>