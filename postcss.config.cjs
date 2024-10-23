/**
 * @type {{ plugins: import('postcss').AcceptedPlugin[] }}}
 */
module.exports = {
	plugins: [require("@pandacss/dev/postcss")()],
};
