<script>
  import '../../app.css';
  import Icon from '@iconify/svelte';

  let selected = {};
  let error;
  let success;

  let address = '';
  let possible_types = [
    {id: 0, text: "Technique"},
    {id: 1, text: "Ménage"},
    {id: 2, text: "Médiation"}
  ]
  let description = '';
  let status = 'À planifier';
  let date = new Date();

  /**
   * Asynchronously creates a new intervention.
   */
  async function createIntervention() {
    const response = await fetch('/api/interventions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: address, type: selected.text, description: description, status: status, date: new Date(date) }),
    });

    if (response.ok) {
      error = null
      success = "New intervention created !"
      // reset infos
      selected = {};
      address = '';
      description = '';
      status = 'À planifier';
      date = new Date();
    } else {
      success = null
      const errorData = await response.json()
      error = errorData.error
    }
  }

  /**
   * Asynchronously handles the form submission process.
   */
  async function handleSubmit() {
    error = '';
    if (address == ''){
      error = 'You must provide an address';
      return;
    } else if(!selected.text) {
      error = 'You must provide a type';
      return;
    } else if(description == '') {
      error = 'You must provide a description';
      return;
    }
    createIntervention();
  }
</script>

<div class="intervention-form">
  <div class="back-zone">
    <a href="/">
      <Icon class="go-back" icon="ic:outline-keyboard-return" width=50/>
    </a>
  </div>

  <form id="create-form" on:submit|preventDefault={handleSubmit}>

    <div class="wrapper">

      <div class="first-line">
        <div>
          Address
        </div>
        <div>
          <input class="inter-input" type='text' bind:value={address}/>
        </div>
      </div>

      <div class="first-line">
        <div>
          Intervention type
        </div>
        <div>
          <select class="inter-input" bind:value={selected}>
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
          <textarea class="inter-input" bind:value={description}/>
        </div>
      </div>

      <div class="first-line">
        <div>
          Intervention date
        </div>
        
        <div>
          <input class="inter-input" type='date' bind:value={date}/>
        </div>
      </div>

      <div>
        <button type="submit" class="submit-button">Create !</button>
      </div>

    </div>
  </form>
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
</div>
