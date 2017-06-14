#!/usr/bin/env node

'use strict'

const { each } = require('async')
const { resolve, join } = require('path')
const { lstat, rename} = require('fs')

const SPACE_REGEX = /( )+/gi
const args = Array.from(process.argv).slice(2)

if( !args.length ){
  process.exit(1)
}

each(args, ( f, callback ) => {

  let resolved = resolve(f)
  lstat(resolved, ( err, stat ) => {
  
    let splitten = resolved.split('/')
    let file = splitten.pop()
    if( stat && SPACE_REGEX.test(file) ){
      rename(resolved, join(splitten.join('/'), file.replace(SPACE_REGEX, '')), callback)
    }else{
      callback( null )
    }
  })
}, ( err ) => {
    if( err ){
      console.log('Error', err)
    }
})
