#!/usr/bin/env node -r esm --harmony
// ^^^ Note that we are using modern JS features; npm install esm
import _                /**/ from 'lodash'
import fs                    from 'fs'
import JSSoup                from 'jssoup'
import glob                  from 'glob'
//
import Bee                   from '../src/lib/Bee'

// --- Setup
// ( cd /data/ripd; wget -r -l100000 --no-clobber -nv https://nytbee.com/Bee_`date +"%Y%m%d"`.html && cd ~- && ./scripts/parse_nytbee.js )
const data_dir = '/data/ripd/nytbee.com'

// --- Parse
const AllWords = new Set()
const AllObs   = new Set()
const AllBees  = []

const VOWELS   = new Set('a', 'e', 'i', 'o', 'u')

// For all of the files we downloaded,
glob(`${data_dir}/Bee*.html`, (err, files) => {
  files.forEach((filename) => {
    // console.log('Parsing', filename)

    // Read in the file as text
    const raw_html = fs.readFileSync(filename, 'utf8')
    // Grab a JSSoup parser
    const doc = new JSSoup(raw_html)

    // Make the object we will populate
    const words = {}

    // Find all the divs with class 'answer-list'
    // We only want the first and the thirds, so destructure them out
    const [wds_els, obs_els_a, obs_els_b] = doc
      .findAll('div')
      .filter((div) => (
        (div.attrs.class === 'answer-list')
          || (div.attrs.id === 'answer-list')
      ))

    // Within the div for words,
    words.wds     = wds_els
      .findAll('li')
      .map((el) => (el.text))           // Dump the HTML as text
      .map((str) => (str.replace(/\s/g, '')))           // strip whitespace
      .filter((ss) => (ss.length > 0))  // reject empty strings
    // console.log(words.wds.filter((wd) => (wd.length > 11)))

    // .split(/\s+/)                     // Split on whitespace

    // Within the div for rejected words,
    if (obs_els_b) {
      words.obs = obs_els_b             // go through its elements
        .findAll('li')                  // to find all the <li> tags
        .map((li) => li.text)           // And pull out the raw text from them
    } else if (obs_els_a) {
      words.obs = obs_els_a                 // go through its elements
        .findAll('li')                  // to find all the <li> tags
        .map((li) => li.text)           // And pull out the raw text from them
    } else {
      words.obs     = []
    }

    // Grab the date from the filename
    words.datestr = filename.replace(/.*Bee_/, '').replace(/\.html/, '')

    // The page is now parsed; rest of this is turning it into the object we want

    // add to lexicons
    words.wds.forEach((word) => AllWords.add(word))
    words.obs.forEach((word) => AllObs.add(word))

    // Find main letter
    const ltr_hist = {}
    words.wds.forEach(
      (word) => _.uniq(word.split('')).forEach(
        (ltr) => (ltr_hist[ltr] = 1 + (ltr_hist[ltr]||0)))) // eslint-disable-line

    const sorted_letters = Object
      .entries(ltr_hist)
      .sort(([wda, cta], [_b, ctb]) => {
        if (cta > ctb)          return -1
        if (cta < ctb)          return  1
        if (VOWELS.has(wda))    return 1
        return -1
      })
      .map(([ll, _x]) => ll)
      .join('')

    words.letters = Bee.normalize(sorted_letters)

    console.log('Parsed', filename, words.letters, words.wds.length, words.obs.length)

    AllBees.push(words)
  })

  // Make the whole dictionary into the shapes we want

  const all_wds = Array.from(AllWords.values()).sort()
  const all_obs = Array.from(AllObs.values()).sort()
  // console.log(all_wds)

  const all_ltrs = AllBees.map((bb) => [bb.letters.toUpperCase(), bb.datestr])
  all_ltrs.sort(([_wa, da], [_wb, db]) => (da < db ? 1 : -1))

  // Write to disk

  fs.writeFileSync('./data/dict_nyt.json', JSON.stringify(all_wds), { encoding: 'utf8' })
  fs.writeFileSync('./data/dict_obs.json', JSON.stringify(all_obs), { encoding: 'utf8' })
  fs.writeFileSync('./data/bees.json',     JSON.stringify(all_ltrs), { encoding: 'utf8' })

  // Report on success

  console.log(all_ltrs.length)
  console.log(all_wds.length)

  // import Dicts from './dicts'
  // console.log(Dicts)
})
