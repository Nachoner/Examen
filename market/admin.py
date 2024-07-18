from django.contrib import admin
from .models import Usuario, DetallePedido, Pedido, Producto
# Register your models here.


admin.site.register(Usuario)
admin.site.register(DetallePedido)
admin.site.register(Pedido)
admin.site.register(Producto)


