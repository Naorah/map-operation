<script>
  import '../app.css';
  import Map from '$lib/Map.svelte'
  import Marker from '$lib/Marker.svelte'
  import Icon from '@iconify/svelte';
  import ConfirmModal from '$lib/ConfirmModal.svelte';
  import UpdateModal from '$lib/UpdateModal.svelte';
    import Popup from '../lib/Popup.svelte';

  export let data;
  let selected_intervention = undefined

  /**
   * Format the date to display on the page
   * @param {Date} date - The date to format
   */
  function formatDate(date) {
    const d = new Date(date)
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  /**
   * Returns the border color based on the given status.
   * @param {string} status - The status used to determine the border color.
   * @returns {string} - The border color corresponding to the status.
   */
  function getBorderColor(status) {
    switch(status) {
      case 'À planifier':
        return 'orange';
      case 'En cours':
        return 'blue';
      case 'Réalisé':
        return 'green';
      default:
        return 'black';
    }
  }

  let selected_place;
  let loading = false;
  /**
   * Asynchronously selects a specific intervention for further actions or display.
   * @param {object} intervention - The intervention object to be selected.
   */
  async function selectIntervention(intervention) {
    loading = true;
    selected_intervention = intervention;
    selected_place = await geocodeAddress(selected_intervention.address);
    loading = false;
  }

  /**
   * Asynchronously geocodes an address to obtain its geographical coordinates.
   * @param {string} address - The address to be geocoded.
   */
	async function geocodeAddress(address) {
		address += " Strasbourg"
    const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}`);
    const geo_data = await response.json();
    let lat_lon;
    let found = false;
    if (geo_data && geo_data.features.length > 0) {
      for(let data_shard of geo_data.features) {
        if(data_shard.properties.city == 'Strasbourg' && !found) {
          lat_lon = data_shard.geometry.coordinates;
          let temp = lat_lon[0];
          lat_lon[0] = lat_lon[1];
          lat_lon[1] = temp;
          found = true;
        }
      }
      if(!found) {
        lat_lon = geo_data.features[0].geometry.coordinates;
        let temp = lat_lon[0];
        lat_lon[0] = lat_lon[1];
        lat_lon[1] = temp;
        found = true;
      }
			return lat_lon
    }
    return null;
  }

  /**
   * Asynchronously fetches a list of interventions.
   */
  async function fetchInterventions() {
    const response = await fetch('/api/interventions');
    if (response.ok) {
      let temp_data = await response.json();
      data = temp_data
    } else {
      console.error('Failed to fetch interventions');
    }
  }

  /**
   * Asynchronously deletes a specific intervention.
   * @param {object} intervention - The intervention object to be deleted.
   */
  async function delete_intervention(intervention) {
    let intervention_id = intervention.id;
    const response = await fetch(`/api/interventions/${intervention_id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Rafraîchir la liste des interventions après suppression
      await fetchInterventions();
      selected_intervention = undefined;
      selected_place = undefined;
    } else {
      console.error('Failed to delete intervention');
    }
  }

  /**
   * ################# UPDATE MODAL #####################
   */

  let showUpdateModal = false;
  let intervention_to_update = null;
  /**
   * Opens the update modal for a specific intervention.
   * @param {object} intervention - The intervention object to be updated.
   */
  function openUpdateModale(intervention) {
    intervention_to_update = intervention;
    showUpdateModal = true;
  }

  /**
   * Closes the update modal.
   */
  function closeUpdateModale() {
    intervention_to_update = null;
    showUpdateModal = false;
  }

  /**
   * Asynchronously handles the process when an element has been updated.
   */
  async function elementUpdated() {
    let last_intervention = selected_intervention;
    selected_intervention = undefined;
    await fetchInterventions();
    for(let inter of data.interventions) {
      if(inter.id === last_intervention.id) {
        selected_intervention = inter;
      }
    }
    closeUpdateModale();
  }

  /**
   * ################# DELETE MODAL #####################
   */
  let showDeleteModal = false;
  let intervention_to_delete = null;
  /**
   * Opens the delete confirmation modal for a specific intervention.
   * @param {object} intervention - The intervention object to be deleted.
   */
  function openDeleteModal(intervention) {
    intervention_to_delete = intervention
    showDeleteModal = true;
  }
  /**
   * Closes the delete confirmation modal.
   */
  function closeDeleteModal() {
    intervention_to_delete = null
    showDeleteModal = false;
  }

  /**
   * Handles the acceptance action. This function is called when the user accepts a certain action.
   */
  function handleAccept() {
    delete_intervention(intervention_to_delete);
    intervention_to_delete = null;
    showDeleteModal = false;
  }

  /**
   * ################### CHANGE STATUS ########################
   */

  /**
   * Asynchronously changes the status to the specified new status.
   * @param {string} new_status - The new status to be set.
   */
  async function changeStatus(new_status) {
    const response = await fetch(`/api/interventions/${selected_intervention.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: selected_intervention.address, date: new Date(selected_intervention.date), description: selected_intervention.description, status: new_status, type: selected_intervention.type }),
    });

    if (response.ok) {
      let last_intervention = selected_intervention;
      selected_intervention = undefined;
      await fetchInterventions();
      for(let inter of data.interventions) {
        if(inter.id === last_intervention.id) {
          selected_intervention = inter;
        }
      }
    }
  }

  const initialView = [48.581772, 7.760583]
</script>

<div class="grid gap-4 grid-cols-2">
  <div style="overflow: scroll;" class="h-screen">
    {#if data}
      <div>
        <a href="/new" class="float">
          <Icon class="my-float" icon="ic:sharp-plus" width=40 height=40/>
        </a>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        {#each data.interventions as intervention}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div on:click={() => selectIntervention(intervention)} class:selected={selected_intervention?.id === intervention.id} class="card grid grid-cols-9 gap-4" style="border-color: {getBorderColor(intervention.status)};">
            <div class="col-span-7">
              <div>
                <span class="card-title">
                  {intervention.type}
                </span>
                <span>
                  ({formatDate(intervention.date)})
                </span>
              </div>
              <div class="card-description">
                <div>
                  {intervention.description} - {intervention.status}
                </div>
                <div>
                  {intervention.address}
                </div>
              </div>
            </div>
            <div class="info_btn col-span-1" on:click={() => openUpdateModale(intervention)}>
              <Icon width=30 icon="ic:baseline-border-color" />
            </div>
            <div class="delete-btn info_btn col-span-1" on:click={() => openDeleteModal(intervention)}>
              <Icon width=30 icon="ic:baseline-delete-forever" />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <div class="h-screen">
    <Map view={initialView} zoom={13}>
      {#if selected_intervention && !loading}
        <Marker latLng={selected_place}>
          <Popup>
            Change status
            <button on:click={() => changeStatus("À planifier")} class="orange-dot"></button>
            <button on:click={() => changeStatus("En cours")}    class="blue-dot"></button>
            <button on:click={() => changeStatus("Réalisé")}     class="green-dot"></button>
          </Popup>
        </Marker>
      {/if}
    </Map>
  </div>

  <ConfirmModal show={showDeleteModal} onAccept={handleAccept} onClose={closeDeleteModal} />
  <UpdateModal intervention={intervention_to_update} show={showUpdateModal} on:updateComplete={elementUpdated} onClose={closeUpdateModale} />
</div>