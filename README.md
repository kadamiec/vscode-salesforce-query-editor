# Salesforce Query Editor

<p><a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/version/allanoricil.salesforce-soql-editor.svg?style=for-the-badge&colorA=252526&colorB=43A047&label=VERSION" alt="Version"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/downloads/allanoricil.salesforce-soql-editor.svg?style=for-the-badge&colorA=252526&colorB=43A047&label=DOWNLOADS" alt="Downloads"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor" target="_blank" rel="noreferrer noopener"><img src="https://vsmarketplacebadge.apphb.com/rating-star/allanoricil.salesforce-soql-editor.svg?style=for-the-badge&colorA=252526&colorB=43A047&label=RATING" alt="Ratings"></a></p>

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
- [ ] Query Storage and History.
- [ ] Reorder Fields alphabetically.
- [ ] Aggregated functions.
- [ ] Group By.
- [ ] Having.
- [ ] Portuguese (PT-BR).
- [ ] Tooling API.
- [ ] SOSL.

## Paid Features

- [x] Remove BUY PRO golden button.
- [x] Window Mode.
- [x] Desktop App (PWA).
- [x] Quickly update or add a new Query to apex using `Add to Apex` and `Update Apex` buttons.
- [x] Run multiple queries in different tabs.

I'm also selling the source code. If you are interested, send an email to allanoricilcos@outlook.com

## Requirements

- sfdx-cli/7.93.1-762bca056d
- VS Code 1.54.3 -> To update your vscode go to Help -> then click on Check for Updates / Restart to Update
- MUST BE USED FROM A SFDX PROJECT
- YOU MUST NOT HAVE ANYTHING RUNNING ON PORT 5000

## Issues

You can open issues here https://github.com/AllanOricil/SOQL-Editor-Issues


# How To Buy a License

- Open the extension

- Click on the Buy Pro golden button

- It will open a page where you can see the available premium features

- Scroll down to the bottom of the page and click on the Buy Licenses button

- You will be redirected to the Subscription page. If it does not pick up your login credentials, it will ask you to login again. This is necessary because the Subscription and the Licenses are connected to an Account.

- Choose your Subscription Plan and the number of licenses you want to acquire. Each license can only be activated in one machine.

- Add your Debit or Credit Card Details.

- Click on the Pay button and wait for the Success message.

- After that you should receive an email with the license keys and instructions on how to activate a license.

- Inside the app, one the account page you can manage all your subscriptions and licenses. You can choose to cancel your subscription, and activate/deactivate licenses.

Obs: The payment system is implemented using Stripe Elements. You can read more about it here https://stripe.com/en-ie/payments/elements


# How to Use

Obs: set a "defaultusername" before opening the extension.

## How to open the Salesforce Query Editor

There are three ways to open the editor.

### File Explorer Context

In the file explorer, click with the right button on any Apex class to see the option `SFDX: SOQL Editor` in the Menu.

<img src="https://drive.google.com/uc?id=1hPfBf8Rzap7K9dQf8I92Kf_43yHIeU9A"></img>

### Editor Context

Open an Apex class and click with the right button anywhere in the editor context to see the option `SFDX: SOQL Editor` in the Menu.

<img src="https://drive.google.com/uc?id=16WGijV7hT6dcz99xIDtYe3NsJnxP4nR9"></img>

### Editor Navigation Context

Open an Apex class and click on the button shown in the image below. This button only appears when editing Apex classes.

<img src="https://drive.google.com/uc?id=1ufLB1_TdaZDku6sSU-OdKHehX-CeHSi3"></img>


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

## How to Open Window Mode

 - File -> Preferences -> Settings
 - Type SOQL in the search bar
 - Look for Window Mode and click on the checkbox

 Now every time you open the extension, using any of the three methods listed above, it will be opened in a separate window. This way users that have multiple monitors can  have a better experience while developing as the extension will not take any space of their editor.

<img src="https://drive.google.com/uc?id=1eIEREuMLkpb6hXx223vypc--RyVbAddR" width="800px"></img>

## How to Install the App

### Google Chrome

<img src="https://drive.google.com/uc?id=1jPBrBzny6dXNe_r3QjvFt5Mg7kfuNFEq" width="1000px"></img>


### Microsoft Edge (Chromium Version)

<img src="https://drive.google.com/uc?id=19lDJqMu2fSVK22VtMd5ZjM_6iQlFTzT6" width="1000px"></img>

### Safari

Safari also has PWA features available. I just don't have a machine to show how to install it. If anybody could do it and then send an e-mail to me, that would be much appreciated.

### Opera

Opera does not support PWA features yet.

### Firefox

Mozilla has no plans for PWA features. But why are you using Firefox? You should change to any of the Chromium based browsers.


## Settings

The extension has some settings that you can use to have a personalized experience. To access those settings, go to File -> Preferences -> Settings, and search for "Soql".

<img src="https://drive.google.com/uc?id=1oMMG_bywCs-EVHEHHoXUe7R6TtYIibwE" width="1000px"></img>


## Shortcuts

- `ctrl + shift + o` to refresh the objects for the selected environment

- `ctrl + shift + e` to refresh the Environments list

- `ctrl + shift + q` to execute the Query

- `ctrl + shift + t` to expand the table

- `ctrl + shift + s` to save the table changes

- `ctrl + shift + c` to cancel all the table changes

- `ctrl + shift + d` to export data as source tree


## Release Notes

### 1.1.0

- Now you can use the extension with Gitpod - https://www.gitpod.io/

- Fix "Display Query Builder" setting.

### 1.0.0

- The extension is now called Salesforce Query Editor as it brings the same functionality available in the Query Editor tab in the developer console.

- Fully refactored using Nuxt JS.

- Enables Window Mode and PWA App.

- Enables Window Mode.

- Improves Records Table.

- Add Update Apex Button.

- Enables Child Relationship queries.

- Adds Date Time Literals for DateTime fields when configuring filters.

- Adds `FOR UPDATE`, `FOR VIEW`, `FOR REFERENCE`, `ALL ROWS`. Only available when using `Add to Apex` or `Update Apex` buttons.

- Adds `Copy` button to copy the query to clipboard.

- It now uses the Monaco Editor for the Query Editor.

- Improves the looking and feel by adding support to many vscode themes. Now the Query Editor text also changes between a Light and Dark color when changing themes.

- Now it shows Field Details.

- Now the user can quickly change between the orgs connected to `SFDX`.

- Now it uses the Composition API to bundle together 20 requests to the Database.

- The App also changes its colors when the user chooses a new theme in VS Code.

### 0.10.0

- It introduces the "Add All" and "Clear All" buttons on the relationship fields modal. This enables users to quickly pick up all the fields of a certain relationship instead of adding one by one. If the user clicks on "Add All" it will add all the fields shown in the last displayed picklist.

<img src="https://drive.google.com/uc?id=1GSqK2J7cSD8kpLf1My2VhO8jjN5i0GO5" width="800px"></img>

- It adds the Offset input.

<img src="https://drive.google.com/uc?id=1DnWQJbr0nQvJucrlLRsbcGTA6Uou2nUx" width="400px"></img>

- It changes the name of the commit changes button to "save".
- It adds new input types on the soql results table when the user is edditing a record. Now when the user queries a picklist field, the table displays a picklist selector with only the <b>"active"</b> picklist <b>"labels"</b>. And when the user queries a boolean field, the table displays a checkbox input.

<img src="https://drive.google.com/uc?id=1BNXHBD4qbOtKGTIzkxwU4ptuP_y7VF5M" width="800px"></img>
 
- It enables the Delete Record button.
- It adds the number of results retrieved in the top left corner of the results table.

<img src="https://drive.google.com/uc?id=1jTCwLat_ZbA0NlB2eJvfF1TCeW4clm1f" width="800px"></img>

- It turns the Auto Format SOQL checkbox into a VSCode workspace/user property.

<img src="https://drive.google.com/uc?id=12TY_uO1_qMYmQQf4Y0BoMe16-zEoo7m_" width="800px"></img>

- It automatically translates the relationship fields picklists container to the left for every new level the user selects.

- It improves output messages. 

- It adds shortcut keys for the refresh objects and hide/show form buttons. To use these shortcuts it is necessary to focus on the SOQL Editor.
  
  <b>CTRL + R</b>: Refresh the SObjects list

  <b>CTRL + H</b>: Hide/Show the form

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


