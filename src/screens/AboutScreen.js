import React                    from 'react'
import { StyleSheet, Text, View,
}                               from 'react-native'
//
import WebLink                  from '../components/WebLink'

const AboutScreen = () => (
  <View style={[styles.container]}>
    <Text style={styles.aboutText}>
      A Demo App from the
    </Text>
    <WebLink style={styles.aboutText} url="https://tooksome.com/">
      Tooksome
    </WebLink>
    <Text style={styles.aboutText}>
      Team
    </Text>
    <Text style={styles.aboutText}>
      Lexy-Bee Version: 1.0.7
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    alignItems:     'center',
    paddingTop: 15,
  },
  aboutText: {
    fontSize: 24,
  },
})

export default AboutScreen
