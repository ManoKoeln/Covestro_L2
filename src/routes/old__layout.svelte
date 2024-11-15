<!-- src/routes/__layout.svelte -->
<script lang="ts">
    import '../global.css';
    import '../app.css';
	let { children } = $props();
	import Header from '$lib/+header.svelte';
	import Footer from '$lib/+footer.svelte';
  </script>
  
  <!-- <slot /> -->
  <Header />
  <main>
  {@render children()}
  </main>
  <Footer />
  <style>
      main {
          height: 80vh;
      }
      </style>