# Salesforce SOQL Editor

<p><a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/version/allanoricil.salesforce-soql-editor.svg" alt="Version"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/downloads/allanoricil.salesforce-soql-editor.svg" alt="Downloads"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/rating-star/allanoricil.salesforce-soql-editor.svg" alt="Ratings"></a></p>

This extension enables developers to create, run and add to Apex SOQL queries without leaving the IDE. If you want to contribute, please consider clicking on the button below. Thanks.

<a href="https://www.buymeacoffee.com/allanoricil" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>

<img src="https://drive.google.com/uc?id=1NwUzkAQ2x_LHk2ecIMlK9aNxz1bYAko-" width="1200px"></img>

## Features

- [x] Create SOQL Queries
- [x] Run SOQL Queries.
- [x] Add SOQL Queries to Apex.
- [ ] Inner Queries.
- [ ] Easy Access to Relationship Fields. --> Almost there <--

## Requirements

- sfdx-cli 7.58.2 or above
- VS Code 1.47.2 -> To update your vscode go to Help -> then click on Check for Updates / Restart to Update
- MUST BE USED FROM A SFDX PROJECT

## Issues

You can open issues here https://github.com/AllanOricil/SOQL-Editor-Issues

# Instalation

Open VS Code, click on the Extension button in the side bar menu, search for `Salesforce SOQL Editor` and click `Install`.

<img src="https://drive.google.com/uc?id=1Rvs9f6quK06iQnIo5fqr7iiQfJXbQQkB" width="800px"></img>

Then open a SFDX project and wait for the Activation Message to appear. The extension will be activated automatically in workspaces that have the file `sfdx-project.json`.

<img src="https://drive.google.com/uc?id=1Hdr8xEuQ6ct_g37SLG29fFGk6G-BBExK" width="600px"></img>

In cases where the file `sfdx-project.json` is not in the root of the current workspace, you can manually activate the extension by pressing `Ctrl + Shift + P` and then selecting `SFDX: SOQL Editor`.

<img src="https://drive.google.com/uc?id=1etE2ZuZBOn0bEvNyTTlLWvegzpwOAZnP" width="600px"></img>

# How to use the SOQL Editor

## Choose a Default Username / Environment

Configure a Default Username in the SFDX using the Global flag. The App will use this user to query the data.

```
sfdx force:config:set defaultusername=me@myhub.org -g
```

## Open the SOQL Editor

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
