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
- [ ] Parent Relationship Queries.
- [ ] Easy Access to Relationship Fields.

## Requirements

- sfdx-cli 7.58.2 or above
- VS Code 1.47.2 -> To update your vscode go to Help -> then click on Check for Updates / Restart to Update
- MUST BE USED FROM A SFDX PROJECT

## Issues

You can open issues here https://github.com/AllanOricil/SOQL-Editor-Issues

# Installation

Open VS Code, click on the Extension button in the side bar menu, search for `Salesforce SOQL Editor` and click `Install`.

<img src="https://drive.google.com/uc?id=1Rvs9f6quK06iQnIo5fqr7iiQfJXbQQkB" width="800px"></img>

Then open a SFDX project and wait for the Activation Message to appear. The extension will be activated automatically on workspaces that have a file called `sfdx-project.json`.

<img src="https://drive.google.com/uc?id=1Hdr8xEuQ6ct_g37SLG29fFGk6G-BBExK" width="600px"></img>

In cases where the file `sfdx-project.json` is not in the root of the current workspace, you can manually activate the extension by pressing `Ctrl + Shift + P` and then selecting `SFDX: SOQL Editor`.

<img src="https://drive.google.com/uc?id=1etE2ZuZBOn0bEvNyTTlLWvegzpwOAZnP" width="600px"></img>

# How to use the SOQL Editor

## 

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


## Release Notes

### 0.5.0
 
 - Remove "attributes" from nested results.

    <img src="https://drive.google.com/uc?id=1rIhkl2VVEYiXHgphjtt4wutohBvOppjL" width="1200px"></img>

 - Now users can Edit and Commit changes. The Edit button only appears if you Query the Id field and at least one editable field.

    <img src="https://drive.google.com/uc?id=1E2qlUZZND8ujRio_UTjKXMWlWtP1td0o" width="1200px"></img>


### 0.4.0

 - Reduce the size of the bundle with Terser.

 - Now you can get SOQL Query Plans. If you are not used to it, check this Article about the [SOQL Query Plan Tool](https://help.salesforce.com/articleView?id=000199003&r=https:%2F%2Fwww.google.com%2F&type=1)

<img src="https://drive.google.com/uc?id=1mjkhcaRnAO7TWfkeTBdy5lpx_yKY7rU4" width="600px"></img>

 - Now whenever you switch orgs, the Schema builder will Reload the Sobjects List automatically:

<img src="https://drive.google.com/uc?id=1wb-ohAeB1MyjXZ7EJyd7qCJPI9VFyCmW" width="1200px"></img>

 - Now you can refresh the SObject List clicking on the Refresh Button:

<img src="https://drive.google.com/uc?id=1zy21sEXPnGaCysPQ6ddOaWGC7AZ_3_Ov" width="300px"></img>

 - Fix the activation event related to this [issue](https://github.com/AllanOricil/SOQL-Editor-Issues/issues/2)


### 0.3.0

Ids can now be clicked to open the Record Detail Page.

<img src="https://drive.google.com/uc?id=1KBRDhPY093MdRw0JcAp-19IifD_BjS96" width="600px"></img>


