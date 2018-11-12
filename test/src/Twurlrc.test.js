const {ok, deepEqual} = require('assert');
const path = require('path');
const Twurlrc = require('../..');

const fixturesPath = path.join(__dirname, '..', 'fixtures');
const mockTwurlrcFilePath = path.join(fixturesPath, '.twurlrc');

function isExpected(creds)
{
    deepEqual(creds, {
        consumer: {
            key: 'FaKeCoNsUmErKeY',
            secret: 'FaKeCoNsUmErSeCrEt'
        },
        access_token: {
            key: 'FaKeAuThToKeN',
            secret: 'FaKeAuThSeCrEt'
        },
        screen_name: 'fake_screen_name'
    });
}

function isExpectedRaw(creds)
{
    deepEqual(creds, {
        consumer_key: 'FaKeCoNsUmErKeY',
        consumer_secret: 'FaKeCoNsUmErSeCrEt',
        token: 'FaKeAuThToKeN',
        secret: 'FaKeAuThSeCrEt',
        username: 'fake_screen_name'
    });
}

module.exports = ({it, testSync}) => {

    it('Twurlrc should handle missing file', (callback) => {

        Twurlrc.fromFile(mockTwurlrcFilePath + '-missing')
            .then(() => callback(new Error('promise was not rejected')))
            .catch(() => callback());
    });

    it('Twurlrc should handle invalid file', (callback) => {

        Twurlrc.fromFile(mockTwurlrcFilePath + '-invalid')
            .then(() => callback(new Error('promise was not rejected')))
            .catch(() => callback());
    });

    it('Twurlrc should load ~/.twurlrc by default', (callback) => {

        Twurlrc.fromFile()
            .then((twurlrc) => {
                try {
                    ok(twurlrc.data.profiles);
                    ok(twurlrc.data.configuration);
                    callback();
                }
                catch (e) {
                    callback(e);
                }
            })
            .catch(callback);
    });

    it('Twurlrc should find default credentials', (callback) => {

        Twurlrc.fromFile(mockTwurlrcFilePath)
            .then((twurlrc) => {
                try {
                    const creds = twurlrc.defaultCredentials();
                    const credsRaw = twurlrc.defaultCredentials(true);
                    isExpected(creds);
                    isExpectedRaw(credsRaw);
                    callback();
                }
                catch (e) {
                    callback(e);
                }
            })
            .catch(callback);
    });

    testSync('Twurlrc should load ~/.twurlrc by default (Sync)', () => {

        const twurlrc = Twurlrc.fromFileSync();
        ok(twurlrc.data.profiles);
        ok(twurlrc.data.configuration);
    });

    testSync('Twurlrc should find default credentials (Sync)', () => {

        const twurlrc = Twurlrc.fromFileSync(mockTwurlrcFilePath);
        const creds = twurlrc.defaultCredentials();
        const credsRaw = twurlrc.defaultCredentials(true);
        isExpected(creds);
        isExpectedRaw(credsRaw);
    });

    testSync('Twurlrc.credentials should allow omitting the consumer_key parameter', () => {

        const twurlrc = Twurlrc.fromFileSync(mockTwurlrcFilePath);
        const creds = twurlrc.credentials('fake_screen_name');
        const credsRaw = twurlrc.defaultCredentials('fake_screen_name', null, true);
        isExpected(creds);
        isExpectedRaw(credsRaw);
    });
};