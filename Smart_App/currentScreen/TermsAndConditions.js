
import React , { useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';



// const navigation = useNavigation();

const TermsAndConditions = () => {

  const navigation = useNavigation();

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const [accepted, setAccepted] = useState(false);

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //       accepted: false
  //   }
  // }

  return (
    <View style={styles.container}>
          <Text style={styles.title}>Terms and conditions</Text>
          <ScrollView 
          style={styles.tcContainer}
          onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                // this.setState({
                //     accepted: true
                // })
                setAccepted(true);
              }
            }}
          >
              <Text style={styles.tcP}>No advice</Text>
              {/* <Text style={styles.tcP}></Text> */}
                  <Text style={styles.tcL}>{'\u2022'} This app “Covid Guardian Angel” provides only information, is not medical or treatment advice and may not be treated as such by the user. As such, this App may not be relied upon for the purposes of medical diagnosis or as a recommendation for medical care or treatment. The information on this App is not a substitute for professional medical advice, diagnosis or treatment. All content, including text, graphics, images and information, contained on or available through this App is for general information purposes only.</Text>
                  {/* <Text style={styles.tcL}>{'\u2022'} This website uses cookies to monitor browsing preferences. If you do allow cookies to be used, the following personal information may be stored by us for use by third parties: [insert list of information].</Text>
                  <Text style={styles.tcL}>{'\u2022'} Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</Text>
                  <Text style={styles.tcL}>{'\u2022'} Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.</Text>
                  <Text style={styles.tcL}>{'\u2022'} This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</Text>
                  <Text style={styles.tcL}>{'\u2022'} All trademarks reproduced in this website, which are not the property of, or licensed to the operator, are acknowledged on the website.
Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.</Text>
                  <Text style={styles.tcL}>{'\u2022'} From time to time, this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).</Text>
                  <Text style={styles.tcL}>{'\u2022'} Your use of this website and any dispute arising out of such use of the website is subject to the laws of England, Northern Ireland, Scotland and Wales.</Text> */}
              <Text style={styles.tcP}>Professional Medical Advice and Assistance</Text>
                  <Text style={styles.tcL}>{'\u2022'} You are strongly encouraged to confirm any information obtained from or through this App with your physician or another professional healthcare provider and to review all information regarding any medical condition or treatment with your physician or other a professional healthcare provider.</Text>
                  <Text style={styles.tcP}>No Reliance</Text>
                  <Text style={styles.tcL}>{'\u2022'} YOU MUST NEVER RELY ON ANY INFORMATION OBTAINED USING THIS APP FOR ANY DIAGNOSIS OR RECOMMENDATION FOR MEDICAL TREATMENT. YOU MUST NEVER RELY ON THE INFORMATION RECEIVED FROM THIS APP AS ALTERNATIVE TO MEDICAL ADVICE FROM YOUR PHYSICIAN OR OTHER PROFESSIONAL HEALTHCARE PROVIDER.</Text>
              <Text style={styles.tcP}>YOU MUST NEVER DISREGARD PROFESSIONAL MEDICAL ADVICE OR DELAY SEEKING MEDICAL TREATMENT AS RESULT OF ANY INFORMATION YOU HAVE SEEN ON OR ACCESSED THROUGH THIS APP. IF YOU HAVE ANY SPECIFIC QUESTIONS ABOUT ANY MEDICAL MATTER YOU SHOULD CONSULT YOUR PHYSICIAN OR OTHER PROFESSIONAL HEALTHCARE PROVIDER. IF YOU THINK YOU MAY BE SUFFERING FROM ANY MEDICAL CONDITION YOU SHOULD SEEK IMMEDIATE MEDICAL ATTENTION.</Text>
              <Text style={styles.tcP}></Text>
              <Text style={styles.tcP}>By Accepting this you are agreeing to all the terms and conditions.</Text>
              <Text style={styles.tcP}></Text>
          </ScrollView>

          <TouchableOpacity disabled={ !accepted } onPress={ ()=>{alert("Terms and conditions accepted"); navigation.navigate('Home'); } } style={ accepted ? styles.button : styles.buttonDisabled }><Text style={styles.buttonLabel}>Accept</Text></TouchableOpacity>
    </View>
  );
}

const { width , height } = Dimensions.get('window');

const styles = {

  container:{
    marginTop: 80,
    marginLeft: 10,
    marginRight: 10
  },
  title: {
      fontSize: 29,
      alignSelf: 'center'
  },
  tcP: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: 17,
  },
  tcP:{
      marginTop: 10,
      fontSize: 17,
      fontWeight: 'bold'
  },
  tcL:{
      marginLeft: 10,
      marginTop: 10,
      marginBottom: 10,
      fontSize: 14
  },
  tcContainer: {
      marginTop: 15,
      marginBottom: 15,
      height: height * .7
  },

  button:{
      backgroundColor: '#136AC7',
      borderRadius: 5,
      padding: 10
  },

  buttonDisabled:{
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10
 },

  buttonLabel:{
      fontSize: 14,
      color: '#FFF',
      alignSelf: 'center'
  }

}

export default TermsAndConditions;

