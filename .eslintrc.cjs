module.exports = {
    env: {
        jest: true
    },
    extends: [
        // '@it-incubator/eslint-config',
        require('@byte-creators/config').eslint,
        'plugin:storybook/recommended',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended'
    ],
    rules: {'no-console': ['warn', {allow: ['warn', 'error']}], "react/button-has-type": "off"},
}
