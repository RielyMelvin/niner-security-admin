<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';

    interface User {
        id: string;
        email: string;
        name: string;
        isAdmin: boolean;
    }

    interface Report {
        id: string;
        user: string; 
        type: string;
        datetime: string;
        contact: string;
        location: string;
        user_description: string;
        admin_description: string;
        report_name: string;
        disposition: string;
    }

    let reports: (Report & { userDetails?: User })[] = [];
    let filteredReports: (Report & { userDetails?: User })[] = [];
    let errorMessage = '';
    let dispositionFilter = 'All';

    // Fetch reports with user data
    async function fetchReports() {
        try {
            const reportResponse = await pb.collection('reports').getList<Report>();
            const userIds = [...new Set(reportResponse.items.map(report => report.user))];
            const userPromises = userIds.map(userId =>
                pb.collection('users').getOne<User>(userId, {
                    expand: 'username,email'
                }).catch(() => ({
                    id: userId,
                    email: 'Unknown',
                    name: 'Unknown',
                    isAdmin: false,
                } as User))
            );

            const users = await Promise.all(userPromises);
            const userMap = new Map<string, User>();
            users.forEach(user => userMap.set(user.id, user));

            reports = reportResponse.items.map(report => ({
                ...report,
                userDetails: userMap.get(report.user),
            })).sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

            applyFilter(); // Apply filter to initialize filteredReports

        } catch (error) {
            errorMessage = 'Failed to load reports.';
            console.error(error);
        }
    }

    // Apply disposition filter
    function applyFilter() {
        filteredReports = dispositionFilter === 'All'
            ? reports
            : reports.filter(report => report.disposition === dispositionFilter);
    }

    // Update disposition and apply filter to reflect changes
    async function updateDisposition(reportId: string, newDisposition: string) {
        try {
            await pb.collection('reports').update(reportId, { disposition: newDisposition });
            const report = reports.find(report => report.id === reportId);
            if (report) report.disposition = newDisposition;
            applyFilter(); 
        } catch (error) {
            console.error("Failed to update disposition:", error);
        }
    }

    // Delete report and reapply filter to refresh the list
    async function deleteReport(reportId: string) {
        try {
            await pb.collection('reports').delete(reportId);
            reports = reports.filter(report => report.id !== reportId);
            applyFilter(); 
        } catch (error) {
            console.error("Failed to delete report:", error);
        }
    }

    // Logout function
    async function logout() {
        await pb.authStore.clear(); 
        goto('/'); 
    }

    fetchReports();
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
    .logout-button {
        margin-right: 20px; 
        font-family: 'Bebas Neue', sans-serif; 
        color: #fff; 
        font-size: 1.5em; 
        cursor: pointer; 
        background-color: #00703C; 
        border: none; 
        border-radius: 10px; 
        padding: 8px 16px; 
    }
    .logout-button:hover {
        background-color: #005f2c; 
    }

    h3 {
        margin: 10px 0; 
        color: #00703C; 
        font-size: 1.5em; 
        font-weight: bold;
        text-decoration: underline; 
        border-bottom: 2px solid #AD9651; 
        padding-bottom: 2px; 
    }
    .report-container {
        padding: 15px;
        border: 1px solid #AD9651;
        margin: 5px 0; 
        border-radius: 8px;
        background-color: #f9f9f9;
        width: 80%;
        max-width: 600px;
        overflow-wrap: break-word; 
    }

    .report-container p {
        word-wrap: break-word; 
        overflow-wrap: break-word; 
        white-space: pre-wrap; 
        max-height: 300px; 
        overflow-y: auto; 
    }
    
    .report-title {
        font-weight: bold;
        color: #00703C;
    }

    .report-footer {
    display: flex;
    justify-content: space-between; 
    align-items: center; 
    margin-top: 10px; 
    }

    .datetime {
        color: #666;
        font-size: 0.9em; 
        margin-left: auto; 
    }


    .delete-button {
        background-color: #b30000; 
        color: #fff;
        padding: 8px 16px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: .75em;
        transition: background-color 0.3s;
    }

    .delete-button:hover {
        background-color: #8b0000; 
    }

    .delete-button:active {
        background-color: #660000; 
    }

    .filter-container {
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    #dispositionFilter {
        padding: 5px;
        border-radius: 5px;
        font-size: 1em;
    }

    .report-container select {
        padding: 4px;
        border-radius: 5px;
        font-size: 0.9em;
    }

</style>

<div class="header-container">
    <h1>Admin Dashboard - User Posts</h1>
    <button class="logout-button" on:click={logout} type="button">Logout</button>
</div>

<div class="filter-container">
    <label for="dispositionFilter">Filter by Disposition:</label>
    <select id="dispositionFilter" bind:value={dispositionFilter} on:change={applyFilter}>
        <option value="All">All</option>
        <option value="Pending Investigation">Pending Investigation</option>
        <option value="Investigating">Investigating</option>
        <option value="Resolved">Resolved</option>
    </select>
</div>

{#if errorMessage}
    <p>{errorMessage}</p>
{/if}

{#each filteredReports as report}
    <div class="report-container">
        <h3 class="report-title">{report.report_name} - {report.type}</h3>
        <label for={`disposition-${report.id}`}><strong>Disposition:</strong></label>
        <select id={`disposition-${report.id}`} bind:value={report.disposition} on:change={(e) => updateDisposition(report.id, e.target.value)}>
            <option value="Pending Investigation">Pending Investigation</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
        </select>
        
        <p><strong>Location:</strong> {report.location}</p>
        <p><strong>User Description:</strong> {report.user_description}</p>
        <p><strong>Admin Description:</strong> {report.admin_description}</p>
        <p><strong>User Email:</strong> {report.userDetails?.email}</p>
        <p><strong>Additional Contact Details:</strong> {report.contact}</p>
        
        <div class="report-footer">
            <button class="delete-button" on:click={() => deleteReport(report.id)}>Delete</button>
            <span class="datetime">{report.datetime}</span>
        </div>
    </div>
{/each}


