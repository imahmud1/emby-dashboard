document.addEventListener('DOMContentLoaded', function() {
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            const embyServer = config.embyServer;
            const apiKey = config.apiKey;

            fetchServerInfo(embyServer, apiKey);
            fetchActiveStreams(embyServer, apiKey);
            fetchMediaInfo(embyServer, apiKey);
            fetchLibraryStats(embyServer, apiKey);
        })
        .catch(error => {
            console.error('Error fetching config:', error);
            document.getElementById('message').textContent = `Error fetching config: ${error.message}`;
        });
});

function fetchServerInfo(embyServer, apiKey) {
    fetch(`${embyServer}/emby/System/Info?api_key=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('serverVersion').textContent = data.Version || 'N/A';
            document.getElementById('operatingSystem').textContent = data.OperatingSystem || 'N/A';
            document.getElementById('serverName').textContent = data.ServerName || 'N/A';
            document.getElementById('httpPort').textContent = data.HttpServerPortNumber || 'N/A';
        })
        .catch(error => {
            console.error('Error fetching server info:', error);
            document.getElementById('message').textContent = `Error fetching server info: ${error.message}`;
        });
}

function fetchActiveStreams(embyServer, apiKey) {
    fetch(`${embyServer}/emby/Sessions?api_key=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            let totalSessions = data.length;
            let activeStreams = 0;
            let playingStreams = 0;
            let pausedStreams = 0;

            data.forEach(session => {
                if (session.NowPlayingItem) {
                    activeStreams++;
                    if (session.PlayState) {
                        if (session.PlayState.IsPaused) {
                            pausedStreams++;
                        } else {
                            playingStreams++;
                        }
                    }
                }
            });

            document.getElementById('totalSessions').textContent = totalSessions;
            document.getElementById('activeStreams').textContent = activeStreams;
            document.getElementById('playingStreams').textContent = playingStreams;
            document.getElementById('pausedStreams').textContent = pausedStreams;
        })
        .catch(error => {
            console.error('Error fetching active streams:', error);
            document.getElementById('message').textContent = `Error fetching active streams: ${error.message}`;
        });
}

function fetchMediaInfo(embyServer, apiKey) {
    fetch(`${embyServer}/emby/Items/Counts?api_key=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('movieCount').textContent = data.MovieCount || 'N/A';
            document.getElementById('seriesCount').textContent = data.SeriesCount || 'N/A';
            document.getElementById('episodeCount').textContent = data.EpisodeCount || 'N/A';
        })
        .catch(error => {
            console.error('Error fetching library stats:', error);
            document.getElementById('message').textContent = `Error fetching library stats: ${error.message}`;
        });
}

function fetchLibraryStats(embyServer, apiKey) {
    fetch(`${embyServer}/emby/Library/VirtualFolders?api_key=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            const libraryContainer = document.getElementById('libraryItems');
            libraryContainer.innerHTML = ''; // Clear previous items

            data.forEach(library => {
                const libraryItem = document.createElement('div');
                libraryItem.className = 'library-item';
                libraryItem.innerHTML = `
                    <h3>${library.Name}</h3>
                    <p id="itemsCount-${library.Id}">Loading...</p>
                `;
                libraryContainer.appendChild(libraryItem);

                fetchLibraryItemsCount(embyServer, apiKey, library.Id, library.CollectionType);
            });
        })
        .catch(error => {
            console.error('Error fetching libraries:', error);
            document.getElementById('message').textContent = `Error fetching libraries: ${error.message}`;
        });
}

function fetchLibraryItemsCount(embyServer, apiKey, libraryId, collectionType) {
    let itemType;
    if (collectionType === "movies") {
        itemType = "Movie";
    } else if (collectionType === "tvshows") {
        itemType = "Series";
    } else {
        itemType = ""; // For other types
    }

    fetch(`${embyServer}/emby/Items?Recursive=true&ParentId=${libraryId}&IncludeItemTypes=${itemType}&api_key=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById(`itemsCount-${libraryId}`).textContent = `Items: ${data.TotalRecordCount}`;
        })
        .catch(error => {
            console.error(`Error fetching items count for library ${libraryId}:`, error);
            document.getElementById(`itemsCount-${libraryId}`).textContent = 'Items: N/A';
        });
}
