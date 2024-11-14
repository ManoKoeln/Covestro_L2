<script lang="ts">

    import Header from "$lib/+header.svelte";
    import Footer from "$lib/+footer.svelte";
    import { getLocalTimeZone, today } from "@internationalized/date";
    import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
   
    const start = today(getLocalTimeZone());
    const end = start.add({ days: 7 });
   
    let value = {
      start,
      end
    };
  </script>
  <Header />
  <h1 class="text-3xl font-bold tracking-tight text-blue-500 text-center">ETTEPLAN Kalender</h1>

   <div class="mx-auto max-w-7xl px-6 py-6 sm:px-6 lg:px-8">

  <RangeCalendar bind:value class="rounded-md border" />
    </div>
  <Footer />