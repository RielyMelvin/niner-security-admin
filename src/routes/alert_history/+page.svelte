<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';

    interface Alert {
        id: string;
        alert_title: string;
        alert_description: string;
        date_time: string;
    }

    let errorMessage = '';
    let alerts: Alert[] = [];

    //Fetch alerts and sort them by newest to oldest
    async function fetchAlerts() {
    try {
        const response = await pb.collection('alerts').getList<Alert>();
        console.log('Fetched response:', response); 
        alerts = (response.items || []).sort((a, b) => {
            const dateA = new Date(a.date_time).getTime();
            const dateB = new Date(b.date_time).getTime();
            return dateB - dateA;
        });
    } catch (error) {
        errorMessage = 'Failed to load alerts.';
        console.error('Error fetching alerts:', error);
    }
}

    async function alert() {
        goto('/alerts');
    }

    async function home(){
        goto('/dashboard');
    }
    
    fetchAlerts();
</script>

<style>
    :global(body) {
        background-color: #CCFFDD; 
        margin: 0;
        padding: 0;
        height: auto; 
        min-height: 100vh; 
        display: flex;
        flex-direction: column; 
        align-items: center;
        justify-content: flex-start; 
        overflow-x: hidden;
    }

    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background-color: #00703C;
        padding: 10px 20px;
    }

    h1 {
        margin: 0; 
        font-family: 'Bebas Neue', sans-serif; 
        color: #fff; 
        font-size: 2.5em; 
        text-align: center; 
        flex-grow: 1;
    }

    h3 {
        color: #00703C; 
        font-size: 1.5em; 
        font-weight: bold;
        text-decoration: underline; 
        border-bottom: 2px solid #AD9651; 
        padding-bottom: 2px; 
    }

    .alert-container {
        padding: 15px;
        border: 1px solid #AD9651;
        margin: 5px 0; 
        border-radius: 8px;
        background-color: #f9f9f9;
        width: 80%;
        max-width: 600px;
        overflow-wrap: break-word; 
    }

    .alert-container p {
        word-wrap: break-word; 
        overflow-wrap: break-word; 
        white-space: pre-wrap; 
        max-height: 300px; 
        overflow-y: auto; 
    }
    
    .alert-title {
        font-weight: bold;
        color: #00703C;
    }

    .alert-footer {
        display: flex;
        justify-content: space-between; 
        align-items: center; 
        margin-top: 10px; 
    }

    .alert-button, .home-button {
        margin-right: 10px; 
        font-family: 'Bebas Neue', sans-serif; 
        color: #fff; 
        font-size: 1.5em; 
        cursor: pointer; 
        background-color: #00703C; 
        border: none; 
        border-radius: 10px; 
        padding: 8px 16px; 
    }

    .alert-button:hover, .home-button:hover {
        background-color: #005f2c; 
    }

    .datetime {
        color: #666;
        font-size: 0.9em; 
        margin-left: auto; 
    }
</style>

<div class="header-container">
    <button class="alert-button" on:click={alert} type="button">Create An Alert</button>
    <h1>Alert History</h1>
    <button class="home-button" on:click={home} type="button">Home</button>
</div>

{#if errorMessage}
    <p>{errorMessage}</p>
{/if}

{#each alerts as alert (alert.id)}
<div class="alert-container">
    <h3 class="alert-title">{alert.alert_title}</h3>
    <p><strong>Description:</strong> {alert.alert_description}</p>
    <div class="alert-footer">
        <span class="datetime">{alert.date_time}</span>
    </div>
</div>
{/each}
