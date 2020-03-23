#!/usr/bin/env node

'use strict'

const { each } = require('async')
const { resolve, join } = require('path')
const { lstat, rename} = require('fs')
const SPACE_REGEX = /( )+/gi

const ArgumentParser = require('argparse').ArgumentParser
const parser = new ArgumentParser({
  version: require('./package.json').version,
  addHelp: true
})

parser.addArgument(
  'files',
  {
    help: 'Files to replace space (glob expansion allowed)',
    nargs: '+'
  }
)
parser.addArgument(
  ['-r', '--replace'],
  {
    help: 'Replace space with this char (default is to remove whitespace)',
    defaultValue: ''
  }
)

const args = parser.parseArgs()

each(args.files, ( f, callback ) => {

  let resolved = resolve(f)
  lstat(resolved, ( err, stat ) => {
  
    let splitten = resolved.split('/')
    let file = splitten.pop()
    if( stat && SPACE_REGEX.test(file) ){
      rename(resolved, join(splitten.join('/'), file.replace(SPACE_REGEX, args.replace)), callback)
    }else{
      callback( null )
    }
  })
}, ( err ) => {
    if( err ){
      console.log('Error', err)
    }
})
