 

# COVID-19 Guardian Angel

With the help of data gathered from the user's wearable device this application aims to give a non diagnostic prediction on whether the user may have COVID-19 or not.

---

# Terms and Conditions Screen

The data which is displayed in this screen is as per medical guidelines which the user has to accept in order to gain access to the rest of the application.

---

# BMI Screen

### NPM Packages

- @react-navigation

- react-native-extended-stylesheet

- react-native-vector-icons

- @react-native-community/async-storage

- react-native-simple-dialogs

---

### Methods

##### handleWtBox()

    Sets the entered user weight to the variable userWeight in async storage.

##### handleHtBox()

    Sets the entered user height to the variable userHeight in async storage.

##### validate()

    Used to check if the user pressed ok skip for the first time.  If user presses skip for the first time a warning message shows up else the application navigates into the next screen.

---

### State

##### isMissingInfoWarn

    This state deals with the missing information warning dialog box. It has True or False as values for displaying or not displaying the dialog boxes respectively.

---

# Age Screen

### NPM Packages

- react-native-extended-stylesheet

- react-native-vector-icons

- @react-native-community/async-storage

- react-native-modal-datetime-picker

- react-native-simple-dialogs

---

### Methods

##### getAge()

    Used to convert date of birth into age.

##### showDatePicker()

    Used to set the datePickerVisible state to true.

##### hideDatePicker()

    Used to set the datePickerVisble state to false.

##### handleConfirm()

    Used to set user age and user date of birth to the variables userFullDob and userDOB in async storage respectively.

##### validate()

    Used to check if the user pressed ok skip for the first time. If user presses skip for the first time a warning message shows up else the application navigates into the next screen.

---

### State

##### isDobData

    This state is used to store the user's age.

##### isDatePickerVisible

    This state is used to make the date picker pop up when the user decides to change their date of birth. Date picker appears when state is set to true and disappears when false.

##### isDate

    This state contains a placeholder and will contain the user's date of birth when the user chooses one.

##### isMissingInfoWarn

    This state deals with the missing information warning dialog box. It has True or False as values for displaying or not displaying the dialog boxes respectively.

---

# Race Screen

### NPM Packages

- @react-navigation

- react-native-extended-stylesheet

- react-native-vector-icons

- @react-native-community/async-storage

- react-native-dropdown-picker

- @react-native-community/checkbox

- react-native-simple-dialogs

---

### Methods

##### handleracebox()

    Sets the selected race to the variable userRace in async storage.

##### handlegenbox()

    Sets the selected gender to the variable userGender in async storage.

##### handleEthini()

    Sets the variable userEthini in async storage based on whether the hispanic or latino checkbox is selected or not.

##### validate()

Used to check if the user pressed ok skip for the first time. If user presses skip for the first time a warning message shows up else the application navigates into the next screen.

---

### State

##### toggleCheckBox

    This state is used to toggle the Hispanic or Latino checkbox.

True - User is hispanic or latino.

False - User is not hispanic or latino.

##### isMissingInfoWarn

    This state deals with the missing information warning dialog box. It has True or False as values for displaying or not displaying the dialog boxes respectively.

---

# Home Screen

### NPM Packages

- react-native-vector-icons

- react-native-extended-stylesheet

- @react-native-community/async-storage

- axios

- react-native-app-auth

- @react-native-community/google-signin

- react-native-simple-dialogs

---

### Methods

##### OAuth_Fitbit()

    Used to help log into the user's Fitbit account and also stores the access token and refresh token in the async storage.

##### refresh_Fitbit(refreshToken)

    This function is used to refresh the access token.

##### OAuth_Fitbit_logout()

    This function is used to logout from the Fitbit account.

##### oAuth_Google()

    Used to help log into the user's Google Fit account and also stores the access token in the async storage.

##### getFitbitData()

    Fetches user accessToken and refreshToken from their Fitbit account and also calls the refresh_Fitbit() function.

##### getData()

    Fetches user accessToken from their Google Fit account.

##### refreshData()

    Used to retrieve latest accessToken to avoid using expired accessToken.

##### _onFitbit()

    This function is used to call OAuth_Fitbit() and change the states fitbitName and fitbit_accesstoken.

##### _onGoogleFit()

    Used to log into the user's Google Fit account and change the states googleFitName and google_accesstoken.

##### _onFormData()

    This function is used to call the modal that shows the terms and conditions.

##### dataChecker()

    Used to check if all the recommended user data in the onboarding screen is provided, else it displays a pop up dialog warning users about the potential problem that arises with not giving the data.

---

### State

##### googleFitName

    This state is used to prompt the user about their Google Fit login status.

Logged out - "Connect to Google Fit"

Logged in - "Disconnect from Google Fit"

##### fitbitName

    This state is used to prompt the user about their Fitbit tracker login status.

Logged out - "Connect to a Fitbit Tracker"

Logged in - "Disconnect from a Fitbit Tracker"

##### fitbit_accesstoken

    This state contains the Fitbit access token.

##### google_accesstoken

    This state contains the Google Fit access token.

##### infodialogVisible

    This state deals with the info dialog box.

##### aboutAppDialogVisible

    This state deals with the about application dialog box.

##### termsandcondition

    This state deals with the Terms and Conditions dialog box.

##### missingInfoWarn

    This state deals with the missing information warning dialog box.

> The dialog box states mentioned above have True or False as values for displaying or not displaying the dialog boxes respectively. 

---

# Profile Screen

### NPM Packages

- react-native-extended-stylesheet

- @react-native-community/async-storage

---

### Methods

##### getData()

    Fetches all the necessary user data for profile screen from async storage.

---

### State

##### height

    User's height is retrieved from async storage and is stored in this state.

##### weight

    User's weight is retrieved from async storage and is stored in this state.

##### dob

    User's date of birth is retrieved from async storage and is stored in this state.

##### gen

    User's gender is retrieved from async storage and is stored in this state.

##### race

    User's race is retrieved from async storage and is stored in this state.

##### ethini

    User's ethnicity is retrieved from async storage and is stored in this state.

---

# Edit Profile Screen

### NPM Packages

- @react-navigation/native

- react-native-extended-stylesheet

- @react-native-community/async-storage

- react-native-modal-datetime-picker

- react-native-dropdown-picker

- @react-native-community/checkbox

---

### Methods

##### gtData()

    Retrieves all the details user provided on the onboarding screen from async storage.

##### setData()

   Updates the respective variables in async storage using the data provided in the screen.

---

### State

##### height

    The updated height is stored in this state.

##### heighted

    The height if already provided by the user will be stored in this state to provide a placeholder for the field asking to enter new height.

##### weight

    The updated height is stored in this state.

##### weighted

    The weight if already provided by the user will be stored in this state to provide a placeholder for the field asking to enter new weight.

##### gender

    The updated gender is stored in this state.

##### gendered

    The gender if already provided by the user will be stored in this state to provide a placeholder for the field asking to select gender.

##### race

    The updated race is stored in this state.

##### raceEd

    The race if already provided by the user will be stored in this state to provide a placeholder for the field asking to select race.

##### isDate

    The updated date of birth is stored in this state.

##### isEdDate

    The date of birth if already provided by the user will be stored in this state to provide a placeholder for the field asking to provide date of birth.

##### isDatePickerVisible

    This state is used to make the date picker pop up when the user decides to change their date of birth. Date picker appears when state is set to true and disappears when false.

##### toggleCheckBox

    This state is used to toggle the Hispanic or Latino checkbox.

    True - User is hispanic or latino.

    False - User is not hispanic or latino.

---

# Assessment Screen

### NPM Packages

- react-native-extended-stylesheet

- react-native-vector-icons

- @react-native-community/async-storage

---

### Methods

##### getData()

Retrieves age and gender from async storage.

##### setData()

Sets the variable “prob” in async storage with the probability of the user having COVID-19 based on the symptoms selected.

---

### State

##### lst

    State used to control the “loss of smell and taste” selection and also used as a value in the formula that derives the probability of having COVID-19.

False - No loss of smell and taste *

True - Loss of smell and taste *

##### la

    State used to control the “Loss of appetite” selection and also used as a value in the formula that derives the probability of having COVID-19.

False - No loss of appetite *

True - Loss of appetite *

##### pc

    State used to control the “Persistent Cough” selection and also used as a value in the formula that derives the probability of having COVID-19.

False - No persistent cough *

True - Have persistent cough  *

##### sf

    State used to control the “Severe Fatigue” selection and also used as a value in the formula that derives the probability of having COVID-19.

False - No severe fatigue *

True - Have severe fatigue *

##### sb

    State used to control the “Shortness of Breath” selection and also used as a value in the formula that derives the probability of having COVID-19.

False - No shortness of breath *

True - Have shortness of breath *

##### fever

    State used to control the “Fever” selection and also used as a value in the formula that derives the probability of having COVID-19.

False - No fever *

True - Have fever *

##### diarr

    State used to control the “Diarrhoea” selection and also used as a value in the formula that derives the probability of having COVID-19.

False - No diarrhoea *

True - Have diarrhoea *

> *The above states are converted to 0 and 1 respectively for False and True states when used in the probability formula.

##### bglst

    State used to control the background color of the “Loss of smell and taste” selection.*

##### bgla

    State used to control the background color of the “Loss of appetite” selection.*

##### bgpc

    State used to control the background color of the “Persistent Cough” selection.*

##### bgsf

    State used to control the background color of the “Severe Fatigue” selection.*

##### bgsb

    State used to control the background color of the “Shortness of Breath” selection.*

##### bgfev

    State used to control the background color of the “fever” selection.*

##### bgdiarr

    State used to control the background color of the “Diarrhoea” selection.*

> *Possible State Values
> 
> Unselected Background Color - #ffcc80 (Light Orange) 
> 
> Selected Background Color - #ca9b52 (Light Orange Dark)

##### oplst

    State used to control opacity of a tick icon based on "Loss of smell and taste" selection.*

##### opla

    State used to control opacity of a tick icon based on "Loss of appetite" selection.*

##### oppc

    State used to control opacity of a tick icon based on "Persistent Cough" selection.*

##### opsf

    State used to control opacity of a tick icon based on "Severe Fatigue" selection.*

##### opsb

    State used to control opacity of a tick icon based on "Shortness of Breath" selection.*

##### opfev

    State used to control opacity of a tick icon based on "Fever" selection.*

##### opdiarr

    State used to control opacity of a tick icon based on "Diarrhoea" selection.*

> *Possible State Values
> 
> Unselected Opacity  - 0
> 
> Selected Opacity - 1

##### age

    Integer value of the user's age.

##### gender

    The user's age where 0 and 1 represent female and male respectively.

---

# Vital Screen

### NPM Packages

- react-native-extended-stylesheet

- @react-native-community/async-storage

- react-native-vector-icons

- @tensorflow

- axios

---

### Methods

##### getData()

    Used to fetch Fitbit access token, Google Fit access token, gender, race, ethnicity and age of the user.

##### heartRateData()

    Used to fetch the user's heart rate data from Google Fit account.

##### fitbitData()

    This function makes the API call to the user's Fitbit heart rate data.

##### handleOxygenbox(String)

       Sets oxy state variable to the oxygen saturation value provided by the user. 

##### handleHRbox(String)

    Sets hr state variable to the oxygen saturation value provided by the user.

##### handleRRbox(String)

    Sets res_r state variable to the oxygen saturation value provided by the user.

##### handleTempbox(String)

    Sets b_tmp state variable to the oxygen saturation value provided by the user.

##### handleDBPbox(String)

    Sets dbp state variable to the oxygen saturation value provided by the user.

##### handleSBPbox(String)

    Sets sbp state variable to the oxygen saturation value provided by the user.

##### getCovidPrediction()

    This function contains the COVID-19 vs No COVID-19 model.

##### getInfluenzaPrediction()

    This function contains the Influenza vs No Influenza model.

##### getCovidInfluPrediction()

    This function contains the Influenza vs COVID-19 model.

##### getCovidTest()

    Used to get the final prediction based on Covid-19 and Influenza probabilities.

##### updateData()

    Used to set the state variables that are used in the prediction model and also call the getCovidTest() function.

---

### State

##### oxy

    The entered/detected oxygen saturation value is stored in this state.

##### dbp

    The entered/detected diastolic blood pressure value is stored in this state.

##### sbp

    The entered/detected systolic blood pressure value is stored in this state.

##### hr

    The entered/detected heart rate value is stored in this state.

##### res_r

    The entered/detected respiratory rate value is stored in this state.

##### b_tmp

    The entered/detected body temperature value is stored in this state.

##### sex

    This state is set as 0 and 1 for female and male respectively.

##### white

    This state is set to 1 when user selects race as white on onboarding screen else is set to 0.

##### black

    This state is set to 1 when user selects race as black on onboarding screen else is set to 0.

##### others

    This state is set to 1 when user selects race as others on onboarding screen else is set to 0.

##### ethini

    This state is set to 1 if the user selects ethnicity as hispanic or latino in the onboarding screen else is set to 0. 

##### age

  This state is set with the  user's age.

##### google_token

    This state contains the Google Fit access token.

##### fitbit_token

    This state contains the Fitbit access token.

##### startDate

    This state holds the start date in nanoseconds for a Google Fit API call.

##### endDate

    This state holds the end date in nanoseconds for a Google Fit API call.

##### hrplaceholder

    This state contains the heart rate data if any is present from Google Fit.

##### hreditable

    This state is used to disable the heart rate text input field if heart rate is present.

##### ethiniDetails

    This state is true if user has provided ethinicity data else is set to false.

##### genData

    The user gender data is retrieved from async storage and is stored in this state.

##### genDetails

    This state is true if user has provided gender data else is set to false.

##### raceData

     The user race data is retrieved from async storage and is stored in this state.

##### raceDetails

    This state is true if user has provided race data else is set to false.

##### ageData

    This state is set to the user age stored in async storage.

##### ageDetails

    This state is true if user has provided date of birth else is set to false.

##### fitbitStartDate

    This state holds the start date in nanoseconds for a Fitbit API call.

##### fitbitEndDate

    This state holds the start date in nanoseconds for a Fitbit API call.

---

# Covid Screen

    This screen displays a result saying that a person might have COVID-19.

---

# Influ Screen

    This screen displays a result saying that a person might have influenza.

---

# Safe Screen

    This screen displays a result saying that a person is safe.

---

There are  disclaimers and information displayed for user knowledge in all of the screens as necessary
