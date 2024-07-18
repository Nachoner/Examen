document.addEventListener('DOMContentLoaded', function () {
    fetch('https://my.api.mockaroo.com/users.json?key=19004920')
        .then(response => response.json())
        .then(data => {
            const marketCardsContainer = document.getElementById('marketCards');
            data.slice(0, 2).forEach(market => { 
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('col-lg-3', 'col-md-3', 'col-sm-12', 'col-xs-12', 'mx-auto');
                cardDiv.innerHTML = `
                    <div class="card" style="width: 18rem;">
                        <img src="${market.imagen}" class="card-img-top" alt="${market.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${market.nombre}</h5>
                            <p class="card-text">${market.precio}</p>
                        </div>
                    </div>
                `;
                marketCardsContainer.appendChild(cardDiv);
            });
        })
        .catch(error => console.error('Error recibiendo los datos:', error));

});