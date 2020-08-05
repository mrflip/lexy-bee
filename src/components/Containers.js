import React                       /**/ from 'react'
import _                           /**/ from 'lodash'
import {
  Dimensions, View, StyleSheet, ScrollView,
  PanResponder, Animated, Text,
}                                       from 'react-native'
/* eslint-disable react/jsx-props-no-spreading */

export const Container = ({ children, style, flex = null, ...props }) => (
  <View style={[{ flex }, styles.container, style]} {...props}>
    {children}
  </View>
)
export default Container

export const HContainer = ({ children, style, ...props }) => (
  <Container style={[styles.horizontalContainer, style]} {...props}>
    {children}
  </Container>
)

export const VContainer = ({ children, style, ...props }) => (
  <Container style={[styles.verticalContainer, style]} {...props}>
    {children}
  </Container>
)

export const ScrollContainer = ({ children, style, innerStyle, flex = 1, ...props }) => (
  <ScrollView
    contentContainerStyle={[styles.scrollInner, innerStyle]}
    style={[{ flex }, styles.scrollView, style]}
    {...props}
  >
    {children}
  </ScrollView>
)

export const ListContainer = ({ children, style, ...props }) => (
  <VContainer style={[styles.listContainer, style]} {...props}>
    {children}
  </VContainer>
)

export const Row = ({ children, style, ...props }) => (
  <HContainer style={[styles.row, style]} {...props}>
    {children}
  </HContainer>
)

export const KeyValRow = ({ left, right, ...props }) => (
  <Row {...props}>
    <Text style={[styles.cell, styles.keyCell]}>{left }</Text>
    <Text style={[styles.cell, styles.valCell]}>{right}</Text>
  </Row>
)

export const FloatingCardContainer = ({ children, style, ...props }) => (
  <Container style={[styles.floatingCardContainer, style]} {...props}>
    {children}
  </Container>
)

export const TableDump = ({ obj = {}, titler = _.startCase, title = null }) => (
  <Container style={styles.tableDump}>
    {title && <Text style={styles.title}>{title}</Text>}
    {(
      _.map(obj, (vv, kk) => (
        <KeyValRow
          key        = {kk}
          left       = {titler(kk)}
          right      = {JSON.stringify(vv)}
          rightStyle = {styles.monoText}
        />
      ))
    )}
  </Container>
)

export const JsonDump = ({ obj = {}, flex = 1 }) => (
  <Container flex={flex}>
    <Text style={styles.codeBlock}>
      {JSON.stringify(obj)}
    </Text>
  </Container>
)

const styles = StyleSheet.create({
  container: {
  },
  codeBlock: {
    fontFamily:                 'space-mono',
    fontSize:                   16,
  },
  monoText: {
    fontFamily:         'space-mono',
  },
  title: {
    paddingVertical:    8,
    fontSize:           24,
    fontWeight:         '700',
    lineHeight:         30,
    alignSelf:          'flex-start',
  },
  floatingCardContainer: {
    margin:                     16,
    flex:                       1,
    padding:                    24,
    borderRadius:               24,
    shadowColor:                '#000',
    shadowOffset:               { width: 0, height: 2 },
    shadowOpacity:              0.12,
    shadowRadius:               16,
  },
  horizontalContainer: {
    flexDirection:              'row',
  },
  cell: {
    fontSize:                   16,
    paddingVertical:             0,
    paddingHorizontal:           4,
    marginVertical:              2,
  },
  keyCell: {
    flex:                       1,
    fontWeight:                 'bold',
    backgroundColor:            '#ddd',
  },
  valCell: {
    flex:                       2,
    textAlign:                  'right',
  },
  listContainer: {
    marginBottom:               24,
    paddingHorizontal:          16,
  },
  scrollView: {
  },
  scrollInner: {
    paddingTop:                 1,
  },
  tableDump: {
    paddingHorizontal:          16,
  },
  row: {
    alignItems:                 'stretch',
    justifyContent:             'space-between',
    alignContent:               'stretch',
  },
  verticalContainer: {
    flexDirection:              'column',
  },
})
