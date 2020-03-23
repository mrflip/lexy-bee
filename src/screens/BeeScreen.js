import React, { useState, useRef,
}                     from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView,
}                     from 'react-native'
import { Button,
}                          from 'react-native-elements'
import { useQuery, useMutation,
}                     from '@apollo/client'
import _              from 'lodash'
//
import WordLists      from '../components/WordLists'
import GuessInput     from '../components/GuessInput'
import Ops            from '../graphql/Ops'
import Bee            from '../lib/Bee'


const els = {}

const BeeScreenComp = ({ bee }) => {
  const [beePutMu]  = useMutation(Ops.bee_put_mu)

  const delGuess = (word) => {
    bee.delGuess(word)
    beePutMu({ variables: bee.serialize() })
  }

  const onAdd = ({ guess, el }) => {
    const sectionForGuess = bee.sectionForGuess(guess)
    // console.log(guess, bee.serialize(), sectionForGuess)
    try {
      el.scrollToLocation({ ...sectionForGuess, animated: false })
    } catch(err) {
      console.log(err)
    } 
  }

  return (
    <View style={styles.container}>
      <WordLists
        delGuess={delGuess}
        guesses={bee.guessesByScore()}
        nogos={bee.nogos}
        wordListRef={(el) => { els.wordList = el }}
      />
      <GuessInput bee={bee} onAdd={(params) => onAdd({ ...params, el: els.wordList })} />
      <View>
        <Text>
          {bee.summary('scr')}
        </Text>
        <Text>
          {bee.summary('nyt')}
        </Text>
      </View>
    </View>
  )
}

const BeeScreen = ({ navigation, route }) => {
  const { params = {} } = route
  const { letters } = params
  //
  const { loading, error, data } = useQuery(Ops.bee_get_qy, {
    variables: { letters }, pollInterval: 5000 })
  if (loading)         return <Text>Loading...</Text>
  if (error && !data)  return renderError({ error, navigation })
  if (!data)           return <Text>No Data</Text>
  if (!data.bee_get.success) {
    return renderError({ error: data.bee_get.message, navigation })
  }
  //
  const bee = Bee.from(data.bee_get.bee)
  navigation.setOptions({ title: bee.dispLtrs })
  // console.log(bee.serialize().guesses)
  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={16} behavior="height">
      <BeeScreenComp bee={bee} />
    </KeyboardAvoidingView>
  )
}

const renderError = ({ error, navigation }) => {
  console.log("Error in ListBees", JSON.stringify(error)) // eslint-disable-line
  return (
    <View style={styles.container}>
      <View>
        <Text>
          Error:
          {JSON.stringify(error)}
        </Text>
      </View>
      <Button
        title="Home"
        onPress={navigation.popToTop}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: '#FFF',
    alignItems:      'center',
    width:           '100%',
  },
})

export default BeeScreen
