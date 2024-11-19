<script lang="ts">

    
    import * as Resizable from "$lib/components/ui/resizable";

  </script>

<h1 class="text-3xl font-bold tracking-tight text-white text-center bg-cyan-600">ETTEPLAN Projekte</h1>

   <div class="mx-auto max-w-7xl px-6 py-6 sm:px-6 lg:px-8">
    <Resizable.PaneGroup direction="horizontal">
        <Resizable.Pane class="h-full w-full"><div class="text-center">Covestro</div><img  src="/src/img/Covestro.jpg" alt="covestro Image 1" /></Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane><div class="text-center">Gerflor Retroofit S5 >> TIA Unified</div><img class="h-full w-full" src="/src/img/gerflor.jpg" alt="gerflor Image 1" /></Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane><div class="text-center">Metso</div><img class="h-full w-full" src="/src/img/Metso.jpg" alt="metso Image 1" /></Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane><div class="text-center">Shell</div><img class="h-full w-full" src="/src/img/shell.jpg" alt="shell Image 1" /></Resizable.Pane>
      </Resizable.PaneGroup>

    </div>
