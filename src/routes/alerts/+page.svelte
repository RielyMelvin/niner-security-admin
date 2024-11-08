<script lang="ts">
    import { pb } from '$lib/pocketbase';

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
            const alertData = {
                alert_title: alertTitle,
                alert_description: alertDescription,
                date_time: new Date().toISOString(),
            };
            const response = await pb.collection('alerts').create(alertData)
            // Show a success message and clear fields
            successMessage = 'Alert sent successfully!';
        } catch (error) {
            console.error('Error sending alert:', error);
            errorMessage = 'Failed to send alert.';
        }
    }
</script>

<style>
    /* Style your alert system */
    .alert-container {
        padding: 20px;
        border: 1px solid #AD9651;
        border-radius: 10px;
        background-color: #fff;
        max-width: 400px;
        margin: 0 auto;
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
