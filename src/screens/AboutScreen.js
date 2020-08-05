import React                    from 'react'
import { StyleSheet, Text, View,
}                               from 'react-native'
//
import { TableDump }            from '../components/Containers'
import WebLink                  from '../components/WebLink'
import NytStats                 from '../../data/nyt_stats.json'
import Secrets                  from '../../Secrets.js'

const AboutScreen = () => (
  <View>
    <View style={[styles.centered]}>
      <Text style={styles.aboutText}>
        A Demo App from the
      </Text>
      <WebLink style={styles.aboutText} url="https://tookstock.com/">
        Tookstock
      </WebLink>
      <Text style={styles.aboutText}>
        Team
      </Text>
      <Text style={styles.aboutText}>
        Lexy-Bee Version: 1.0.9
      </Text>
    </View>
    <TableDump obj={NytStats} title="Stats" />
    <Text style={styles.monoText}>
      {Secrets.graphql_api}
    </Text>

  </View>
)

const styles = StyleSheet.create({
  centered: {
    backgroundColor:    '#fafafa',
    alignItems:         'center',
    paddingTop:         15,
  },
  aboutText: {
    fontSize: 24,
  },
  monoText: {
    fontFamily:                 'space-mono',
    fontSize:                   14,
    paddingVertical:            16,
  }
})

export default AboutScreen
