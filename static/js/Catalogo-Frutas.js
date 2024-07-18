const apiUrl = 'https://my.api.mockaroo.com/users.json?key=19004920';
        let carrito = [];

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayFrutas(data);
            })
            .catch(error => console.error('Error fetching data:', error));

        function displayFrutas(frutas) {
            const container = document.getElementById('frutas-container');
            const filteredFrutas = frutas.filter(fruta => fruta.tipo.toLowerCase() === 'fruta');
            filteredFrutas.forEach((fruta, index) => {
                if (index % 3 === 0) {
                    const row = document.createElement('div');
                    row.className = 'row';
                    container.appendChild(row);
                }
                const card = createFrutaCard(fruta);
                container.lastChild.appendChild(card);
            });
        }

        function createFrutaCard(fruta) {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card" data-toggle="modal" data-target="#frutaModal" data-fruta='${JSON.stringify(fruta)}'>
                    <img src="${fruta.imagen}" class="card-img-top" alt="${fruta.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${fruta.nombre}</h5>
                        <p class="card-text">${fruta.descripcion.substring(0, 100)}...</p>
                        <p class="card-text"><strong>Precio:</strong> $${fruta.precio}</p>
                    </div>
                </div>
            `;
            return col;
        }

        $('#frutaModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            const fruta = button.data('fruta');
            const modal = $(this);
            modal.find('.modal-title').text(fruta.nombre);
            modal.find('#modalImage').attr('src', fruta.imagen);
            modal.find('#modalDescription').text(fruta.descripcion);
            modal.find('#modalTipo').text(fruta.tipo);
            modal.find('#modalPrecio').text(fruta.precio);
            modal.find('#modalAgregarCarrito').data('fruta', fruta);
        });

        $('#modalAgregarCarrito').on('click', function () {
            const fruta = $(this).data('fruta');
            agregarAlCarrito(fruta);
            mostrarMensaje();
        });

        function agregarAlCarrito(fruta) {
            const itemExistente = carrito.find(item => item.id === fruta.id);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carrito.push({ ...fruta, cantidad: 1 });
            }
            actualizarCarrito();
            $('#frutaModal').modal('hide');
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