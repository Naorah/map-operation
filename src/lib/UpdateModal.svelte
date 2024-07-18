<!-- Modal.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let show = false;
  export let onClose;
  export let intervention;

  let selected_type;
  let selected_status;
  let date;

  let possible_types = [
    {id: 0, text: "Technique"},
    {id: 1, text: "Ménage"},
    {id: 2, text: "Médiation"}
  ]

  let possible_status = [
    {id: 0, text: "À planifier"},
    {id: 1, text: "En cours"},
    {id: 2, text: "Réalisé"}
  ]

  /**
   * intervention trigger when modified
  */
  $: if(intervention) {
    success = null;
    error = null;
    for(let temp_status of possible_status) {
      if(temp_status.text === intervention.status) { 
        selected_status = temp_status;
        intervention.status = temp_status;
      }
    }
    // On va chercher les infos des types
    for(let temp_type of possible_types) {
      if(temp_type.text === intervention.type) { 
        selected_type = temp_type;
        intervention.type = temp_type;
      }
    }
    intervention.date = (new Date(intervention.date)).toJSON().slice(0, 10);;
  }

  let error;
  let success;

  /**
   * Asynchronously updates an existing intervention.
   */
  async function updateIntervention() {
    const response = await fetch(`/api/interventions/${intervention.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: intervention.address, date: new Date(intervention.date), description: intervention.description, status: intervention.status.text, type: intervention.type.text }),
    });

    if (response.ok) {
      error = null
      success = "Intervention updated !"
      dispatch('updateComplete');
    } else {
      success = null
      const errorData = await response.json()
      error = errorData.error
    }
  }
</script>

{#if show}
  <div class="modal-backdrop">
    <div class="modal">
      {#if intervention}
      <p>Update informations:</p>

      <div>
        <form id="update-form">

          <div class="wrapper">
      
            <div class="first-line">
              <div>
                Address
              </div>
              <div>
                <input class="inter-input" type='text' bind:value={intervention.address}/>
              </div>
            </div>
      
            <div class="first-line">
              <div>
                Intervention type
              </div>
              <div>
                <select class="inter-input" bind:value={intervention.type}>
                  {#each possible_types as type}
                    <option value={type}>
                      {type.text}
                    </option>
                  {/each}
                </select>
              </div>
            </div>
      
            <div class="first-line">
              <div>
                Description
              </div>
              <div>
                <textarea class="inter-input" bind:value={intervention.description}/>
              </div>
            </div>

            <div class="first-line">
              <div>
                Intervention status
              </div>
              <div>
                <select class="inter-input" bind:value={intervention.status}>
                  {#each possible_status as status}
                    <option value={status}>
                      {status.text}
                    </option>
                  {/each}
                </select>
              </div>
            </div>
      
            <div class="first-line">
              <div>
                Intervention date
              </div>
              
              <div>
                <input class="inter-input" type='date' value={intervention.date} on:input={e => intervention.date = e.target.value || intervention.date}/>
              </div>
            </div>
      
          </div>
          {#if error}
          <div class="text-error">
            {error}
          </div>
          {/if}
          {#if success}
          <div class="text-success">
            {success}
          </div>
          {/if}
          
          <button class="cancel-btn" on:click={onClose}>Cancel</button>
          <button on:click={updateIntervention} class="update-btn">Update</button>
        </form>
      </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .update-btn {
    color: rgb(24, 26, 163);
    border: 1px rgb(24, 26, 163) solid;
    border-radius: 5px;
    padding: 0.2rem 0.4rem 0.2rem 0.4rem;
    transition: 0.5s;
  }

  .update-btn:hover {
    color: white;
    background-color: rgb(24, 26, 163);
  }

  .cancel-btn {
    color: white;
    border: 1px rgb(119, 119, 119) solid;
    background-color: rgb(119, 119, 119);
    border-radius: 5px;
    padding: 0.2rem 0.4rem 0.2rem 0.4rem;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
  }

  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: 500;
  }

  button {
    margin: 5px;
  }
</style>