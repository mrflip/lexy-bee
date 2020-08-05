import React                    from 'react'
import _                        from 'lodash'
import { StyleSheet, Text, View, Alert,
}                               from 'react-native'
import { Button, Icon }         from 'react-native-elements'

function resetMaybe(doReset) {
  console.log(doReset)
  return Alert.alert(
    "Clear Puzzle?",
    "You'll have to (get to?) start over",
    [
      { text: "CLEAR",  onPress: () => doReset() },
      { text: "Cancel", style: 'cancel' },
    ],
  )
}

const HintBar = ({ reveal, incReveal, showHints, toggleHints, doReset }) => (
  <View style = {[styles.hintsHeader]}>
    {
      showHints
        ? (
          <View style={[styles.hintsHeader]}>
            <Button
              title       = "-"
              onPress     = {() => incReveal(-1)}
              buttonStyle = {styles.mutedButton}
              titleStyle  = {styles.hintsHeaderText}
              type = "outline"
            />
            <Text style   = {styles.hintsHeaderText}>({reveal})</Text>
            <Button
              title       = "+"
              onPress     = {() => incReveal(1)}
              buttonStyle = {styles.mutedButton}
              titleStyle  = {styles.hintsHeaderText}
              type = "outline"
            />
          </View>
        )
        : (
          <Button
            title       = "XX"
            onPress     = {() => resetMaybe(doReset)}
            buttonStyle = {[styles.mutedButton, styles.xxButton]}
            titleStyle  = {styles.hintsHeaderText}
            type = "outline"
          />
        )
    }
    <Icon
      name        = {showHints ? 'visibility' : 'visibility-off'}
      iconStyle   = {[styles.showHintsBtn]}
      onPress     = {() => { toggleHints() }}
    />
  </View>
)

export default HintBar

const styles = StyleSheet.create({
  hintsHeader: {
    flex:               1,
    flexDirection:      'row',
    justifyContent:     'flex-start',
    alignItems:         'center',
    flexWrap:           'nowrap',
  },
  hintsHeaderText: {
    color:              '#222',
    fontSize:           20,
  },
  xxButton: {
    marginRight:        16,
  },
  mutedButton: {
    backgroundColor:    'transparent',
    paddingHorizontal:  10,
  },
  showHintsBtn: {
    fontSize:           30,
    marginHorizontal:  4,
  },
})
