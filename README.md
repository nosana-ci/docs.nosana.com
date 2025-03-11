# docs.nosana.com

Technical documentation for the Nosana Network


## Documentation

https://docs.nosana.com

## Development

### Asciinema

For the interactive terminal demonstrations, [Asciinema](https://docs.asciinema.org/manual/cli/quick-start/) is used.
Please take a look at the link to install it to your system, so that you can record your terminal sessions.
The resulting `.cast` files are to be placed in the [public/cast/](./docs/.vuepress/public/cast/) folder.

To reference the cast file and render it in a Markdown file, you will need to use `<Asciinema>` component.
Note the usage of the parameters such as `src`, `speed`, `idle-time-limit`, `startAt`.
For a full reference take a look at [AsciinemaCast.vue](./docs/.vuepress/components/AsciinemaCast.vue) and at [Asciinema_Docs/Options](https://docs.asciinema.org/manual/player/options/#startat).

```html
<AsciinemaCast 
  src="/cast/nos_address.cast" 
  speed=2
  idle-time-limit=1
  startAt=2
/>
```

Take a look at the [Asciinema Integration](https://docs.asciinema.org/integrations/) for tools to help with recording automation.

## License

MIT