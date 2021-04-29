<img src="https://user-images.githubusercontent.com/45042522/116437412-b8b8d080-a84d-11eb-81b6-1c09274bae56.jpg" width="13%"></img> <img src="https://user-images.githubusercontent.com/45042522/116437433-bce4ee00-a84d-11eb-8295-5b90d5c51115.jpg" width="13%"></img> <img src="https://user-images.githubusercontent.com/45042522/116437445-beaeb180-a84d-11eb-9323-f4a5aa97010a.jpg" width="13%"></img> <img src="https://user-images.githubusercontent.com/45042522/116437450-c0787500-a84d-11eb-8f73-374e8aeccd73.jpg" width="13%"></img> <img src="https://user-images.githubusercontent.com/45042522/116437474-c4a49280-a84d-11eb-8994-320b75248a4d.jpg" width="13%"></img> <img src="https://user-images.githubusercontent.com/45042522/116437482-c706ec80-a84d-11eb-8334-1a761d7a38be.jpg" width="13%"></img> <img src="https://user-images.githubusercontent.com/45042522/116437489-c8381980-a84d-11eb-96ab-ab15eba8c4f3.jpg" width="13%"></img> 
# Weather Report App

Application is built in React Native v0.63.4

Tested on Android 9 and 11.

Requires backend to be running.
Can be found in /backend folder.
DB runs on postgresql, the schemas are included, with some dummy data.

requires Expo: https://docs.expo.io/


install the dependecies: `npm install`

to start the app: `expo start`

running on a physical device is recommended, emulators do not support the Expo Camera

you can register or use these accounts:

username: `lubko` password: `lubko`

username: `demo` password: `demodemo`

Core funcionalities:
 - can perform CRUD operations (submit report, display report, edit report and delete report)
 - can operate with binary files(taking a picture and uploading it, also displaying as a preview)
 - has 7 screens total (without login, register and splash screen)
 - communicates with the backend through HTTP calls with REST API principles
 - all UATs are tested and work as planned

How to use:

 1. Register for an account, you need a password longer than 6 characters, also your username has to contain only alpha characters, after registration you will be taken to the home screen of the app
 2. You have to allow access to location, otherwise the app wont let you submit new reports. This is the only functionality that does not work when location is not present.
 3. After succesful localization by the app, you can browse the app and the reports it contains, you can see each report's details by clicking on the icon on the map (sun, cloud, or rain)
 4. This screen contains all the report's information, this information is only requested by the app from the backend on this screen, otherwise, when browsing the map, only basic info about the report is pulled.
 5. To create a report you need to pick a button "submit a report" on the main screen(with the map)
 6. The app automatically finds an approximate name for your location and submits it with the data you are about to enter now
 7. You have to choose a weather situation by clicking on a 'Pick a weather situation' button
 8. Description and photo is optional for submission, the photo is taken by an internal camera view, **that does not work on emulators** (Expo Camera).
 9. This data is submitted to the server and the app takes you to the main screen with the map.
 10. In the top left corner with the list icon, you can get to 'My Reports' screen, where you can edit or delete your reports.
 11. During editing the report you can change all of the parameters but the location, then the app sends a PUT request to the backend to change the report you were editing.
 12. The reports can be deleted with the delete button on the My reports screen, the app sends a DELETE request to the backend and updates the list with the fresh list of current user's reports 
 13. The app automatically updates the map on deletion or submission of new report.
 14. You can logout from the main screen with the button with the arrow and the doors.


