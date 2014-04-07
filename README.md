# Neighborland Embed

This project includes the javascript and CSS to embed Neighborland in your website.

`nl_embed.css` is the compiled CSS file from the [SASS](http://sass-lang.com/) file `nl_embed.scss`.

If you would like to customize the javascript or CSS for your own site, go for it.

To simply embed Neighborland on your site, see the instructions here:

[Documentation and Embed Builder](https://neighborland.com/embed)

[Full Neighborland API documentation](https://neighborland.com/docs)

### Development Notes

#### Setup

```sh
gem install compass sass
```

#### Compile

Do not edit `nl_embed.css` directly. If you change `sass/nl_embed.scss`, re-generate the .css file using compass:

```
compass compile
```
