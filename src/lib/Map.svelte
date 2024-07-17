<script lang="js">
  import { onDestroy, onMount, setContext } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css'

  // Basic variables
  let map;
  let mapElement;

  // Component variables
  export let bounds = undefined;
  export let view = undefined;
  export let zoom = undefined;

  // When the application starts
  onMount(() => {
    // If no bounds / view / zoom defined then throw an error
    if (!bounds && (!view || !zoom)) {
      throw new Error('No bounds or view/zoom defined')
    }
    // init the map
    map = L.map(mapElement);
    // add a credit title as a tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:  `&copy;<a href="https://www.openstreetmap.org/copyright"`
    }).addTo(map);
  });

  // When the component is destroyed
  onDestroy(() => {
    map?.remove();
    map = undefined;
  })

  // Set getMap function as e getter for the map
  setContext('map', {
    getMap: () => map
  });

  // Set initial map view
  $: if(map) {
    // fit bounds & view
    if (bounds) {
      map.fitBounds(bounds);
    } else if (view && zoom) {
      map.setView(view, zoom);
    }
  }
</script>

<div class="w-full h-screen" bind:this={mapElement}>
  {#if map}
    <slot />
  {/if}
</div>