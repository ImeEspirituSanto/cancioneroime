document.getElementById('searchBar').addEventListener('input', function() {
    let query = this.value.toLowerCase();
    let songs = document.querySelectorAll('.song');
    
    
    
    songs.forEach(song => {
        let title = song.querySelector('h3').textContent.toLowerCase();
        let lyrics = song.querySelector('.lyrics').textContent.toLowerCase();
        
        if (title.includes(query) || lyrics.includes(query)) {
            song.style.display = 'block';
        } else {
            song.style.display = 'none';
        }
    });
});
