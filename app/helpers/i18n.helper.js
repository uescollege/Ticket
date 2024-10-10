/**
 * This file is part of the i18n-express library.
 * principal function: watch changes in i18n files in modules
 * 
 */
const path = require('path');
const fs = require('fs');

/**
 * look for the directories of the modules
 * @returns {Array} dirs
 */
function loadLangDir () {
  let langs = [path.join(__dirname, '..', '..', 'app', 'i18n')];

  const dirs = fs.readdirSync(path.join(__dirname, '..', '..', 'modules',));
  if (dirs) {
    for (let i = 0; i < dirs.length; i++) {
      const files = fs.readdirSync(path.join(__dirname, '..', '..', 'modules', dirs[i], 'i18n'));
      if (files) {
        langs.push(path.join(__dirname, '..', '..', 'modules', dirs[i], 'i18n'));
      } else {
        console.log('No files in module ' + dirs[i]);
      }
    }
  } else {
    console.log('[i18n] No dir in ' + 'modules');
  }

  return langs;

}

/**
 * ~root/app/i18n define langs
 * @returns {Array} langs
 */
function availableLangs () {
  const files = fs.readdirSync(path.join(__dirname, '..', '..', 'app', 'i18n'));
  return files.map(file => file.split('.').shift().toLowerCase());
}

/**
 * load json files
 */
function loadLangJSONFiles (dirs, langs) {
  const i18n = {};
  for (let i = 0; i < langs.length; i++) {
    i18n[langs[i]] = {};
    for (let j = 0; j < dirs.length; j++) {
      if (!fs.existsSync(dirs[j] + '/' + langs[i] + '.json')) {
        // create file
        fs.writeFileSync(dirs[j] + '/' + langs[i] + '.json', '{}');
      }
      try {
        delete require.cache[require.resolve(dirs[j] + '/' + langs[i] + '.json')];
      } catch (e) {}
      let layer = null;

      if (process.platform === 'win32') {
        layer = dirs[j].split('\\')[dirs[j].split('\\').length - 2]; // windows
      } else {
        layer = dirs[j].split('/')[dirs[j].split('/').length - 2]; // linux
      }
      // dirs[j] = 'c:\\**\**\\modules\\{name_layer}\\i18n',
      // select name_layer
      // const layer = dirs[j].split('\\')[dirs[j].split('\\').length - 2]; // windows
      // const layer = dirs[j].split('/')[dirs[j].split('/').length - 2]; // linux
      if (typeof layer == 'string') {
        i18n[langs[i]][layer.toUpperCase()] = {};
      
        i18n[langs[i]][layer.toUpperCase()] = {
          ...i18n[langs[i]][layer.toUpperCase()],
          ...require(dirs[j] + '/' + langs[i] + '.json')
        };
      } else {
        console.log('No layer in ' + dirs[j]);
      }

    }
  }

  for (let i = 0; i < langs.length; i++) {
    if (!fs.existsSync(path.join(__dirname, '..', '..', 'i18n', langs[i] + '.json'))) {
      // create file
      fs.writeFileSync(path.join(__dirname, '..', '..', 'i18n', langs[i] + '.json'), '{}');
    }

    try {
      delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'i18n', langs[i] + '.json'))];
    }
    catch (e) {}

    // read file
    const file = require(path.join(__dirname, '..', '..', 'i18n', langs[i] + '.json'));

    // compare file data with new data
    if (JSON.stringify(file) !== JSON.stringify(i18n[langs[i]])) {
      // save file new data
      fs.writeFileSync(path.join(__dirname, '..', '..', 'i18n', langs[i] + '.json'), JSON.stringify(i18n[langs[i]]));
    }

  }

}

function watchLangJSONFiles () {
  const dirs = loadLangDir();
  const langs = availableLangs();

  loadLangJSONFiles(dirs, langs);

  for (let i = 0; i < dirs.length; i++) {
    fs.watch(dirs[i], (curr, prev) => {
      console.log(`${dirs[i]}`);
      loadLangJSONFiles(dirs, langs);
    });
  }
  
}

module.exports =  watchLangJSONFiles;