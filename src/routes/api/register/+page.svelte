<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { UserData } from '$lib/types/+types';
  

  let tregister: UserData;// = { Name: '', Password: '' },ID = ' ', Role = ' '};  
  let registerError = '';
  // tregister.Name = ' ';
  // tregister.Password = ' ';



    async function register() {
console.log('Test');
      }
    
    // import { writable } from 'svelte/store';




</script>

<main>
   
  <h1>Register</h1>
  <form on:submit|preventDefault={register}>
    <!-- <div>
      <label for="registerName">Name</label>   
      <input type="text" id="registerName" bind:value={tregister.Name} required />
    </div>
    <div>
      <label for="registerPassword">Password</label>

      <input type="password" id="registerPassword" bind:value={tregister.Password} required />
    </div>
    {#if registerError}
      <p class="error">{registerError}</p>
    {/if} -->
    <button type="submit">Register</button>
  </form>
</main>



  <style>
    .error {
      color: red;
    }
  </style>