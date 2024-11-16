<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';
  
    interface Alert {
      alert_title: string;
      alert_description: string;
      date_time: string;
    }
  
    let alertTitle = '';
    let alertDescription = '';
    let successMessage = '';
    let errorMessage = '';
  
    // Function to create and send alert
    async function sendAlert() {
      try {
          // Create the alert document
          const currentDateTime = new Date();
  
          const currentUser = pb.authStore.model;
          console.log(currentUser);
  
          // Format the time
          const timeOptions = {
              timeZone: 'America/New_York',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
          };
          const formattedTime = currentDateTime.toLocaleTimeString('en-US', timeOptions);
  
          // Format the date
          const dateOptions = {
              timeZone: 'America/New_York',
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
          };
          const formattedDate = currentDateTime.toLocaleDateString('en-US', dateOptions);
  
          // Combine time and date
          const formattedDateTime = `${formattedTime} ${formattedDate}`;
  
          const alertData = {
              alert_title: alertTitle,
              alert_description: alertDescription,
              date_time: formattedDateTime 
          };
  
          const response = await pb.collection('alerts').create(alertData);
          goto('/dashboard');
      } catch (error) {
          console.error('Error sending alert:', error);
          errorMessage = 'Failed to send alert.';
      }
    }
  
    // Cancel the alert creation and go to dashboard
    function cancel() {
      goto('/dashboard');
    }
  </script>
  
  <style>
    :global(body) {
        background-color: #CCFFDD; 
        margin: 0;
        padding: 0;
        height: 100vh; 
        display: flex;
        flex-direction: column; 
        align-items: center;
        justify-content: flex-start; 
        overflow-x: hidden;
    }

    input {
        width: calc(100% - 10px); 
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box; 
    }
  
    .alert-container {
        width: 100%; 
        max-width: 400px; 
        margin: 20px; 
        padding: 20px;
        border: 1px solid #AD9651;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }
  
    h2 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5em;
        text-align: center;
    }

    h3 {
        color: #00703C; 
        font-size: 1.5em; 
        font-weight: bold;
        text-decoration: underline; 
        border-bottom: 2px solid #AD9651; 
        padding-bottom: 2px; 
    }
  
    label {
        display: block;
        margin-bottom: 8px;
    }
  
    .submit-button {
        background-color: #00703C;
        color: #fff;
        padding: 8px 16px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: .75em;
        transition: background-color 0.3s;
        margin-left: 5px;
    }
  
    .cancel-button {
        background-color: #b30000;
        color: #fff;
        padding: 8px 16px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: .75em;
        transition: background-color 0.3s;
        margin-left: 5px;
    }
  
    .submit-button:hover {
        background-color: #005a2c;
    }
  
    .cancel-button:hover {
        background-color: #8b0000;
    }

    .submit-button:active {
        background-color: #003d1a;
    }

    .cancel-button:active {
        background-color: #660000; 
    }

    .alert-title {
        font-weight: bold;
        color: #00703C;
    }

    .alert-create-footer {
        display: flex;
        justify-content: space-between; 
        align-items: center; 
        margin-top: 10px; 
    }
  
    .error {
        text-align: center;
        color: red;
    }
  </style>
  
  <div class="alert-container">
    <h2>Send Alert</h2>
    <form on:submit|preventDefault={sendAlert}>
      <label for="alertTitle">Alert Title:</label>
      <input type="text" id="alertTitle" bind:value={alertTitle} placeholder="Enter Alert Title" required />
      
      <label for="alertDescription">Alert Description:</label>
      <input type="text" id="alertDescription" bind:value={alertDescription} placeholder="Enter alert description" required />
  
      <div class="alert-create-footer">
        <button type="button" class="cancel-button" on:click={cancel}>Cancel</button>
        <button type="submit" class="submit-button">Send Alert</button>
      </div>
    </form>
  
    {#if errorMessage}
      <div class="error">{errorMessage}</div>
    {/if}
  </div>
  