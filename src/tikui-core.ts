#!/usr/bin/env node

import * as commander from 'commander';
import * as concurrently from 'concurrently';
import * as path from 'path';
import * as rimraf from 'rimraf';

const BUILD_DIR = path.resolve(__dirname, '..', 'dist');

const SASS_CACHE = 'npx sass src:cache -s expanded --watch';
const EXPRESS_SERVE = `node "${path.resolve(BUILD_DIR, 'express.js')}"`;
const SASS_BUILD = 'npx sass src:dist -s compressed --source-map --embed-sources';
const PUG_BUILD = `npx pug-cli src -O "${path.resolve(BUILD_DIR, 'options.js')}" -b ./src -o dist`;
const ASSETS_BUILD = `node "${path.resolve(BUILD_DIR, 'assets-build.js')}"`;

const serve = () => {
  console.log('Serving, please use Ctrl-C to exit.');
  concurrently([
    SASS_CACHE,
    EXPRESS_SERVE,
  ]).then();
};

const ordered = (...commands: string[]) => commands.join(' && ');

const build = () => {
  console.log('Building on dist directory.');
  rimraf.sync('dist');
  concurrently([
    SASS_BUILD,
    ordered(ASSETS_BUILD, PUG_BUILD),
  ]).then();
};

commander
  .command('serve')
  .action(serve);

commander
  .command('build')
  .action(build);

commander
  .name('tikui')
  .parse(process.argv);
