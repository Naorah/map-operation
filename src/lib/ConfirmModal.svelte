<!-- Modal.svelte -->
<script>
  export let show = false;
  export let onAccept;
  export let onClose;
</script>

{#if show}
  <div class="modal-backdrop">
    <div class="modal">
      <p>WARNING: This action cant be undone !</p>
      <button class="cancel-btn" on:click={onClose}>Cancel</button>
      <button class="accept-btn" on:click={onAccept}>Delete</button>
    </div>
  </div>
{/if}

<style>
  .accept-btn {
    color: rgb(201, 0, 0);
    border: 1px rgb(201, 0, 0) solid;
    border-radius: 5px;
    padding: 0.2rem 0.4rem 0.2rem 0.4rem;
    transition: 0.5s;
  }

  .accept-btn:hover {
    color: white;
    background-color: rgb(201, 0, 0);
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