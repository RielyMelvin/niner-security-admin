
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
        isEditingAdminDescription?: boolean;
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
                } as User))
            );

            const users = await Promise.all(userPromises);
            const userMap = new Map<string, User>();
            users.forEach(user => userMap.set(user.id, user));

            reports = reportResponse.items.map(report => ({
                ...report,
                userDetails: userMap.get(report.user),
                isEditingAdminDescription: false,
            })).sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

            applyFilter(); 

        } catch (error) {
            errorMessage = 'Failed to load reports.';
            console.error(error);
        }
    }

    // String to store original description to allow save and cancel of adding a description
    let originalDescription: string = '';

    // Toggle edit mode for admin description
    function toggleEdit(report: Report) {
    if (!report.isEditingAdminDescription) {
        originalDescription = report.admin_description;
    } else {
        report.admin_description = originalDescription; 
    }
    report.isEditingAdminDescription = !report.isEditingAdminDescription;
    filteredReports = [...filteredReports]; 
    }

    // Update admin description
    async function updateAdminDescription(reportId: string, newDescription: string) {
        try {
            await pb.collection('reports').update(reportId, { admin_description: newDescription });
            const report = reports.find(report => report.id === reportId);
            if (report) {
                report.admin_description = newDescription;
                report.isEditingAdminDescription = false;
            }
            filteredReports = [...filteredReports]; 
        } catch (error) {
            console.error("Failed to update admin description:", error);
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

    // Alert function
    async function alert() {
        goto('/alerts');
    }

    async function alert_history(){
        goto('/alert_history');
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

    .logout-button, .alert-button {
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

    .logout-button:hover, .alert-button:hover {
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

    .delete-button{
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


    .delete-button:hover{
        background-color: #8b0000;
    }

    .delete-button:active {
        background-color: #660000; 
    }

    .edit-button, .save-button, .cancel-button {
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

    .edit-button:hover, .save-button:hover {
        background-color: #005f2c;
    }

    .filter-container {
        font-family: 'Bebas Neue', sans-serif; 
        padding-left: 10px;
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #fff;
        background-color: #00703C;
        border-color: #000;
        border-radius: 10px;
    }

    #dispositionFilter {
        font-family: 'Bebas Neue', sans-serif; 
        padding: 5px;
        border-radius: 5px;
        font-size: 1em;
        color: #fff;
        background-color: #00703C;
        border-color: #00703C;
        border-radius: 10px;
        align-items: center;
    }

    .report-container select {
        padding: 4px;
        border-radius: 10px;
        font-size: 0.9em;
    }
</style>


<div class="header-container">
    <button class="alert-button" on:click={alert} type="button">Create Alert</button>
    <button class="alert-button" on:click={alert_history} type="button">View Alerts</button>
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
        <p><strong>Admin Description:</strong>
            {#if report.isEditingAdminDescription}
                <textarea bind:value={report.admin_description} />
                <button class="save-button" on:click={() => updateAdminDescription(report.id, report.admin_description)}>Save</button>
                <button class="cancel-button" on:click={() => toggleEdit(report)}>Cancel</button>
            {:else}
                {report.admin_description}
                <button class="edit-button" on:click={() => toggleEdit(report)}>Edit</button>
            {/if}
        </p>
        <p><strong>User Email:</strong> {report.userDetails?.email}</p>
        <p><strong>Additional Contact Details:</strong> {report.contact}</p>
        <div class="report-footer">
            <button class="delete-button" on:click={() => deleteReport(report.id)}>Delete</button>
            <span class="datetime">{report.datetime}</span>
        </div>
    </div>
{/each}
