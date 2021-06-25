# Salesforce Query Editor

<p><a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/version/allanoricil.salesforce-soql-editor.svg?style=for-the-badge&colorA=252526&colorB=43A047&label=VERSION" alt="Version"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/downloads/allanoricil.salesforce-soql-editor.svg?style=for-the-badge&colorA=252526&colorB=43A047&label=DOWNLOADS" alt="Downloads"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/rating-star/allanoricil.salesforce-soql-editor.svg?style=for-the-badge&colorA=252526&colorB=43A047&label=RATING" alt="Ratings"></a></p>

<a href="https://www.buymeacoffee.com/allanoricil" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>

This extension brings the same functionality available in the Query Editor in the Salesforce Developer Console to VS Code.

<img src="https://drive.google.com/uc?id=1-MwpPdK3bLJ6DocTHsfkY_x2x6fGb-hQ" width="1200px"></img>

## Features

- [x] SOQL Builder.
- [x] Execute SOQL Queries.
- [x] Get SOQL Query Plans.
- [x] Update, Create and Delete Records.
- [x] Add Relationship Fields.
- [x] Add Child Parent Relationship Fields.
- [x] Works with any VS Code Theme.
- [x] Works side by side with your Apex Class.
- [x] Access to Field Details, such as Name, Label, Required, Updateable, Groupable and more.
- [x] Compact to not take away the space you have available while writing code.
- [x] Works with Gitpod - https://www.gitpod.io/

## Requirements

- sfdx-cli/7.93.1-762bca056d
- VS Code >= 1.57.0 <b>IT DOES NOT WORK ON 1.56.0</b>
- MUST BE USED WITH A SFDX PROJECT
- YOU MUST NOT HAVE ANYTHING RUNNING ON PORT 5000

## Issues

You can open issues here https://github.com/AllanOricil/salesforce-query-editor

# Is it secure?

This app does not send any information to an external server. Every request is performed by your machine and the data is flushed when VS Code is closed. You can also check every request that is issued by the app in the output tab if you select the `Salesforce Query Editor` option.

<!-- COMMANDS_START -->
## Commands (2)

|Command|Description|
|-|-|
|SFDX.openSalesforceQueryEditor|SFDX: Open Salesforce Query Editor|
|SFDX.openSalesforceQueryEditorNotifications|SFDX: Open Salesforce Query Editor Notifications|
<!-- COMMANDS_END -->

<!-- SETTINGS_START -->
## Settings (13)

|Setting|Type|Default|Description|
|-|-|-|-|
|salesforceQueryEditor.displayQueryBuilder|boolean|**true**|If checked, the Query Builder is displayed.|
|salesforceQueryEditor.displayHelpButton|boolean|**true**|If checked, the floating Help Button is displayed.|
|salesforceQueryEditor.format.automatically|boolean|**false**|If checked, the query is formatted automatically when created using the query builder.|
|salesforceQueryEditor.fieldType.form|boolean|**false**|If checked, the field type is displayed in the field selector.|
|salesforceQueryEditor.fieldType.table|boolean|**false**|If checked, the field type is displayed in the table's header.|
|salesforceQueryEditor.field.required|boolean|**true**|If checked, an icon appears to the right of the field label in the list of available felds to indicate that it is Required.|
|salesforceQueryEditor.field.updateable|boolean|**true**|If checked, an icon appears to the right of the field label in the list of available felds to indicate that it is Updateable.|
|salesforceQueryEditor.nestedResults.style|boolean|**false**|If checked, it applies styles to nested results. This feature makes everything slow when quering a lot of records and columns, so use it with care. Also, be aware that the Theme Colors you are using will not be applied because the VSCode API does not provide a way to programatically access it.|
|salesforceQueryEditor.nestedResults.expanded|boolean|**true**|If checked, nested results are expanded.|
|salesforceQueryEditor.nestedResults.depth|number|**1**|It determines how many levels nested results shown as JSON will be expanded.|
|salesforceQueryEditor.setQueryOnClick|boolean|**false**|If checked, the query is copied automatically to the editor.|
|salesforceQueryEditor.queryOnClick|boolean|**false**|If checked, the query is executed automatically when you click on it. It is necessary to set 'setQueryOnClick' to true.|
|salesforceQueryEditor.displayTabs|boolean|**false**|If checked, tabs are displayed when 'windowMode' is false.|
<!-- SETTINGS_END -->

# How to Use

<b>IMPORTANT</b> Set a "defaultusername" before opening the extension. <b>IMPORTANT</b>

## How to open the Salesforce Query Editor

There are three ways to open the editor.

### Using the File Explorer Context

In the file explorer, click with the right button on any Apex class to see the option `SFDX: Salesforce Query Editor` in the Menu.

<img src="https://drive.google.com/uc?id=1NBojOlso0-dV3bVkMNjXYD9mQIu2Jcrd"></img>

### Using the Editor Context

Open an Apex class and click with the right button anywhere in the editor context to see the option `SFDX: Salesforce Query Editor` in the Menu.

<img src="https://drive.google.com/uc?id=1p5ZsFUWKHPjVFR4O1647FCWxnnFYo4S2"></img>

### Using the Editor Navigation Context

Open an Apex class and click on the button shown in the image below. This button only appears when editing Apex classes.

<img src="https://drive.google.com/uc?id=1oVTJ7KUdljVN_qZ-NaOUVRqolE74PJQS"></img>


## How to add a query, or updated it, in the Apex Class without copy and paste

- Open an Apex Class

- Open the Salesforce Query editor extension

- Create/Write your query

- Click anywhere in the Apex class to set the cursor/anchor where you want to place the query.

- If the cursor/anchor is anywhere inside a soql query (inside the `[]`), the `Update Apex` button appears. Use it to quickly update queries without having to copy and paste.

- If the cursor/anchor is anywhere else in the class, the `Add to Apex` button appears. Use it to quickly place new queries, for instance, in for loops.

## How to perform CRUD Operations

- Query an Id field and at least one `updateable` field to show a table in edit mode and the delete button.

- Every table cell is in edit mode by default when you query the Id and one `updateable` field. 

- If you want to discard all of your changes for a record, click on the `cancel` button or click anywhere in that row and then press `ESC` key.

- If you want to discard all changes of every record, click on the `cancel` button that is on the top right corner of the table.

- To create a new record click on the `New Record` button that is on the top right corner of the table.

- If all the changes you did for that record are saved without any errors, the record changes back to read mode and the `cancel` button vanishes. If the changes are not accepted by Salesforce, a modal appears with detailed informatiion about what went wrong, and the record stays on edit state. You can choose to fix the errors or cancel the changes.

## How to add fields

To add fields you can either drag and drop them, or click twice on a field in case you get tired of using the first approach

<img src="https://drive.google.com/uc?id=1da7Le6LmnWZSKxyYPGeymm_KHm6o70ys" width="800px"></img>

You can also use the `Add All` button to add all the fields of the current selected SObject or Child Relationship

## How to remove fields

To quickly remove a field, click on the field with the right mouse button. Or you click on the field with the left mouse button, and then select the `bin` icon on the top left side of the field menu.

If you click on the `Clear All` button that is to the left of the `Add All` button, you will remove all the fields for the current selected SObject or Child Relationship.

If you click on the `Clear All` that is above the area to drop fields, it will clear all the fields.

## How to add child relationship fields

<img src="https://drive.google.com/uc?id=1YUfVu-DD6JMrRRgwXsxmurKiYC-UNpVB" width="800px"></img>

## How to add filters

You can add filters by clicking on a field:

<img src="https://drive.google.com/uc?id=1I-h8LgE7IUs_HwHT5in-fHUZhRTIAzLm" width="800px"></img>

## How to add Date Literals

Date literals can be added on any `datetime` field.

<img src="https://drive.google.com/uc?id=1AitCIziFnk1yDAN1nbBNAc6rFTcKx_Wj" width="800px"></img>

## How to add ORDER BY

<img src="https://drive.google.com/uc?id=1H1-HwU1M4N5gEmlvl6_aXcIY6gSva67B" width="800px"></img>

## How to add LIMIT and OFFSET

<img src="https://drive.google.com/uc?id=1tinX7YFzdFWn7a0uE2WgM5mqIAoFMiE3" width="800px"></img>

## How to add FOR VIEW, FOR UPDATE, FOR REFERENCE, ALL ROWS

These keywords only work on Apex Classes and you can add them using the query builder, but they will only appear once you've added the query on the apex class. This only works with the buttons `Add to Apex` and `Update Apex`, which are only available for paid users.

## How to display the field type

You can configure the extension to show the field type in the query builder and also in the table

### Query builder

<img src="https://drive.google.com/uc?id=1-MlWgs_kSw_5P5OD4tpkCwjFYgH1nguo" width="800px"></img>

### Table

<img src="https://drive.google.com/uc?id=17twZSAf_nKctgUI2jf4tR2cVNBIKM6WG" width="800px"></img>


## How to display Required and Updateable fields

When users are editing data, it is good to know if the field is updateable and required before doing any changes. So, by default, these two options are already enabled. But you can choose to turn it off if you don't like it.

<img src="https://drive.google.com/uc?id=14b3XQXY79ra2343niDbG5Is17YKqDyRf" width="800px"></img>


## Settings

The extension has some settings that you can use to have a personalized experience. To access those settings, go to File -> Preferences -> Settings, and search for "Salesforce Query Editor".

<img src="https://drive.google.com/uc?id=1oMMG_bywCs-EVHEHHoXUe7R6TtYIibwE" width="1000px"></img>


## Shortcuts

- `ctrl + shift + o` to refresh the objects for the selected environment

- `ctrl + shift + e` to refresh the Environments list

- `ctrl + shift + q` to execute the Query

- `ctrl + shift + t` to expand the table

- `ctrl + shift + s` to save the table changes

- `ctrl + shift + c` to cancel all the table changes

- `ctrl + shift + d` to export data as source tree