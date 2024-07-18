const apiUrl = 'https://my.api.mockaroo.com/users.json?key=19004920';
        let carrito = [];

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayFrutosecos(data);
            })
            .catch(error => console.error('Error fetching data:', error));

        function displayFrutosecos(frutosecos) {
            const container = document.getElementById('frutosecos-container');
            const filteredFrutosecos = frutosecos.filter(frutoseco => frutoseco.tipo.toLowerCase() === 'frutoseco');
            filteredFrutosecos.forEach((frutoseco, index) => {
                if (index % 3 === 0) {
                    const row = document.createElement('div');
                    row.className = 'row';
                    container.appendChild(row);
                }
                const card = createFrutosecoCard(frutoseco);
                container.lastChild.appendChild(card);
            });
        }

        function createFrutosecoCard(frutoseco) {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card" data-toggle="modal" data-target="#frutosecoModal" data-frutoseco='${JSON.stringify(frutoseco)}'>
                    <img src="${frutoseco.imagen}" class="card-img-top" alt="${frutoseco.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${frutoseco.nombre}</h5>
                        <p class="card-text">${frutoseco.descripcion.substring(0, 100)}...</p>
                        <p class="card-text"><strong>Precio:</strong> $${frutoseco.precio}</p>
                    </div>
                </div>
            `;
            return col;
        }

        $('#frutosecoModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            const frutoseco = button.data('frutoseco');
            const modal = $(this);
            modal.find('.modal-title').text(frutoseco.nombre);
            modal.find('#modalImage').attr('src', frutoseco.imagen);
            modal.find('#modalDescription').text(frutoseco.descripcion);
            modal.find('#modalTipo').text(frutoseco.tipo);
            modal.find('#modalPrecio').text(frutoseco.precio);
            modal.find('#modalAgregarCarrito').data('frutoseceo', frutoseco);
        });

        $('#modalAgregarCarrito').on('click', function () {
            const frutoseco = $(this).data('frutoseco');
            agregarAlCarrito(frutoseco);
            mostrarMensaje();
        });

        function agregarAlCarrito(frutoseco) {
            const itemExistente = carrito.find(item => item.id === frutoseco.id);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carrito.push({ ...frutoseco, cantidad: 1 });
            }
            actualizarCarrito();
            $('#frutosecoModal').modal('hide');
        }

        function actualizarCarrito() {
            const carritoItems = document.getElementById('carrito-items');
            carritoItems.innerHTML = '';
            let total = 0;

            carrito.forEach(item => {
                const itemTotal = item.precio * item.cantidad;
                total += itemTotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${item.imagen}" class="img-fluid" style="max-width: 50px;" alt="${item.nombre}"></td>
                    <td>${item.nombre}</td>
                    <td>$${item.precio}</td>
                    <td>
                        <input type="number" class="form-control cantidad" value="${item.cantidad}" min="1" data-id="${item.id}">
                    </td>
                    <td>$${itemTotal}</td>
                    <td>
                        <button class="btn btn-danger eliminar-carrito" data-id="${item.id}">Eliminar</button>
                    </td>
                `;
                carritoItems.appendChild(row);
            });

            document.getElementById('carrito-total').textContent = total;
            document.getElementById('cart-count').textContent = carrito.length;
        }

        function mostrarMensaje() {
            $('#alertMessage').fadeIn();
            setTimeout(function() {
                $('#alertMessage').fadeOut();
            }, 3000);
        }

        $(document).on('input', '.cantidad', function () {
            const id = $(this).data('id');
            const cantidad = parseInt($(this).val());
            const itemIndex = carrito.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                carrito[itemIndex].cantidad = cantidad;
                actualizarCarrito();
            }
        });

        $(document).on('click', '.eliminar-carrito', function () {
            const id = $(this).data('id');
            carrito = carrito.filter(item => item.id !== id);
            actualizarCarrito();
        });