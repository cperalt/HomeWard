document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const zipcode = document.getElementById('zip').value;
    const distance = document.getElementById('radius').value;
    console.log(zipcode, distance);
    if (!zipcode) console.error('Invalid zipcode!', error);
    fetch(`http://localhost:8080/resources/counselor?zipcode=${zipcode}&distance=${distance}`, {method: 'GET', redirect: 'follow'})
    .then(res => {
        location.href = res.url;
    })
});