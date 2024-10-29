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
        user: string; // This is the user ID from the reports
        type: string;
        datetime: string;
        contact: string;
        location: string;
        user_description: string;
        admin_description: string;
        report_name: string;
    }

    let reports: (Report & { userDetails?: User })[] = [];
    let errorMessage = '';

    // Retrieve Reports with Cached User Data
    async function fetchReports() {
    try {
        // Fetch all reports
        const reportResponse = await pb.collection('reports').getList<Report>();

        // Extract unique user IDs from reports
        const userIds = [...new Set(reportResponse.items.map(report => report.user))];

        // Fetch users in parallel
        const userPromises = userIds.map(userId =>
            pb.collection('users').getOne<User>(userId, {
                expand: 'username,email' 
            }).catch(userError => {
                console.error(`Failed to load user ${userId}`, userError);
                return {
                    id: userId,
                    email: 'Unknown',
                    name: 'Unknown',
                    isAdmin: false,
                } as User;
            })
        );

        // Wait for all user fetches to complete
        const users = await Promise.all(userPromises);

        // Create a map of user details for easy access
        const userMap = new Map<string, User>();
        users.forEach(user => {
            userMap.set(user.id, user);
        });

        // Combine reports with user details
        reports = reportResponse.items.map(report => {
            const userDetails = userMap.get(report.user);
            return { ...report, userDetails };
        });

        // Sort reports by datetime (most recent first)
        reports.sort((a, b) => {
            return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
        });

    } catch (error) {
        errorMessage = 'Failed to load reports.';
        console.error(error);
    }
}


    // Logout function
    async function logout() {
        await pb.authStore.clear(); 
        goto('/'); 
    }

    fetchReports();

    // Delete Reports
    async function deleteReport(reportId: string) {
        try {
            await pb.collection('reports').delete(reportId);
            reports = reports.filter(report => report.id !== reportId);
        } catch (error) {
            console.error("Failed to delete report:", error);
        }
    }
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
</style>

<div class="header-container">
    <h1>Admin Dashboard - User Posts</h1>
    <button class="logout-button" on:click={logout} type="button">Logout</button>
</div>

{#if errorMessage}
    <p>{errorMessage}</p>
{/if}

{#each reports as report}
    <div class="report-container">
        <h3 class="report-title">{report.report_name}</h3>
        <p><strong>User Email:</strong> {report.userDetails?.email}</p>
        <p><strong>Type:</strong> {report.type}</p>
        <p><strong>Contact:</strong> {report.contact}</p>
        <p><strong>Location:</strong> {report.location}</p>
        <p><strong>User Description:</strong> {report.user_description}</p>
        <p><strong>Admin Description:</strong> {report.admin_description}</p>
        
        <div class="report-footer">
            <button class="delete-button" on:click={() => deleteReport(report.id)}>Delete</button>
            <span class="datetime">{report.datetime}</span>
        </div>
    </div>
{/each}
