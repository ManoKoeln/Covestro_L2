<!-- <h1 class="text-3xl font-bold underline">Test my-app2</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->
<!--
  This example requires updating your template:

  ```
  <html class="h-full bg-gray-100">
  <body class="h-full">
  ```
-->
<!-- <html class="h-full bg-gray-100"> -->
    <!-- <body class="h-full"> -->
        <script lang="ts">
            import * as Carousel from "$lib/components/ui/carousel/index.js";
            import type { PageData } from "@/types/+types";
            //export let data: PageData;

            import '../styles/global.css';
          </script>

<div class="max-h-full">



    <!-- <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">ETTEPLAN</h1>
      </div>
    </header> -->
    <main>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <!-- <pre>
          <code>{JSON.stringify(data.tracks,null,2)}</code>
        </pre>        -->
         <!-- Your content -->
        <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item><img class="h-full w-full" src="/src/img/GettyImages-1266865934.jpg" alt="Carousel Image 1" /></Carousel.Item>
                <Carousel.Item><img class="h-full w-full" src="/src/img/Banner-eLearning-CoC.jpg" alt="Carousel Image 2" /></Carousel.Item>
                <Carousel.Item><img class="h-full w-full" src="/src/img/Processes.jpg" alt="Carousel Image 3" /></Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous />
            <Carousel.Next />
          </Carousel.Root>
      </div>
    </main>

  </div>
  