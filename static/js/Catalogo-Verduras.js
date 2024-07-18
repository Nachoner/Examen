const apiUrl = 'https://my.api.mockaroo.com/users.json?key=19004920';
        let carrito = [];

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
              displayVerduras(data);
             })
             .catch(error => console.error('Error fetching data:', error));

        function displayVerduras(verduras) {
            const container = document.getElementById('verduras-container');
            const filteredVerduras = verduras.filter(verdura => verdura.tipo.toLowerCase() === 'verdura');
            filteredVerduras.forEach((verdura, index) => {
                if (index % 3 === 0) {
                    const row = document.createElement('div');
                    row.className = 'row';
                    container.appendChild(row);
                }
                const card = createVerduraCard(verdura);
                container.lastChild.appendChild(card);
            });
        }

        function createVerduraCard(verdura) {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card" data-toggle="modal" data-target="#verduraModal" data-verdura='${JSON.stringify(verdura)}'>
                    <img src="${verdura.imagen}" class="card-img-top" alt="${verdura.nombre}">
                    <div class="card-body">
                       <h5 class="card-title">${verdura.nombre}</h5>
                       <p class="card-text">${verdura.descripcion.substring(0, 100)}...</p>
                       <p class="card-text"><strong>Precio:</strong> $${verdura.precio}</p>
                    </div>
                </div>
             `;
            return col;
        }       

        $('#verduraModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            const verdura = button.data('verdura');
            const modal = $(this);
            modal.find('.modal-title').text(verdura.nombre);
            modal.find('#modalImage').attr('src', verdura.imagen);
            modal.find('#modalDescription').text(verdura.descripcion);
            modal.find('#modalTipo').text(verdura.tipo);
            modal.find('#modalPrecio').text(verdura.precio);
            modal.find('#modalAgregarCarrito').data('verdura', verdura);
        });

        $('#modalAgregarCarrito').on('click', function () {
            const verdura = $(this).data('verdura');
            agregarAlCarrito(verdura);
            mostrarMensaje();
        });

        function agregarAlCarrito(verdura) {
            const itemExistente = carrito.find(item => item.id === verdura.id);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                 carrito.push({ ...verdura, cantidad: 1 });
            }
            actualizarCarrito();
            $('#verduraModal').modal('hide');
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
            },  3000);
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