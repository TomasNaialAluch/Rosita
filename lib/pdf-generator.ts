export function generateRecipePDF(recipe: string, productName: string) {
  try {
    // Crear contenido del archivo
    const content = `RECETA PARA ${productName.toUpperCase()}
${new Date().toLocaleDateString()}

${recipe}

---
Generado por Rosita Carnicería Premium
Chef Virtual con IA
`

    // Crear blob y descargar
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `receta-${productName.toLowerCase().replace(/\s+/g, "-")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Hubo un problema descargando la receta. Intentá de nuevo.")
  }
}

export function shareRecipeText(recipe: string, productName: string) {
  const shareText = `🍖 RECETA PARA ${productName.toUpperCase()}

${recipe}

---
Generado por Rosita Carnicería Premium 🥩`

  if (navigator.share) {
    // Usar Web Share API si está disponible
    navigator
      .share({
        title: `Receta para ${productName}`,
        text: shareText,
      })
      .catch((error) => {
        console.error("Error sharing:", error)
        fallbackShare(shareText)
      })
  } else {
    fallbackShare(shareText)
  }
}

function fallbackShare(text: string) {
  if (navigator.clipboard) {
    // Copiar al portapapeles
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("¡Receta copiada al portapapeles! Podés pegarla donde quieras.")
      })
      .catch(() => {
        showShareModal(text)
      })
  } else {
    showShareModal(text)
  }
}

function showShareModal(text: string) {
  // Crear modal simple para mostrar el texto
  const modal = document.createElement("div")
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  `

  const content = document.createElement("div")
  content.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
  `

  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.style.cssText = `
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
  `
  textarea.readOnly = true

  const closeButton = document.createElement("button")
  closeButton.textContent = "Cerrar"
  closeButton.style.cssText = `
    background: #C85A6E;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  `
  closeButton.onclick = () => document.body.removeChild(modal)

  content.appendChild(textarea)
  content.appendChild(closeButton)
  modal.appendChild(content)
  document.body.appendChild(modal)

  // Seleccionar todo el texto
  textarea.select()
}
