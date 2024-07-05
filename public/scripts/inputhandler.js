document.getElementById('submit').addEventListener('submit', (e) => {
    e.preventDefault();
    const zipcode = document.querySelector('#zip').value;
    if (zipcode) return;
    fetch(`http://localhost:8080/resources/counselor?zipcode=${zipcode}`, {method: 'GET', redirect: 'follow'})
    .then(res => {
        location.href = res.url;
    })
});