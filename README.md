# Neighborland Embed

This project includes the javascript and CSS to embed Neighborland in your website.

`nl_embed.css` is the compiled CSS file from the [SASS](http://sass-lang.com/) file `nl_embed.scss`.

If you would like to customize the javascript or CSS for your own site, go for it.

To simply embed Neighborland on your site, see the instructions here:

[Documentation and Embed Builder](https://neighborland.com/embed)

[Full Neighborland API documentation](https://neighborland.com/docs)

### Install

#### NPM

```sh
npm install neighborland-embed
```

#### Yarn

```sh
yarn add neighborland-embed
```

### Development

#### Setup

```sh
gem install sass
npm install -g minify
```

#### Compile

Do not edit `nl_embed.css` or `nl_embed.js` directly.

Regenerate the output files using `bin/build`.
