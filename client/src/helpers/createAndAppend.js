export default function createAndAppend(tag, htmlclass, id, text, parent) {
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
