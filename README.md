# Emby Dashboard

Emby Dashboard is a web application that provides real-time insights into your Emby server. It displays various statistics including server info, active sessions, media info, and detailed library statistics.

## Features

- **Server Info**: Displays the server version, operating system, server name, and HTTP port.
- **Sessions**: Shows the total number of sessions, active streams, playing streams, and paused streams.
- **Media Info**: Provides counts of movies, series, and episodes in your Emby server.
- **Library Info**: Lists all libraries and shows the item count for each library.

## Getting Started

### Prerequisites

To run this project, you need:
- A running Emby server

### Configuration

Create a `config.json` file in the root directory of the project with the following structure:

```json
{
    "embyServer": "YOUR_EMBY_SERVER_URL",
    "apiKey": "YOUR_EMBY_API_KEY"
}
```

### Running This Project

Just use any hosting apps like XAMPP (For Windows) or NGINX (For Linux)
