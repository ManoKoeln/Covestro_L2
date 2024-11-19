<script lang="ts">
    import { onMount } from 'svelte';
    import type { UserData } from '@/types/+types';
    import { Button } from '$lib/components/ui/button';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "$lib/components/ui/dialog";

    let Users: UserData[] = [];
    let error: string | null = null;
    let showModal: boolean = false;
    let activeUser: number = 0;
    let inputElement: HTMLInputElement | null = null;
  
    onMount(async () => {
      try {
        const response = await fetch('/api/Users');
        if (!response.ok) {
          throw new Error(`Error fetching Users: ${response.statusText}`);
        }
        Users = await response.json();
        console.log(Users); // Debugging: Log the Users to the console
        showModal = true;
      } catch (err) {
        error = (err as Error).message;
        console.error(err); // Debugging: Log the error to the console
      }

    });
    import { onDestroy } from 'svelte';

    let interval: NodeJS.Timeout;

    // onMount(() => {
    //   interval = setInterval(async () => {
    //     try {
    //       const response = await fetch('/api/Users');
    //       if (!response.ok) {
    //         throw new Error(`Error fetching Users: ${response.statusText}`);
    //       }
    //       Users = await response.json();
    //       console.log(Users); // Debugging: Log the Users to the console
    //     } catch (err) {
    //       error = (err as Error).message;
    //       console.error(err); // Debugging: Log the error to the console
    //     }
    //   }, 1000);

    //   return () => clearInterval(interval);
    // });

    onDestroy(() => {
      clearInterval(interval);
    });
    
    function closePopup() {
      showModal = false;

  }
  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (Users) {
      Users[activeUser].Name = input.value;
    }
  }

  function handlepassword(event: Event) {
    const input = event.target as HTMLInputElement;
    if (Users[activeUser].Password) {
      Users[activeUser].Password = input.value;
    }
  }
  async function saveChanges() {
    if (Users) {
      try {
        const response = await fetch(`/api/Users/${Users[activeUser].ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Users[activeUser])
        });
        if (!response.ok) {
          throw new Error(`Error saving product: ${response.statusText}`);
        }
        console.log('Changes saved for', Users[activeUser].Name);
      } catch (err) {
        console.log('Failed to save changes:', err);
        // console.error('Failed to save changes:', err);
      }
    }
    closePopup();
  }

  </script>
  <!-- <button on:click={() => showModal = true}>Show Users</button> -->

  {#if showModal}
    <div class="modal">
      <div class="modal-content">
        <button type="button" class="close" on:click={() => showModal = false} aria-label="Close">&times;</button>
        {#if error}
          <p class="error">{error}</p>
        {/if}
        <Dialog bind:open={showModal} on:close={closePopup}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <div style="display: flex; align-items: center;">
                  <img class="h-8 w-8" src="/src/img/etteplan-electric-blue-vertical-rgb (3).png" alt="Your Company">
                  <span>&nbsp;&nbsp;&nbsp;</span>
                  <p>Psswort ändern</p>
              </div>
            </DialogTitle>
              <DialogClose on:click={closePopup} />
            </DialogHeader>
            <DialogDescription>
              <p>Name: {Users[activeUser].Name}</p>
              <p>Rolle: {Users[activeUser].Role}</p>
              <!-- <p>Row: {selectedProduct.row}</p> -->
              <div style="display: flex; align-items: center;">
                <p>Passwort: </p>
                <input type="text" bind:value={Users[activeUser].Password} bind:this={inputElement} on:input={handlepassword} />
              </div>

      
            </DialogDescription>
            <DialogFooter>
              <Button class="button" on:click={saveChanges}>Save Changes</Button>
              {#if Number(Users[activeUser].Role) == 5}
              <!-- <Button class="button" on:click={() => selectedProduct && showcamera(selectedProduct.camera)}>
                Camera {Number(selectedProduct.camera)}
                 
              </Button> -->
              <p>Admin Active</p>
             {/if}  
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <!-- <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Passwort</th>
              <th>Rolle</th>
            </tr>
          </thead>
          <tbody>
            {#each Users as UserData}
              <tr>
                <td>{UserData.ID}</td>
                <td>{UserData.Name}</td>
                <td>{UserData.Password}</td>
                <td>{UserData.Role}</td>            
              </tr>
            {/each}
          </tbody>
        </table> -->


      </div>
    </div>
  {/if}

  <style>
    .modal {
      display: block;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgb(0,0,0);
      background-color: rgba(0,0,0,0.4);
    }

    .modal-content {
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
    }

    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  </style>
  <!-- <div class="max-h-full">
    {#if error}
      <p class="error">{error}</p>
    {/if}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Passwort</th>
          <th>Rolle</th>
        </tr>
      </thead>
      <tbody>
        {#each Users as UserData}
          <tr>
            <td>{UserData.ID}</td>
            <td>{UserData.Name}</td>
            <td>{UserData.Password}</td>
            <td>{UserData.Role}</td>            
          </tr>
        {/each}
      </tbody>
    </table>
  </div> -->