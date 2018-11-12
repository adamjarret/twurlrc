const fs = require('fs');
const os = require('os');
const path = require('path');
const YAML = require('yaml');
const Twurlrc = require('./src/Twurlrc');

const defaultFilePath = path.join(os.homedir(), '.twurlrc');

/**
 * Create a Twurlrc object from a YAML string.
 *
 * @param {string} yaml - YAML string
 * @returns {Twurlrc}
 * @example
 * try {
 *     const twurlrc = require('twurlrc').fromYAMLSync('YAML STRING');
 *     // use twurlrc
 * }
 *  catch(error) {
 *     console.error(error.message);
 * }
 */
Twurlrc.fromYAMLSync = (yaml) => new Twurlrc(YAML.parse(yaml));

/**
 * Create a Twurlrc object from a file path.
 *
 * @param {string} filePath - path to .twurlrc file
 * @returns {Twurlrc}
 * @example
 * try {
 *     const twurlrc = require('twurlrc').fromFileSync('/path/to/.twurlrc');
 *     // use twurlrc
 * }
 *  catch(error) {
 *     console.error(error.message);
 * }
 */
Twurlrc.fromFileSync = (filePath) => Twurlrc.fromYAMLSync(fs.readFileSync(filePath || defaultFilePath, 'utf8'));

/**
 * Asynchronously create a Twurlrc object from a file path.
 *
 * @param {string} filePath - path to .twurlrc file
 * @returns {Promise}
 * @example
 * const Twurlrc = require('twurlrc');
 * Twurlrc.fromFile('/path/to/.twurlrc')
 *      .then((twurlrc) => {
 *          // use twurlrc
 *      })
 *      .catch((error) => console.error(error.message));
 */
Twurlrc.fromFile = (filePath) => new Promise((resolve, reject) => {
    fs.readFile(filePath || defaultFilePath, 'utf8', (error, yaml) => {
        if (error) {
            return reject(error);
        }
        try {
            resolve(Twurlrc.fromYAMLSync(yaml));
        }
        catch (e) {
            reject(e);
        }
    });
});

module.exports = Twurlrc;