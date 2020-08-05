import React, { useState }      from 'react'
import _                        from 'lodash'
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform,
}                               from 'react-native'
import { Button }               from 'react-native-elements'
import { useQuery, useMutation,
}                               from '@apollo/client'
//
import WordLists                from '../components/WordLists'
import GuessInput               from '../components/GuessInput'
import HintBar                  from '../components/HintBar'
import Ops                      from '../graphql/Ops'
import Bee                      from '../lib/Bee'

const els = {}

const BeeScreenComp = ({ bee, navigation }) => {
  const [beePutMu]          = useMutation(Ops.bee_put_mu)
  const [reveal,    setReveal]    = useState(0)
  const [showHints, setShowHints] = useState(false)
  const incReveal = React.useCallback(
    (inc) => setReveal((rr) => (_.clamp(rr + inc, 0, 15))),
  )
  const toggleHints = () => {
    setReveal(0)
    setShowHints((showH) => (! showH))
  }
  const resetGuesses = () => {
    bee.resetGuesses()
    beePutMu({ variables: bee.serialize() })
  }
  const delGuess = (word) => {
    bee.delGuess(word)
    beePutMu({ variables: bee.serialize() })
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HintBar
          reveal        = {reveal}
          incReveal     = {incReveal}
          showHints     = {showHints}
          toggleHints   = {toggleHints}
          doReset       = {resetGuesses}
        />
      ),
    })
  }, [navigation, reveal, setReveal, showHints, setShowHints])
  //

  const onAdd = ({ guess, el }) => {
    const sectionForGuess = bee.sectionForGuess(guess)
    // console.log(guess, bee.serialize(), sectionForGuess)
    try {
      el.scrollToLocation({ ...sectionForGuess, animated: false })
    } catch (err) {
      // console.log(err) // eslint-disable-line
    }
  }

  return (
    <View style={styles.container}>
      <WordLists
        delGuess    = {delGuess}
        guesses     = {bee.guessesByScore()}
        nogos       = {bee.nogos}
        hints       = {bee.hints}
        reveal      = {reveal}
        showHints   = {showHints}
        wordListRef = {(el) => { els.wordList = el }}
      />
      <GuessInput bee={bee} onAdd={(params) => onAdd({ ...params, el: els.wordList })} />
      <View style={styles.container}>
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

// Separated into two components to make updating easier to trace
const BeeScreen = ({ navigation, route }) => {
  const { params = {} } = route
  const { letters }     = params
  //
  const { loading, error, data } = useQuery(Ops.bee_get_qy, {
    variables: { letters }, pollInterval: 5000 })
  if (loading)         return <Text>Loading...</Text>
  if (error && ! data)  return renderError({ error, navigation })
  if (! data)           return <Text>No Data</Text>
  if (! data.bee_get.success) {
    return renderError({ error: data.bee_get.message, navigation })
  }
  //
  const bee = Bee.from(data.bee_get.bee)
  navigation.setOptions({ title: bee.dispLtrs })
  //
  const resetBee = () => (bee.resetGuesses())

  // console.log(bee)
  return (
    <KeyboardAvoidingView
      behavior                    = {Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset      = {25}
      style                       = {styles.container}
    >
      <BeeScreenComp bee={bee} navigation={navigation} />
    </KeyboardAvoidingView>
  )
}

const renderError = ({ error, navigation }) => {
  console.error(error) // eslint-disable-line
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
    alignItems:      'center',
    width:           '100%',
  },
})

export default BeeScreen
