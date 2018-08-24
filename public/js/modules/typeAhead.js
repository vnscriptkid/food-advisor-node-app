import axios from 'axios';

function dataToHtml(arr) {
    return arr.map(e => `<a href="/store/${e.slug}">${e.name}</a>`).join('');
}

function typeAhead(searchBox) {
    if (!searchBox) return;

    const searchInput = searchBox.querySelector('input[type="text"]');
    const searchResults = searchBox.querySelector('.search__results');

    searchInput.on('input', function() {
        // console.log(this.value);
        if (!this.value) return searchResults.style.display = 'none';

        searchResults.style.display = 'block';

        axios.get(`/api/search?q=${this.value}`)
            .then(res => {
                searchResults.innerHTML = dataToHtml(res.data);
            })
            .catch(err => console.error(err));
    })
}

export default typeAhead;