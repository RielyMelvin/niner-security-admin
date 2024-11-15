<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';

    interface Alert {
        alert_title: string;
        alert_description: string;
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
            date_time: formattedDateTime // Set the formatted string
        };

        const response = await pb.collection('alerts').create(alertData);
        goto('/dashboard');
    } catch (error) {
        console.error('Error sending alert:', error);
        errorMessage = 'Failed to send alert.';
    }
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

    .alert-container {
        padding: 20px;
        border: 1px solid #AD9651;
        border-radius: 10px;
        background-color: #fff;
        max-width: 400px;
        margin: 0 auto;
        height: auto;
    }

    h2 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5em;
        text-align: center;
    }

    label {
        display: block;
        margin-bottom: 8px;
    }

    select, textarea {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    button {
        width: 100%;
        padding: 10px;
        background-color: #00703C;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: #005a2c;
    }

    .message {
        text-align: center;
        color: green;
    }

    .error {
        text-align: center;
        color: red;
    }
</style>

<div class="alert-container">
    <h2>Send Alert</h2>
    <form on:submit|preventDefault={sendAlert}>
        <label for="userSelect">Alert Title: </label>
        <textarea id="alertTitle" bind:value={alertTitle} rows="1" placeholder="Enter alert title" required></textarea>
        

        <label for="alertDescription">Alert Description:</label>
        <textarea id="alertDescription" bind:value={alertDescription} rows="4" placeholder="Enter alert description" required></textarea>

        <button type="submit">Send Alert</button>
    </form>

    {#if successMessage}
        <div class="message">{successMessage}</div>
    {/if}
    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}
</div>
