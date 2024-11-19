<script lang="ts">

import { onMount, onDestroy } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import type { UserData } from './types/+types';  
  import { globalActiveUser } from  '../stores' // Importieren des Stores

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



let LogInPopupActive = true;
let tUserData: UserData = { ID: 0, Name: '', Password: '' , Role: '0'};
let showImagesPopup = false;

function toggleImagesPopup() {
    showImagesPopup = !showImagesPopup;
  }
function showLogin ()
{
  LogInPopupActive = true;
  console.log('showLogin');
}
function closeLoginPopup ()
{
  LogInPopupActive = false;
}

async function savePassword() {
    if (LogInPopupActive) {
      try {
        const response = await fetch(`/api/UserReq/${tUserData.Name}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tUserData)
        });
        if (!response.ok) {
          throw new Error(`Error saving product: ${response.statusText}`);
        }
        console.log('Changes saved for', tUserData);
      } catch (err) {
        console.log('Failed to save changes:', err);
        // console.error('Failed to save changes:', err);
      }
    }
    closeLoginPopup();
  }
  function UserLogOut()
  {
    globalActiveUser.set(0);
    closeLoginPopup();
  }

  async function comparePassword() {
    try {
      const response = await fetch(`/api/UserReq?Name=${tUserData.Name}`);
      // const response = await fetch(`/api/Users?Name=${tUserData.Name}&Password=${tUserData.Password}`);
      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.statusText}`);
      }
      const user = await response.json();
      if (tUserData.Password && user.Password) {
        globalActiveUser.set(user.Role);
        console.log('Login successful');
        closeLoginPopup();
      } else {
        console.log('Invalid username or password' + ' User = ' + tUserData.Name + ' PW = ' + tUserData.Password + ' userPW = ' + user.Password);
      }
    } catch (err) {
      console.log('Failed to compare password:', err);
    }
    
  }

 
</script>


<header>
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="shrink-0">
              <img class="h-8 w-25" src="/src/img/etteplan-electric-blue-horizontal-rgb (3).png" alt="Your Company">
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <a href="../" class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">ETTEPLAN</a>
                <!-- <a href="/Team" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a> -->
                <!-- <a href="/projects" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a> -->
                <a href="/calender" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
                <!-- <a href="/reports" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Reports</a> -->
                <a href="/api/tracks" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Tracks</a>
                <a href="/production" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Production</a>
                <a href="/api/products" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Produkte</a>
                <!-- FormLayouts -->
                <!-- <a href="/FormLayouts" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">FormLayouts</a> -->
                {#if $globalActiveUser == 0}
                <Button on:click={toggleImagesPopup}>Anmelden</Button>
                {:else}
                <Button on:click={toggleImagesPopup}>Abmelden</Button>
                {/if}
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <button type="button" on:click={showLogin} class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">View notifications</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
              </button>
  
              <!-- Profile dropdown -->
              <div class="relative ml-3">
                <div>
                    
                    <button type="button" on:click={showLogin} class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <span class="absolute -inset-1.5"></span>
                    <span class="sr-only">Open user menu</span>
                    <img class="h-12 w-12 " src="/src/img/etteplan-electric-blue-vertical-rgb (3).png" alt="Etteplan">
                  </button>
                </div>
  
                
                  <!-- Dropdown menu, show/hide based on menu state.
  
                  Entering: "transition ease-out duration-100"
                    From: "transform opacity-0 scale-95"
                    To: "transform opacity-100 scale-100"
                  Leaving: "transition ease-in duration-75"
                    From: "transform opacity-100 scale-100"
                    To: "transform opacity-0 scale-95" -->
               
                     <!-- Active: "bg-gray-100 outline-none", Not Active: "" -->
                <div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                 
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a>
                  <a href="/api/Users" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Passwort ändern</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>
                </div>
              </div>
            </div>
          </div>
          <div class="-mr-2 flex md:hidden">
            <!-- Mobile menu button -->
            <button type="button" class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" aria-controls="mobile-menu" aria-expanded="false">
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Open main menu</span>
              <!-- Menu open: "hidden", Menu closed: "block" -->
              <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <!-- Menu open: "block", Menu closed: "hidden" -->
              <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="md:hidden" id="mobile-menu">
        <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
          <a href="./" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">ETTEPLAN</a>
          <!-- <a href="/Team" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a> -->
          <!-- <a href="/projects" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a> -->
          <a href="/calender" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
          <!-- <a href="/reports" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Reports</a> -->
          <a href="/api/tracks" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Tracks</a>
          <a href="/production" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Production</a>
          <a href="/api/products" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Produkte</a>
           <!-- FormLayouts -->
           <!-- <a href="/FormLayouts" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">FormLayouts</a> -->
        </div>
        <div class="border-t border-gray-700 pb-3 pt-4">
          <div class="flex items-center px-5">
            <div class="shrink-0">
              <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
            </div>
            <div class="ml-3">
              <div class="text-base/5 font-medium text-white">Tom Cook</div>
              <div class="text-sm font-medium text-gray-400">tom@example.com</div>
            </div>
            <button type="button" on:click={showLogin} class="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">View notifications</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </button>
          </div>
          <!-- <div class="mt-3 space-y-1 px-2">
            <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Your Profile</a>
            <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Settings</a>
            <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Sign out</a>
          </div> -->
        </div>
      </div>
    </nav>
  </header>
  {#if showImagesPopup}

    <Dialog open={showImagesPopup} on:close={toggleImagesPopup}>
      {#if $globalActiveUser == 0}
      <DialogContent style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <DialogHeader>        
          <DialogTitle>Anmelden</DialogTitle>
          <DialogClose on:click={toggleImagesPopup} />
        </DialogHeader>
        <DialogDescription>
          <div class="images-container">
            <!-- Fügen Sie hier Ihre Bilder hinzu -->
            <!-- <p>eintrag 1</p> -->
            <label for="username">Username</label>
            <input id="username" type="text" bind:value={tUserData.Name} required />
            <!-- <p>eintrag 2</p> -->
            <label for="password">Password</label>
            <input id="password" type="password" bind:value={tUserData.Password} required />
            <!-- <img src="/path/to/image1.jpg" alt="Image 1" />
            <img src="/path/to/image2.jpg" alt="Image 2" /> -->
            <!-- Weitere Bilder -->
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button on:click={comparePassword}>Save</Button>
          <Button on:click={toggleImagesPopup}>Close</Button>
        </DialogFooter>
      </DialogContent>
      {:else}
      <DialogContent style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <DialogHeader>        
          <DialogTitle>Abmelden</DialogTitle>
          <DialogClose on:click={toggleImagesPopup} />
        </DialogHeader>
        <DialogDescription>
          <div class="images-container">
          <p>wollen sie sich abmelden?</p>
          <button on:click={UserLogOut}>Abmelden</button>

          </div>
        </DialogDescription>
        <DialogFooter>            
            <Button on:click={toggleImagesPopup}>Close</Button>
        </DialogFooter>
      </DialogContent>
      {/if}
    </Dialog>
{/if}

 
  <style>
    header {
height: 10vh;
    }
    .images-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .images-container p {
    max-width: 100%;
    margin: 10px 0;
  }
  </style>