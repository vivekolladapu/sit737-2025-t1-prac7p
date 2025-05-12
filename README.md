#Documentation
**Output** 
This application performs the calculations and prints in the form of JSON format.

**Steps:**

Firstly, download and install Git from its official website "https://git-scm.com/", then check the version to verify.

Then, create a repository with the name of "sit737-2025-t1-prac7p".

Now pull the previous repository code to the local machine.

Now, download the VS Code and then also download NodeJS.

Now, create the configuration files in the kubernetes-configs directory.

In this directory, create 5 files which include deployment and service for the calculator application and deployment, service and PVC for the MongoDB.

Now create the Dockerfile and docker-compose file and then build and push the image.

The project structure should look as below:

sit737-2025-t1-prac7p |-- kubernetes-configs ||--(deployment.yaml) ||--(service.yaml) ||--(mongo-deployment.yaml) ||--(mongo-pvc.yaml) ||--(mongo-service.yaml) |--node_modules |--logs ||--(combined.log) ||--(error.log) |--server.js |-Dockerfile |--docker-compose.yml |--package.json |--package-lock.json |--README.md

Now, check the working of the application before the deployment.

Now, create the credentials to access the MongoDB.

Now, create the configurations which are in the directory of kubernetes-configs.

Then, check the pods and services, and then check the logs in which it shows that it successfully connected to the MongoDB.

Now, use the application in the browser then it will insert into the database.

Now connect to the MongoDB shell and change the database to calculatorDB.

Then get all the records from the database in which it shows all the operations which are done in the browser.

Now perform the CRUD operations by updating any data, deleting any data, and viewing the data.

Now, make a backup of the data and list the files that are created for the backup.

Then view the backup data which will be shown in the JSON format.

Now, add all the changes to the git, then commit it with any message like "initial commit".

Then push all the committed code to Git.
