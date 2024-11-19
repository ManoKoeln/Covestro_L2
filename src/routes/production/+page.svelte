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
  let showCameraPopup = false;
  let userInput = '';
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
        // console.log(products); // Debugging: Log the products to the console
      } catch (err) {
        error = (err as Error).message;
        console.error(err + "production"+"onMount"); // Debugging: Log the error to the console
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
    // Abrufen des Zustands aus dem LocalStorage
    const storedShowCameraPopup = localStorage.getItem('showCameraPopup');
    const storedUserInput = localStorage.getItem('userInput');

    if (storedShowCameraPopup) {
      showCameraPopup = JSON.parse(storedShowCameraPopup);
    }

    if (storedUserInput) {
      userInput = storedUserInput;
    }

    const video = document.getElementById('video') as HTMLVideoElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
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
    if (selectedProduct?.Fertigungsnummer.length !== 7) {
      const errorTextElement = document.getElementById('Fehlertext');
      if (errorTextElement) {
        errorTextElement.style.display = 'block';
        setTimeout(() => {
          errorTextElement.style.display = 'none';
        }, 3000);
      }
      // alert('Fertigungsnummer must be 7 characters long.');
      return;
    }
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
    showCameraPopup = false;
  }
  // function showcamera (camera: number) {
  //   console.log("Kamera Nr",camera);
  // }
  function showcamera() {
    showCameraPopup = true;
  }

  function closeCameraPopup() {
    showCameraPopup = false;
    // Speichern des Zustands im LocalStorage
    localStorage.setItem('showCameraPopup', JSON.stringify(showCameraPopup));
    localStorage.setItem('userInput', userInput);
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
    console.log('Production Drag started for', product);
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (data) {
      const product = JSON.parse(data) as ProdData;
      const cellSize = 20; // Size of each cell
      const row = Math.floor(event.offsetY / cellSize);
      const column = Math.floor(event.offsetX / cellSize);
      console.log("production handleDrop",row, column);
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
  function validateFertigungsnummer(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/\D/g, ''); // Remove non-digit characters
        if (value.length > 7) {
          input.value = value.slice(0, 7); // Ensure only up to 7 digits
        }
        if (selectedProduct) {
          selectedProduct.Fertigungsnummer = input.value;
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
<!-- <div class="grid-container"> -->
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
        <table>
          <tbody>
            <tr>
              <td>Gruppe:</td>
              <td><input type="text" style="border :unset;"value={selectedProduct.Group} disabled></td>              
            </tr>
            <tr>
              <td>Ort:</td>
              <td><input type="text" style="border :unset;" value={selectedProduct.Place} disabled></td>  
            </tr>
            <tr>
              <td>Row:</td>
              <td>
                <input type="text" bind:value={selectedProduct.row} bind:this={inputElement} on:input={handlerow} />
              </td>
            </tr>
            <tr>
              <td>Column:</td>
              <td>
                <input type="text" bind:value={selectedProduct.column} bind:this={inputElement} on:input={handlecolumn} />
              </td>
            </tr>
            <tr>
              <td>Fertigungsnummer:</td>
              <td>
                <!-- <input type="text" bind:value={selectedProduct.Fertigungsnummer} bind:this={inputElement} on:input={handleInput} /> -->
                <input type="number" placeholder="Fertigungsnummer" bind:value={selectedProduct.Fertigungsnummer} bind:this={inputElement}  style="width: 100%; margin-top: 10px;" on:input={validateFertigungsnummer} />
              </td>
            </tr>
          </tbody>
        </table>
        <p id= "Fehlertext" style="color: red; display: none;">Die Fertigungsnummer muss 7 - stellig sein</p>
      </DialogDescription>
      <DialogFooter>
        
        <Button class="button" on:click={saveChanges}>Save Changes</Button>
        
        {#if Number(selectedProduct.camera) > 0}
        <!-- <Button class="button" on:click={() => selectedProduct && showcamera(selectedProduct.camera)}> -->
          <Button class="button" on:click={showcamera}>
          Camera {Number(selectedProduct.camera)}
        </Button>

       {/if}  
      </DialogFooter>
    </DialogContent>
  </Dialog>
<!-- </div> -->
{/if}

{#if showCameraPopup}
<Dialog bind:open={showCameraPopup} on:close={closeCameraPopup} >
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        <div style="display: flex; align-items: center;">
          <img class="h-8 w-8" src="/src/img/etteplan-electric-blue-vertical-rgb (3).png" alt="Your Company">
          <span>&nbsp;&nbsp;&nbsp;</span>
          <p>Kamera {Number(selectedProduct?.camera)}</p>
      </div>
    </DialogTitle>
      <DialogClose on:click={closeCameraPopup} />
    </DialogHeader>
    <DialogDescription>

        <!-- <iframe class="w-full aspect-video hover:aspect-square" src="/src/img/mobile1.mp4" title="Dreambroker Video" ></iframe> -->
        <iframe class="w-full aspect-video hover:aspect-square" src="/src/img/{selectedProduct?.CameraAdress}" title="Dreambroker Video" ></iframe>
    </DialogDescription>
    <DialogFooter>
  <div style="display: flex; align-items: center;">
  {#if selectedProduct}
    <input type="number" placeholder="Fertigungsnummer" bind:value={selectedProduct.Fertigungsnummer} style="width: 100%; margin-top: 10px;" on:input={validateFertigungsnummer} />

  {/if}
  <span>&nbsp;&nbsp;&nbsp;</span>
 <Button class="button" on:click={saveChanges}>Save</Button>
  </div>
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
   border-right:  blue;
  }
  
  .green {
    background-color: green;
  }
  

  
  .hover-info {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    border-radius: 3px;
    pointer-events: none;
    z-index: 1000;
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .camera-container {
    
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: flex-start;
    height: 80vh;
    width: 80vw;
  }

  video {
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  input {
    padding: 10px;
    font-size: 16px;
  }

  a {
    color: blue;
    text-decoration: underline;
  }
  iframe {
    width: 100%;
    /* height: 100%; */
  }
</style>
