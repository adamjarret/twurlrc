/**
 * Get credentials from parsed data.
 *
 * @param {Object} data - object returned by YAML parser
 * @param {Object} data.configuration
 * @param {Array} data.configuration.default_profile - [0]: screen_name, [1]: consumer_key
 * @param {Object} data.profiles - credentials grouped by screen_name then consumer_key
 */
class Twurlrc
{
    constructor(data)
    {
        /**
         * object returned by YAML parser
         * @member {Object}
         * */
        this.data = data;
    }

    /**
     * Get credentials for the specified profile.
     *
     * Returns grouped key/secret pairs by default. Disable grouping by passing `true` for the `raw` parameter value.
     *
     * If the `consumer_key` parameter is omitted or falsy, the "first" consumer_key defined for provided `screen_name`
     * is used. This fallback is provided for convenience when parsing profiles with a single consumer_key defined.
     * To load credentials from profiles with multiple consumer_keys defined, specifying which consumer_key to load is
     * strongly recommended (as opposed to relying on definition order).
     *
     * @param {string} screen_name - Twitter user screen_name
     * @param {string} consumer_key - Twitter app consumer_key
     * @param {boolean} [raw=false] - return unmodified credentials object instead of grouping key/secret pairs
     * @returns {Object}
     * @example
     * // get credentials with grouped key/secret pairs
     * const {consumer, access_token, screen_name} = twurlrc.credentials('my_screen_name', 'my_consumer_key');
     * // consumer === {key: consumer_key, secret: consumer_secret}
     * // access_token === {key: token, secret: secret}
     * // screen_name === 'my_screen_name'
     * @example
     * // disable grouping
     * const {consumer_key, consumer_secret, token, secret, username} = twurlrc.credentials('my_screen_name', 'my_consumer_key', true);
     */
    credentials(screen_name, consumer_key, raw)
    {
        const profile = this.data.profiles[screen_name];

        consumer_key = consumer_key || Object.keys(profile)[0];

        const credentials = profile[consumer_key];

        return raw ? credentials : {
            consumer: {
                key: credentials.consumer_key,
                secret: credentials.consumer_secret
            },
            access_token: {
                key: credentials.token,
                secret: credentials.secret
            },
            screen_name: credentials.username
        };
    }

    /**
     * Get credentials for the default profile.
     *
     * Returns grouped key/secret pairs by default. Disable grouping by passing `true` for the `raw` parameter value.
     *
     * @param {boolean} [raw=false] - return unmodified credentials object instead of grouping key/secret pairs
     * @returns {Object}
     * @example
     * // get default credentials with grouped key/secret pairs
     * const {consumer, access_token, screen_name} = twurlrc.defaultCredentials();
     * // consumer === {key: consumer_key, secret: consumer_secret}
     * // access_token === {key: token, secret: secret}
     * // screen_name === 'my_screen_name'
     * @example
     * // disable grouping
     * const {consumer_key, consumer_secret, token, secret, username} = twurlrc.defaultCredentials(true);
     */
    defaultCredentials(raw)
    {
        const {default_profile} = this.data.configuration;
        return this.credentials(default_profile[0], default_profile[1], raw);
    }
}

module.exports = Twurlrc;
