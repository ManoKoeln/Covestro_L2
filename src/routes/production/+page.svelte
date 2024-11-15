<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ProdData } from '$lib/types/+types';
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

  const GRID_ROWS = 38;
  const GRID_COLUMNS = 80;

  let products: ProdData[] = [];
  let error: string | null = null;
  let selectedProduct: ProdData | null = null;;
  let hoverInfo: HTMLElement | null = null;
  let gridElement: HTMLElement | null = null;
  let inputElement: HTMLInputElement | null = null;
  let l_DialogOpen: boolean = false;
  let a: number | null = null;

  let interval: NodeJS.Timeout;

  onMount(() => {
    document.documentElement.style.setProperty('--grid-rows', GRID_ROWS.toString());
    document.documentElement.style.setProperty('--grid-columns', GRID_COLUMNS.toString());
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

    hoverInfo = document.querySelector('.hover-info');
    gridElement = document.querySelector('.grid');

    if (gridElement && hoverInfo) {
      gridElement.addEventListener('mousemove', (event) => {
        const cellSize = 20; // Size of each cell
        const row = Math.floor(event.offsetY / cellSize);
        const column = Math.floor(event.offsetX / cellSize);

        if (hoverInfo) {
          hoverInfo.style.display = 'block';
        }
        if (hoverInfo) {
          hoverInfo.style.left = `${event.pageX + 10}px`;
        }
        if (hoverInfo) {
          hoverInfo.style.top = `${event.pageY + 10}px`;
        }
        if (hoverInfo) {
          hoverInfo.textContent = `Row: ${row}, Column: ${column}`;
        }
      });

      gridElement.addEventListener('mouseleave', () => {
        if (hoverInfo) {
          hoverInfo.style.display = 'none';
        }
      });

      gridElement.addEventListener('click', (event) => {
        const cellSize = 20; // Size of each cell
        const row = Math.floor(event.offsetY / cellSize);
        const column = Math.floor(event.offsetX / cellSize);
        console.log(`Clicked on cell at Row: ${row}, Column: ${column}`);
      });
    }
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  function showPopup(index: number) {
    const product = products.find(p => p.row * GRID_COLUMNS + p.column === index && Number(p.Fertigungsnummer) > 0);
    if (product) {
      selectedProduct = product;
      a = index % GRID_COLUMNS; // Berechnung des Rests von i durch 100
      l_DialogOpen = true;
    }
  }

  function closePopup() {
    selectedProduct = null;
    l_DialogOpen = false;
  }

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
  function showcamera (camera: number) {
    console.log(camera);
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
      selectedProduct.row = Number(input.value);
    }
  }
  function handlecolumn(event: Event) {
    const input = event.target as HTMLInputElement;
    if (selectedProduct) {
      selectedProduct.column = Number(input.value);
    }
  }



  function handleDragStart(event: DragEvent, product: ProdData) {
    event.dataTransfer?.setData('text/plain', JSON.stringify(product));
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (data) {
      const product = JSON.parse(data) as ProdData;
      const cellSize = 20; // Size of each cell
      const row = Math.floor(event.offsetY / cellSize);
      const column = Math.floor(event.offsetX / cellSize);

      // Update product row and column
      product.row = row;
      product.column = column;

      // Save changes to the database
      saveProductPosition(product);
    }
  }

  async function saveProductPosition(product: ProdData) {
    try {
      const response = await fetch(`/api/products/${product.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
      if (!response.ok) {
        throw new Error(`Error saving product position: ${response.statusText}`);
      }
      console.log('Product position saved for', product);
    } catch (err) {
      console.log('Failed to save product position:', err);
    }
  }
</script>


<div class="container 2xl">
  <div class="grid-container">
    <!-- <div class="grid grid-cols-60" role="grid" tabindex="0" on:drop={handleDrop} on:dragover={(event) => event.preventDefault()} style="grid-template-columns: repeat({GRID_COLUMNS}, 1fr); grid-template-rows: repeat({GRID_ROWS}, 1fr);"> -->
      <div class="grid grid-cols-60" role="grid" tabindex="0" on:drop={handleDrop} on:dragover={(event) => event.preventDefault()} >
      <div class="hover-info" style="position: absolute; display: none;"></div>
      {#each products as product}
        {#if Number(product.Fertigungsnummer) > 0}
          <button
            type="button"
            class="cell green"
            style="grid-row: {product.row + 1}; grid-column: {product.column + 1};"
            draggable="true"
            on:dragstart={(event) => handleDragStart(event, product)}

            on:click={() => showPopup(product.row * GRID_COLUMNS + product.column)}
            on:keydown={(e) => e.key === 'Enter' && showPopup(product.row * GRID_COLUMNS + product.column)}
            aria-label="Show product details"
          ></button>

        {/if}
      {/each}
    </div>
  </div>
</div>
{#if selectedProduct}
  <Dialog bind:open={l_DialogOpen} on:close={closePopup}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <div style="display: flex; align-items: center;">
            <img class="h-8 w-8" src="/src/img/etteplan-electric-blue-vertical-rgb (3).png" alt="Your Company">
            <span>&nbsp;&nbsp;&nbsp;</span>
            <p>Product Details</p>
        </div>
      </DialogTitle>
        <DialogClose on:click={closePopup} />
      </DialogHeader>
      <DialogDescription>
        <p>Gruppe: {selectedProduct.Group}</p>
        <p>Ort: {selectedProduct.Place}</p>
        <!-- <p>Row: {selectedProduct.row}</p> -->
        <div style="display: flex; align-items: center;">
          <p>Row: </p>
          <input type="text" bind:value={selectedProduct.row} bind:this={inputElement} on:input={handlerow} />
        </div>
        <div style="display: flex; align-items: center;">
          <p>Column: </p>
          <input type="text" bind:value={selectedProduct.column} bind:this={inputElement} on:input={handlecolumn} />
        </div>
        <div style="display: flex; align-items: center;">
          <p>Fertigungsnummer: </p>
          <input type="text" bind:value={selectedProduct.Fertigungsnummer} bind:this={inputElement} on:input={handleInput} />
        </div>

      </DialogDescription>
      <DialogFooter>
        <Button class="button" on:click={saveChanges}>Save Changes</Button>
        {#if Number(selectedProduct.camera) > 0}
        <Button class="button" on:click={() => selectedProduct && showcamera(selectedProduct.camera)}>
          Camera {Number(selectedProduct.camera)}
        </Button>

       {/if}  
      </DialogFooter>
    </DialogContent>
  </Dialog>
{/if}



<style>
  /* src/routes/+page.svelte.css */


  
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), 20px);
    grid-template-rows: repeat(var(--grid-rows), 20px);
    gap: 0px;
    background-image: url('/src/img/L2EG.jpg');
    background-size: 100% 100%;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
  }
  
  .grid-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
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
  Dialog{
    background: none;
  }
</style>
