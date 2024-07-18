from django.urls import path
from . import views

urlpatterns = [
    path('',views.inicio, name='inicio'),
    path('verduras/',views.verduras, name='verduras'),
    path('frutas/',views.frutas, name='frutas'),
    path('frutosecos/',views.frutosecos, name='frutosecos'),
    path('iniciar_sesion/',views.iniciar_sesion, name='iniciar_sesion'),
    path('salir',views.salir, name='salir'),
    path('nosotros/',views.nosotros, name='nosotros'),
    path("registrar/", views.registrar, name="registrar"),
    path("proximo/", views.proximo, name="proximo"),
    path('usuarios_findEdit/<str:pk>', views.usuarios_findEdit, name='usuarios_findEdit'),
    path("agregar_datos/",views.agregar_datos, name='agregar_datos'),
    path("ver_datos/",views.ver_dat, name="ver_dat"),
    path("actualizar_datos/",views.actualizar_datos, name="actualizar_datos"),
    path("eliminar_datos/<str:pk>",views.borrar_datos, name="borrar_datos"),

    path('compras/',views.compras, name='compras'),
    path('pago_completado/',views.pago_completado, name='pago_completado'),

   
]
