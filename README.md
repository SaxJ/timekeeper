# timekeeper

> Allow merges only during specified times

## Using this Bot

To use this bot, install it on the repositories you want to keep time on, and configure the hours to allow pull requests with a yaml file in `.github/timekeeper.yml`.

``` yaml
shortcircuit: 'hotfix;fix;urgent' #skip timekeeper if these words are contained in the PR title
timezone: 'Australia/Perth'
checkTitle:
  allowed: 'The title of an approved check'
  declined: 'The title of a declined check'
checkSummary:
  allowed: 'The summary of an approved check'
  declined: 'The summary of a declined check'
days:
  monday:
    from: '09:00'
    to: '17:00'
    closed: false
  tuesday:
    from: '09:00'
    to: '17:00'
    closed: false
  wednesday:
    from: '09:00'
    to: '17:00'
    closed: false
  thursday:
    from: '09:00'
    to: '17:00'
    closed: false
  friday:
    from: '09:00'
    to: '20:00'
    closed: false
  saturday:
    closed: true #if day is closed, then PR will always be blocked on this day
  sunday:
    closed: true
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
