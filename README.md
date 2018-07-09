# Zorki 📸

__The command-line utility for visual-regression testing.__
Internally it uses AWS S3 for storing baseline images, so they can be accessed from different machines.
This is an alternative to storing them into a local folder and commiting to your git
repository. The latter solution is not bad, but it can easily bloat the size of your git-stored project, so Zorki takes a different approach.

## Requirements

You need an account on AWS and need to create a special bucket which the application
will use for storing baseline images.

## Installation

```
yarn add zorki
```

## Configuration

Zorki expects a JSON file with some configuration.
Example:

```
{
  "urls": [
    "http://example.com"
  ],
  "storeDir": "./tmp",
  "screenWidths": [320, 1920],
  "accessKeyId": "AWS_S3_ACCESS_KEY_ID",
  "secretAccessKey": "AWS_S3_SECRET_ACCESS_KEY",
  "bucket": "AWS_S3_BUCKET"
}
```
This will run tests against 'http://example.com' with screen widths of 320 and 1920 pixels.
Directory `./tmp` will be used as an intermediate storage.
'AWS_S3_BUCKET' will be the bucket used in a cloud.

## Usage

To run tests:

```
zorki run --config=/path/to/your/config.json
```

To clean up all stored baseline images from the remote storage:

```
zorki cleanup --config=/path/to/your/config.json
```

To list all baseline images already stored for the project:

```
zorki cleanup --config=/path/to/your/config.json
```

## Gotchas

If your page has some animations they can introduce some flakiness when
running your tests. The simplest approach would be to disable them manually.
Zorki has no clear control over pages which you are testing, so this would
be your goal to make them look consistent between tests.

## TODO

- Write comprehensive README
- Implement SIGINT handler
- Handle pessimistic scenarios, like page not being able to respond after 3 retries