# Salesforce SOQL Editor

<p><a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/version/allanoricil.salesforce-soql-editor.svg?style=for-the-badge&colorA=252526&colorB=43A047&label=VERSION" alt="Version"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/downloads/allanoricil.salesforce-soql-editor.svg?style=for-the-badge&colorA=252526&colorB=43A047&label=DOWNLOADS" alt="Downloads"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/rating-star/allanoricil.salesforce-soql-editor.svg?style=for-the-badge&colorA=252526&colorB=43A047&label=RATING" alt="Ratings"></a></p>

This extension enables developers to create, run and add to Apex SOQL queries without leaving the IDE. If you want to contribute, please consider clicking on the button below. Thanks.

<a href="https://www.buymeacoffee.com/allanoricil" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>

<img src="https://drive.google.com/uc?id=1NwUzkAQ2x_LHk2ecIMlK9aNxz1bYAko-" width="1200px"></img>

## Features

- [x] Create SOQL Queries.
- [x] Run SOQL Queries.
- [x] Get SOQL Query Plans.
- [x] Add SOQL Queries to Apex.
- [x] Update Records.
- [x] Add Relationship Fields.

## Requirements

- sfdx-cli 7.81.0
- VS Code 1.47.2 -> To update your vscode go to Help -> then click on Check for Updates / Restart to Update
- MUST BE USED FROM A SFDX PROJECT

## Issues

You can open issues here https://github.com/AllanOricil/SOQL-Editor-Issues

# Instalation

Open VS Code, click on the Extension button in the side bar menu, search for `Salesforce SOQL Editor` and click `Install`.

<img src="https://drive.google.com/uc?id=1Rvs9f6quK06iQnIo5fqr7iiQfJXbQQkB" width="800px"></img>

Then open a SFDX project and wait for the Activation Message to appear. The extension will be activated automatically on workspaces that have a file called `sfdx-project.json`.

<img src="https://drive.google.com/uc?id=1Hdr8xEuQ6ct_g37SLG29fFGk6G-BBExK" width="600px"></img>

In cases where the file `sfdx-project.json` is not in the root of the current workspace, you can manually activate the extension by pressing `Ctrl + Shift + P` and then selecting `SFDX: SOQL Editor`.

<img src="https://drive.google.com/uc?id=1etE2ZuZBOn0bEvNyTTlLWvegzpwOAZnP" width="600px"></img>

# How to use the SOQL Editor

## How to select an Org

Configure a Default Username on SFDX. The App will use this user to query the data.

```
sfdx force:config:set defaultusername=me@myhub.org
```

If you have the official Salesforce Extensions for VSCode you can change the Defaultusername Org by clicking on this button:

<img src="https://drive.google.com/uc?id=1xcn1XP3ntCFgwJ91WAC1TKcnKy81X-6a" width="600px"></img>

Whenever you change the org or refresh the objects list, a loading component appears until the new objects list is retrieved. If sfdx could not retrieve a valid accessToken for the current selected org, then the loading component will be displayed forever until you pick up a new org that has a valid accessToken.

If the accessToken is not valid, the following message will be displayed:

<img src="https://drive.google.com/uc?id=11pp2nGl5zHgMGJJjipdfQVaWxtjA4AnG" width="600px"></img>


## How to open the SOQL Editor

There are three ways to open the SOQL Editor.

### File Explorer Context

In the file explorer click with the right button on any Apex class to see the option `SFDX: SOQL Editor` in the Menu.

<img src="https://drive.google.com/uc?id=1hPfBf8Rzap7K9dQf8I92Kf_43yHIeU9A"></img>

### Editor Context

Open an Apex class and click with the right button anywhere in the editor context to see the option `SFDX: SOQL Editor` in the Menu.

<img src="https://drive.google.com/uc?id=16WGijV7hT6dcz99xIDtYe3NsJnxP4nR9"></img>

### Editor Navigation Context

Open an Apex class and click on the button shown in the image below. This button only appears when editing Apex classes.

<img src="https://drive.google.com/uc?id=1ufLB1_TdaZDku6sSU-OdKHehX-CeHSi3"></img>

## Run a SOQL query

Wait a few seconds after the editor is opened to see the available SObjects.
Once the data is loaded, choose a SObject and wait until the available fields are displayed right below the object name.
To select multiple fields press `CTRL` and click on a new field.
To add multiple `WHERE` conditions, click on the `+` button to add a new Filter entry.
To `ORDER BY` your results use the three Order by fields that are to the right of the Object selection.
To `LIMIT` your results use the Max Records field.
You can also write your query in the Query Editor and run it without using any of the input fields.

<img src="https://drive.google.com/uc?id=1YxuqmhsiTDoEDFJm5lNmQqRk1YZ9Os_j" width="1200px"></img>

## Add your SOQL query to Apex

- Open an Apex Class

- Open the SOQL editor

- Create your query

- Click anywhere in the Apex class to set the place where you want to place the query.

- In the SOQL editor click on the button `Add to Apex`. The query will appear on the apex class, at the position you clicked before.

<img src="https://drive.google.com/uc?id=1NwUzkAQ2x_LHk2ecIMlK9aNxz1bYAko-" width="1200px"></img>

## Update Records

- Query the Id field and at least one `updateable` field to show the Edit and Delete buttons.

- Click on the Edit button to change a particular record. 

- And if you want to discard all of your changes just click on the Cancel button.

- Once you are happy with your changes click on the Commit button to save everything on the database.

- If all the changes you did for that record are saved without any errors, the record changes back to read mode. If the changes are not accepted by Salesforce, a modal appears with detailed informatiion about what went wrong, and the record stays on edit state. You can choose to fix the errors or cancel the changes.


## Release Notes

## 0.10.4
- It fixes this [bug](https://github.com/AllanOricil/SOQL-Editor-Issues/issues/12). Now users can use the extension with environments that have aliases with space characters, like "My Org".

## 0.10.3

- It fixes a bug that was preventing running queries with DateTime with timezones, like `SELECT COUNT(Id) FROM Account WHERE CreatedDate > 2020-03-17T21:04:32.000+0000`

### 0.10.0

- It introduces the "Add All" and "Clear All" buttons on the relationship fields modal. This enables the users to quickly pick up all the fields of a certain relationship instead of adding one by one. If the user clicks on "Add All" it will add all the fields shown in the last displayed picklist.

- It changes the name of the commit changes button to "save".

- It makes the relationship fields picklists container to translate to left automatically. Before this it was necessary to manually scroll horizontally.

- It improves output messages. 

- It adds shortcut keys for the refresh objects and hide/show form buttons. To use these shortcuts it is necessary to focus on the SOQL Editor.
  
  <b>CTRL + R</b>: Refresh the SObjects list
  
  <b>CTRL + H</b>: Hide/Show the form
 
- It adds new input types on the soql results table when the user is edditing a record.

- It enables the Delete Record button.

### 0.9.0

- Now users can choose to display the field type in the form and in the query table header. These properties are off by default because they don't look that good yet. I will properly format it later.

<img src="https://drive.google.com/uc?id=1jrRG6ni0GopLY90mP4XlyQNV11pzrhin" width="400px"></img>

Result:

<img src="https://drive.google.com/uc?id=1jm6UiBiBD-9cy9gdhaV1EhRPQOnx0kAo" width="700px"></img>

### 0.8.0

- Now users can Export data as Source Plan.

<img src="https://drive.google.com/uc?id=1FjxvaqyBZ-JecXFdxIGgTYzKvEb2aHoj" width="700px"></img>

The exported files are saved inside a folder called `data/sourcetree` in the root of your sfdx project.

<img src="https://drive.google.com/uc?id=1FEl-qHa-yMKc2kVJYLLvcTI9rBAULjvI" width="200px"></img>

- Now users can Add Multiple relationship fields at once. Previously it was necessary to open and close the modal to add multiple fields.

<img src="https://drive.google.com/uc?id=12I0Z1EntVxIZ4ojDxc4JSOunjeUOezXc" width="700px"></img>

- The Limit field was moved to a better place. And the API field was properly labeled.

<img src="https://drive.google.com/uc?id=1lAwza1Rmxy5LYp31-S1XuzHh5i_BpApE" width="400px"></img>

- The `Add to Apex` button was separating each Query Token by two white spaces, but now it is only one when added to an editor.
- Now there is only one Output Channel for the Webview. Previously, the extension was creating one for every time the editor was opened.


### 0.7.0

- Fields are now added using a checkbox input.

<img src="https://drive.google.com/uc?id=1X4Ne2dcHbhbG_eAmNcho0uM7b16cJH6F" width="400px"></img>

- Relationship fields can now be added.

<img src="https://drive.google.com/uc?id=1xOuSnKwpaahq6r-4MXoQIjhoSUpQowSf" width="800px"></img>

- The number of relationship fields added is displayed between parenthesis.

<img src="https://drive.google.com/uc?id=1GRTRLoz7Oj1RH-CKuwbjhD05qKZwrTW_" width="400px"></img>

### 0.6.0

- Hide the form using the `soqlEditor.displayEditor` setting. This setting defaults to true, so if you want to hide the editor just change it to false.

<img src="https://drive.google.com/uc?id=1VR8BmzJ1-NISLV_8k7RQoWUuBRmh15Wr" width="1200px"></img>

<img src="https://drive.google.com/uc?id=14VcoE7YLW8zX4ru5CrAhl21LuKsOz84w" width="1200px"></img>

- Select the API version.

<img src="https://drive.google.com/uc?id=1mL0N9PydICn9MBHvZVBLA66btukvpNrh" width="1200px"></img>

- The loading animation was changed to one that it is not flickering.


### 0.5.0
 
- Removes "attributes" from nested results.

<img src="https://drive.google.com/uc?id=1rIhkl2VVEYiXHgphjtt4wutohBvOppjL" width="1200px"></img>

- Now users can Edit and Commit changes. The Edit button only appears if you Query the Id field and at least one editable field.

<img src="https://drive.google.com/uc?id=1E2qlUZZND8ujRio_UTjKXMWlWtP1td0o" width="1200px"></img>


### 0.4.0

- Reduce the size of the extension.

- Now you can get SOQL Query Plans. If you are not used to it, check this Article about the [SOQL Query Plan Tool](https://help.salesforce.com/articleView?id=000199003&r=https:%2F%2Fwww.google.com%2F&type=1)

<img src="https://drive.google.com/uc?id=1mjkhcaRnAO7TWfkeTBdy5lpx_yKY7rU4" width="600px"></img>

- Now whenever you switch orgs, the Schema builder will Reload the Sobjects List automatically:

<img src="https://drive.google.com/uc?id=1wb-ohAeB1MyjXZ7EJyd7qCJPI9VFyCmW" width="1200px"></img>

- Now you can refresh the SObject List clicking on the Refresh Button:

<img src="https://drive.google.com/uc?id=1zy21sEXPnGaCysPQ6ddOaWGC7AZ_3_Ov" width="300px"></img>

- Fix the activation event related to this [issue](https://github.com/AllanOricil/SOQL-Editor-Issues/issues/2)


### 0.3.0

- Ids can now be clicked to open the Record Detail Page.

<img src="https://drive.google.com/uc?id=1KBRDhPY093MdRw0JcAp-19IifD_BjS96" width="600px"></img>


