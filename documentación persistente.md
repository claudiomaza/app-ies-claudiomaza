# Documentación Persistente
# Registro de cambios - 7 de septiembre de 2025

1. Se corrigió y organizó la información de todas las actividades en db.json, asegurando que cada una tenga ubicación en formato "provincia, departamento, altura" y una imagen válida.
2. Se mejoró el filtrado de actividades por categoría y ubicación en el frontend.
3. Se actualizó la visualización de actividades, restaurando la vista tipo mosaico y mostrando la descripción breve en cada tarjeta.
4. Se ajustó la ventana de reserva para mostrar la descripción detallada y las características principales en formato destacado.
5. Se eliminaron viñetas y se mejoró la armonía visual, mostrando los títulos de las características en negrita.
6. Se corrigió la duplicación de la línea "Descripción:" y se ajustó la disposición vertical de la información.
7. Se actualizaron los formularios de reserva y registro para solicitar todos los datos requeridos.
8. Se actualizó la documentación persistente para reflejar todos los cambios y mantener la consistencia en el registro de la fecha.



## Cambios realizados

**Fecha:** 7 de septiembre de 2025

1. Se corrigió la visualización de actividades en el frontend, restaurando la vista tipo mosaico (grid de tarjetas) y mostrando la descripción breve en cada tarjeta.
2. Al seleccionar una actividad, la ventana de reserva muestra la descripción detallada y las características principales en formato destacado.
3. Se eliminaron viñetas y se mejoró la armonía visual, mostrando los títulos de las características en negrita.
4. Se corrigió la duplicación de la línea "Descripción:" y se ajustó la disposición vertical de la información.
5. Se mantuvo la estructura de filtrado por categoría y ubicación, y la funcionalidad de reserva y registro de usuario.
6. Se actualizó la documentación persistente para reflejar los cambios y mantener la consistencia en el registro de la fecha.

---

## Prueba de funcionamiento

1. Ejecuta el proyecto con:
   ```bash
   docker-compose up --build
   ```
2. Accede al frontend en [http://localhost:8080](http://localhost:8080)
3. Accede a la API del backend en [http://localhost:3001](http://localhost:3001)

Puedes probar el registro de usuarios, la navegación por actividades y la reserva con generación de código de pago.
