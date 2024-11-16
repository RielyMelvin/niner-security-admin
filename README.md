# Project Overview
This is an web application for administratives at UNC Charlotte to enhance campus security and commmunication. Admins are able to manage and maintain proper campus reports and help reduce any concerns students have.

By giving administratives at UNC Charlotte a way to look at the reports from students and manage them, they can help further ensure that reports are truthful and help maintain a safe and secure campus.

### Key Features:
- Manage user reports
- Ensure other admins can see if a report has been looked into or not

# Setup Instructions
1) Install (Node.js)[https://nodejs.org/en/] and follow the instructions given for it.
2) Next you should be able to download the project in any given folder you have created in your Command Prompt with 'git clone https://github.com/RielyMelvin/niner-security-admin.git'
3) You should do be able to do 'cd repository-name'
4) Now do 'npm install' to get the dependencies for Svelte
5) Lastly, you can run it with 'npm run dev'

If you do not want to do the command-line stuff
1) Download the file and extract it from the zip file
2) Now open the file with either Visual Studio Code, Visual Studio or VSCode (whichever you prefer)
3) Run 'npm install' for dependencies
4) Run 'npm run dev' to run the project on your local machine
### REMEMBER to run the Pocketbase server alongside the web-application in order to obtain the correct results. For use, run it in the mobile application which instructions can be found (here)[https://github.com/yibab/niner_security]

# Usage Details
### Log In:
- Enter correct email and password alongside correct admin privledges
- Press 'Sign In' to sign in
### Dashboard:
- Access to view all reports made by users based off the most recent ones
- Access to delete any reports if needed by the admins
- Access to add and descriptions needed for other admins to see
- Access to send alerts to users who are using the application
### Admin Description
- Press 'Edit' button next to 'Admin Description:' field in a report
- Press 'Cancel' if want to not change the report
- Press 'Save' to save admin description to what user has added
### Niner Alerts:
It is currently in development and will serve as the area to look at any alerts that campus police have put out. The functionality for it right now is:
- A list of campus police reports that the students can look at

# Team's Progress
Currently we are working on polishing the admin and user applications to ensure no oversight from previous sprints