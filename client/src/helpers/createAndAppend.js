/**
 * Create an HTMLElement and append it to a Node in the document
 * @template {keyof HTMLElementTagNameMap} T - The type of the HTMLElement to create
 * @param {T} tag - The tag of the HTMLElement to create
 * @param {Node} parent - The parent Node to append the HTMLElement to
 * @param {string | null} text - The text to set the HTMLElement's innerText to
 * @param {string | null} htmlclass - The class to set the HTMLElement's class to
 * @param {string | null} id - The id to set the HTMLElement's id to
 * @returns {HTMLElementTagNameMap[T]} The created HTMLElement
 */
export default function createAndAppend(tag, parent, text, htmlclass, id) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (htmlclass) {
    element.classList.add(htmlclass);
  }
  if (id) {
    element.id = id;
  }
  parent.appendChild(element);

  return element;
}
