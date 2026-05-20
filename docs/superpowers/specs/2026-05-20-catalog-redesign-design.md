# Spec: Rediseño del Catálogo "Casa Chill Glass Grid"

**Fecha:** 2026-05-20
**Estado:** Pendiente de Revisión
**Autor:** Gemini CLI

## 1. Objetivo
Optimizar el espacio visual del catálogo de productos para reducir el scroll excesivo, aumentando la densidad de información de 3 columnas a 4-5 columnas, manteniendo la estética premium de "Casa Chill" e integrando efectos de Glassmorphism.

## 2. Cambios de Diseño

### 2.1 Grid y Layout
- **Columnas:** 
  - Móvil: 2 columnas.
  - Tablet: 3 columnas.
  - Desktop (LG): 4 columnas.
  - Wide (XL): 5 columnas.
- **Espaciado:** Reducción de `gap-10` a `gap-4`.
- **Ancho Máximo:** Mantener `max-w-7xl`.

### 2.2 Product Card (Componente)
- **Estética Glassmorphism:**
  - Fondo de card: `bg-card/80` con `backdrop-blur-md`.
  - Bordes: `border-white/20`.
- **Imagen:**
  - Mantener `aspect-square` para compatibilidad con assets actuales (173x160).
  - Reducir tamaño relativo dentro de la card.
- **Elementos Flotantes (Glass Badges):**
  - Categoría y Rating movidos a overlays sobre la imagen.
  - Estilo: Blanco traslúcido con desenfoque de fondo.
- **Acciones (Hover State):**
  - Botones "Editar" y "Eliminar" se transforman en iconos circulares.
  - Solo visibles al hacer hover sobre la card para mantener limpieza visual.
- **Tipografía:**
  - Título: Reducir a `text-lg`.
  - Descripción: Mantener visible (máximo 2 líneas) con `text-xs`.
  - Precio: Ubicado junto al título o en un badge dedicado.

### 2.3 Interactividad
- Se mantiene el botón "Más detalles" para expandir información nutricional e ingredientes.
- La expansión usará animaciones de Framer Motion existentes pero con fondos traslúcidos.

## 3. Coherencia del Sistema
- Se respetan los colores corporativos (`#482C20`, `#A78D7B`).
- Se mantiene el uso de `lucide-react` para iconografía.
- Se integra con los servicios de API y notificaciones existentes sin cambios en la lógica de negocio.

## 4. Plan de Validación
- Verificar visualización correcta en 4 y 5 columnas.
- Asegurar que el estado hover funcione correctamente en dispositivos táctiles (fallback visual).
- Confirmar que la descripción sea legible con el nuevo tamaño de fuente.
