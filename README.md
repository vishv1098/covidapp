# Smart-App-Covid
Smart app covid detector
***
***

### User Story
***

## Splash screen

**As a user** I don't want any sign-up screen nor the login screen to the app.

**So that** I need not remember multiple passwords of different applications.

**Acceptance criteria** The user can go to Home screen directly after the app get loaded.

***

## Home screen

**As a user** I want the following features :
1. I want a search bar on the top of the screen.
2. I want a Carousel screen below the search bar.
3. I want cards below the Carousel screen in the home screen.
4. I want a graph view below all the data cards.

**So that**
1. I can search for the date to view my heart rate, step count and all the other vital's data.
2. I can scroll all the tabs in the Carousel screen and tap on the tabs to view the data for the past one week from the present date.
3. I can see all the health related data clearly.
4. I can see my heart rate variation on that day in the graph.

**Acceptance criteria**
1. Onces the user grant the permission to view their data from the fitbit and google fit in the device screen then the data will be displayed in the home screen otherwise it will display the text as "Grant permission to read your data in the device screen".
2. The entire data will be segregated and displayed on the home screen daywise.

***

## Device screen

**As a user** I want the following features :
1. I want the device name with symbol.
2. I want two seperated sections in the device screen.
3. I want a pop up screen at the bottom of the screen.
4. I want a button beside the device name.

**So that**
1. I can clearly distinguish the device I am using and allow the app(Smart app) to read the data from that device.
2. I can see all the devices that are connected and the data in sync with the Smart app, also the devices that are connected but the data not in sync with the Smart app in a seperate section.
3. I can see all the devices from which the app(Smart app) can read for the data.
4. So that I can disconnect the device from the Smart app when ever I want.

**Acceptance criteria**
1. The user can tap on the "+" symbol which is present at the bottom of the device screen and then tap on the device name which he or she want to connect and then after authentication in the device screen the user will be able to screen the device name within the section connected devices.
2. The user will also be able to see the button beside the device name so that he/she can disconnect the device from the mobile app.

***

## Assessment screen

**As a user** I want the following features :
1. I want a small button.
2. I want a link at the bottom of the page.

**So that**
1. I can tap on the button to test whether I am having covid or influenza.
2. If I want to enter the vital data manually then I can go the page via that link and enter the values to test the result.


**As a developer** I want three colors (red, green, yellow) below the button.

**So that** Based on result from the model I can display the status that if the result was likely to be covid then the red color will be highlighted, if the result was likely to be influenza then the yellow light will be highlighted and if the result was neither covid nor influenza then the green light will be highlighted.

**Acceptance criteria**
The user can tap on the button to see the results.

***



