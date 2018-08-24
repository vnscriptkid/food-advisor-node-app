import axios from 'axios';

function ajaxHeart(e) {
    e.preventDefault();
    console.log(this.action);
    axios
        .post(this.action)
        .then((res) => {
            this.querySelector('button').classList.toggle('heart--active');
            document.querySelector('span.heartTotal').textContent = res.data.length;
        })
        .catch((err) => console.error(err))
}

export default ajaxHeart;