const adsContainer = document.getElementById('adsContainer');
const adForm = document.getElementById('adForm');
const addAdBtn = document.getElementById('addAdBtn');
const submitAdBtn = document.getElementById('submitAdBtn');
const cancelBtn = document.getElementById('cancelBtn');

addAdBtn.addEventListener('click', () => {
    adForm.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    adForm.classList.add('hidden');
});

submitAdBtn.addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;

    const ad = document.createElement('div');
    ad.classList.add('ad');
    ad.innerHTML = `<h3>${title}</h3><p>${description}</p><p>Price: $${price}</p>`;
    adsContainer.appendChild(ad);

    adForm.classList.add('hidden');
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
});
