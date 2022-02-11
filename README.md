# timekeeper

> Allow merges only during specified times

## Using this Bot

To use this bot, install it on the repositories you want to keep time on, and configure the hours to allow pull requests with a yaml file in `.github/timekeeper.yml`.

``` yaml
timezone: 'Australia/Perth'
monday:
  from: '09:00'
  to: '17:00'
tuesday:
  from: '09:00'
  to: '17:00'
wednesday:
  from: '09:00'
  to: '17:00'
thursday:
  from: '09:00'
  to: '17:00'
friday:
  from: '09:00'
  to: '20:00'
saturday:
  from: '09:00'
  to: '17:00'
sunday:
  from: '09:00'
  to: '17:00'
```

`

## Development

### Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

### Docker

```sh
# 1. Build container
docker build -t timekeeper .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> timekeeper
```

### Contributing

If you have suggestions for how timekeeper could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2022 Saxon Jensen <saxonj@mailbox.org>
