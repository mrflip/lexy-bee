import React, { useState, useCallback
}                          /**/ from 'react'
import { StyleSheet, View }     from 'react-native'
import { Button, Input, Icon }  from 'react-native-elements'
import { useMutation }          from '@apollo/client'
//
import Layout                   from '../lib/Layout'
import Ops                      from '../graphql/Ops'
import Bee                      from '../lib/Bee'

const LetterButton = ({ letter, handler }) => (
  <Button
    title       = {letter.toUpperCase()}
    onPress     = {() => handler(letter)}
    buttonStyle = {styles.letterButton}
    titleStyle  = {styles.letterButtonText}
    containerStyle = {styles.letterButtonCtnr}
  />
)

// Example response
//
// bee_get({"letters":"CAIHLNP"}): {
//   "__typename":"BeeGetResp","success":true,
//   "message":"Bee 'CAIHLNP' gotten",
//   "bee":{"__ref":"Bee:{\"letters\":\"CAIHLNP\"}"
// }}

const GuessInput = ({ bee, onAdd }) => {
  const [entry, setEntry] = useState('')


  const addLetter  = useCallback((letter) => setEntry((ee) => (ee + letter.toLowerCase())),      [setEntry])
  const delLetter  = useCallback(()       => setEntry((ee) => (ee.substring(0, ee.length - 1))), [setEntry])
  const clearEntry = useCallback(()       => setEntry(''), [setEntry])
  const [beePutMu] = useMutation(Ops.bee_put_mu)

  const addGuess = useCallback(() => {
    if (bee.hasWord(entry)) {
      clearEntry()
      onAdd({ guess: { word: entry, len: entry.length } })
      return
    }
    const guess = bee.addGuess(entry)
    // console.log(bee.serializeWithSummary())
    beePutMu({
      variables: {
        ...bee.serializeWithSummary(),
        updatedAt: Bee.getDatestr(),
      },
    })
    // .then((...aa) => console.log('put bee', JSON.stringify(aa), bee.guesses))
    // .catch((err)  => console.log('put err', err)) // eslint-disable-line
    onAdd({ guess })
    clearEntry()
  }, [entry, setEntry])

  return (
    <View style={styles.container}>
      <View style={styles.guessInputRow}>
        <View style={styles.guessInputFieldContainer}>
          <Input
            style            = {styles.entryText}
            inputStyle       = {styles.entryText}
            autoCapitalize   = "none"
            autoCorrect      = {false}
            autoCompleteType = "off"
            value            = {entry}
            onChangeText     = {(text) => setEntry(bee.normEntry(text))}
            onSubmitEditing  = {addGuess}
            blurOnSubmit     = {false}
          />
          <Icon
            name      = "backspace"
            style     = {styles.clearEntryTextButton}
            onPress   = {delLetter}
          />
        </View>
        <Button
          buttonStyle = {styles.addEntryBtn}
          onPress     = {addGuess}
          disabled    = {entry.length === 0}
          icon = {<Icon name="check" iconStyle={styles.entryIcon} />}
        />
      </View>

      <View style={styles.buttonRow}>
        {
          bee.larry.map((ltr) => (
            <LetterButton key={ltr} letter={ltr} handler={addLetter} />))
        }
      </View>
    </View>
  )
}

let btnWidth = ((Layout.window.width - 65) / 7)
if (btnWidth < 32) { btnWidth = 32 }

const styles = StyleSheet.create({
  container: {
    width:             '100%',
    alignItems:        'center',
    // marginBottom:      24,
  },
  //
  guessInputRow: {
    width:             '100%',
    flexDirection:     'row',
    flexWrap:          'nowrap',
    justifyContent:    'flex-start',
    alignItems:        'center',
    alignSelf:         'flex-start',
    paddingHorizontal: 16,
    paddingVertical:   8,
    backgroundColor:   '#FFF',
  },
  guessInputFieldContainer: {
    flex:              1,
    flexDirection:     'row',
    justifyContent:    'flex-end',
    alignItems:        'center',
    paddingHorizontal: 12,
    borderRadius:      8,
    backgroundColor:   '#F8F8F8',
  },
  clearEntryTextButton: {
    padding:           5,
  },
  entryText: {
    flex:              4,
  },
  addEntryBtn: {
    marginLeft:        12,
    marginRight:       2,
    paddingVertical:   13,
    paddingHorizontal: 13,
    backgroundColor:   '#27C16B',
    shadowColor:       '#222',
    shadowOffset:   { width: 0, height: 2 },
    shadowRadius:      4,
    shadowOpacity:     0.12,
  },
  entryIcon: {
    color:             '#FFF',
  },
  letterButton: {
    padding:           3,
    margin:            5,
    backgroundColor:   '#eef',
    borderWidth:       2,
    borderColor:       '#99b',
    borderStyle:       'solid',
  },
  letterButtonCtnr: {
    flex:              1,
  },
  letterButtonText: {
    fontSize:          (btnWidth <= 32 ? 24 : 34),
    fontWeight:        '600',
    textAlign:         'center',
    color:             '#5C3601',
  },
  buttonRow: {
    flexDirection:     'row',
    justifyContent:    'space-around',
    marginHorizontal:   10,
    alignItems:        'center',
  },
})

export default GuessInput
