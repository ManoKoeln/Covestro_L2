<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ProdData } from '@/types/+types';
  import Header from "$lib/+header.svelte";
  import Footer from "$lib/+footer.svelte";

  import {
    Button,
    buttonVariants
  } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";


  // import * as Dialog from "$lib/components/ui/dialog";
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

  let products: ProdData[] = [];
  let error: string | null = null;
  let selectedProduct: ProdData | null = null;

  let interval: NodeJS.Timeout;
  let hoverInfo: HTMLElement | null = null;
  let gridElement: HTMLElement | null = null;
  let inputElement: HTMLInputElement | null = null;
  let l_DialogOpen: boolean = false;
  let MyMeesage: boolean = false;
  let MyMeesageRow: number = 0;
  let MyMeesageColumn: number = 0;

  // onMount(async () => {
  //   try {
  //     const response = await fetch('/api/tracks');
  //     if (!response.ok) {
  //       throw new Error(`Error fetching tracks: ${response.statusText}`);
  //     }
  //     products = await response.json();
  //     console.log(products); // Debugging: Log the tracks to the console
  //   } catch (err) {
  //     error = (err as Error).message;
  //     console.error(err); // Debugging: Log the error to the console
  //   }
  // });



  onMount(() => {
    interval = setInterval(async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }
        products = await response.json();
        // console.log(products); // Debugging: Log the products to the console
      } catch (err) {
        error = (err as Error).message;
        console.error(err); // Debugging: Log the error to the console
      }
    }, 1000);

    return () => clearInterval(interval);
  });
  hoverInfo = document.querySelector('.hover-info');
    gridElement = document.querySelector('.grid');

    if (gridElement && hoverInfo) {
      // gridElement.addEventListener('mousemove', (event) => {
      //   const cellSize = 20; // Size of each cell
      //   const row = Math.floor(event.offsetY / cellSize);
      //   const column = Math.floor(event.offsetX / cellSize);

    //   //   hoverInfo.style.display = 'block';'
    //   //   hoverInfo.style.left = `${event.pageX + 10}px`;
    //   //   hoverInfo.style.top = `${event.pageY + 10}px`;
    //   //   hoverInfo.textContent = `Row: ${row}, Column: ${column}`;
    //   // });

    //   // gridElement.addEventListener('mouseleave', () => {
    //   //   hoverInfo.style.display = 'none';
    //   // });

      gridElement.addEventListener('click', (event) => {
        const cellSize = 20; // Size of each cell
        const row = Math.floor(event.offsetY / cellSize);
        const column = Math.floor(event.offsetX / cellSize);
        console.log(`Clicked on cell at Row: ${row}, Column: ${column}`);
      });
      
    };



    


  onDestroy(() => {
    clearInterval(interval);
  });

  function showPopup(index: number) {
    console.log('Showing popup for cell:', index);
    const product = products.find(p => p.row * 100 + p.column === index);
    if (product) {
      l_DialogOpen = true;
      selectedProduct = product;
    }
  }

  function closePopup() {
    selectedProduct = null;
    l_DialogOpen = false;
    MyMeesage = false;
  }

  // async function updateProduct(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   console.log('Updating product:', input.value);
  //   if (selectedProduct) {
  //     selectedProduct.Fertigungsnummer = input.value;
  //     try {
  //       const response = await fetch(`/api/products/${selectedProduct.ID}`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(selectedProduct)
  //       });
  //       if (!response.ok) {
  //         throw new Error(`Error saving product: ${response.statusText}`);
  //       }
  //       console.log('Changes update for', selectedProduct);
  //     } catch (err) {
  //       console.log('Failed to update changes:', err);
  //       // console.error('Failed to update changes:', err);
  //     }
  //   }
  // }

  async function saveChanges() {
    if (selectedProduct) {
      try {
        const response = await fetch(`/api/products/${selectedProduct.ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(selectedProduct)
        });
        if (!response.ok) {
          throw new Error(`Error saving product: ${response.statusText}`);
        }
        console.log('Changes saved for', selectedProduct);
      } catch (err) {
        console.log('Failed to save changes:', err);
        // console.error('Failed to save changes:', err);
      }
    }
    closePopup();
  }

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (selectedProduct) {
      selectedProduct.Fertigungsnummer = input.value;
    }
  }
  function handlerow(event: Event) {
    const input = event.target as HTMLInputElement;
    if (selectedProduct) {
      selectedProduct.Fertigungsnummer = input.value;
    }
  }
  function handlecolumn(event: Event) {
    const input = event.target as HTMLInputElement;
    if (selectedProduct) {
      selectedProduct.Fertigungsnummer = input.value;
    }
  }
  function showPosition( i: number) {
    MyMeesage = true;
    let row = Math.floor(i / 100);
    let column = i % 100;
    MyMeesageRow = row;
    MyMeesageColumn = column;
    console.log( 'row:', row, 'column:', column);
  }
</script>


<Header />
<div class="grid">
  <div class="hover-info" style="position: absolute; display: none;"></div>


  {#each Array(10000) as _, i}
    <button
      type="button"
      class="cell {products.find(p => p.row * 100 + p.column === i && Number(p.Fertigungsnummer) > 0) ? 'green' : ''}"
      on:click={() => products.find(p => p.row * 100 + p.column === i && Number(p.Fertigungsnummer) > 0) && showPopup(i)}
      on:keydown={(e) => e.key === 'Enter' && showPopup(i)}
      on:dblclick={() => showPosition(i)}
      
      aria-label="Show product details"
    ></button>
  {/each}
</div>

{#if selectedProduct}
  <!-- <button type="button" class="overlay" on:click={closePopup} on:keydown={(e) => e.key === 'Enter' && closePopup()} aria-label="Close overlay"></button> -->
  
  <Dialog bind:open={l_DialogOpen} on:close={closePopup}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
             <div style="display: flex; align-items: center;">
            <img class="h-8 w-8" src="/src/img/etteplan-electric-blue-vertical-rgb (3).png" alt="ETTEPLAN Germany" />
            <span style="margin-left: 8px;">Product Details</span>
            </div>

        </DialogTitle>
        <DialogClose on:click={closePopup} />
      </DialogHeader>
      <DialogDescription>
        <p>Row: {selectedProduct.row}</p>
        <input type="text" bind:value={selectedProduct.row} bind:this={inputElement} on:input={handlerow} />
        <p>Column: {selectedProduct.column}</p>
        <input type="text" bind:value={selectedProduct.column} bind:this={inputElement} on:input={handlecolumn} />
        <p>Fertigungsnummer: {selectedProduct.Fertigungsnummer}</p>
        <input type="text" bind:value={selectedProduct.Fertigungsnummer} bind:this={inputElement} on:input={handleInput} />
      </DialogDescription>
      <DialogFooter>
        <button on:click={saveChanges}>Save Changes</button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
{/if}
{#if MyMeesage}
  <!-- <button type="button" class="overlay" on:click={closePopup} on:keydown={(e) => e.key === 'Enter' && closePopup()} aria-label="Close overlay"></button> -->
  
  <Dialog bind:open={MyMeesage} on:close={closePopup}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
             <div style="display: flex; align-items: center;">
            <img class="h-8 w-8" src="/src/img/etteplan-electric-blue-vertical-rgb (3).png" alt="ETTEPLAN Germany" />
            <span style="margin-left: 8px;">Mausposition</span>
            </div>

        </DialogTitle>
        <DialogClose on:click={closePopup} />
      </DialogHeader>
      <DialogDescription>
        <p>Row: {MyMeesageRow}</p>
        <p>Column: {MyMeesageColumn}</p>

      </DialogDescription>
      <DialogFooter>
        <button on:click={closePopup}>Close</button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
{/if}
<Footer />
<style>
  .grid {
    background-image: -webkit-image-set(url(./src/img/L2EG.jpg) 1x, url(./src/img/L2EG.jpg) 2x);
    :global(body) {
    background-image: url('/src/img/L2EG.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    opacity: 100;

  }
    display: grid;
    grid-template-columns: repeat(100, 1fr);
    grid-template-rows: repeat(100, 1fr);
    gap: 1px;
    
  }
  .cell {
    width: 20px;
    height: 20px;
    /* border: 1px solid rgb(228, 227, 227); */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .green {
    background-color: green;
  }
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 1px solid black;
    padding: 20px;
    z-index: 1000;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(100, 1fr);
    grid-template-rows: repeat(100, 1fr);
    opacity: 100;
    gap: 1px;
  }
  .cell {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .green {
    background-color: green;
  }
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 1px solid black;
    padding: 20px;
    z-index: 1000;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  .hidden-border {
    border: none;
  }
  .hover-info {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    border-radius: 3px;
    pointer-events: none;
    z-index: 1000;
  }

</style>
