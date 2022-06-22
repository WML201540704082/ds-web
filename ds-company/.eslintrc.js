module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "extends": ["plugin:vue/essential"],
    "parserOptions": {
      "parser": "babel-eslint",
      "sourceType": "module"
    },
    "plugins": [
      "vue"
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
