/**
 * Using Fetch, GET a provided url
 * @param {URL} url
 */
export async function get(url) {
  const response = await fetch(url);
  return response.json();
}
/**
 * Using Fetch, POST to a provided url with a payload
 * @param {URL} url
 * @param {any} payload
 */
export async function post(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

/**
 * Using Fetch, PUT to a provided url with an id and payload
 * @param {URL} url
 * @param {string} id
 * @param {any} payload
 */
export async function put(url, id, payload) {
  const response = await fetch(`${url}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

/**
 * Using Fetch, DELETE to a provided url with an id
 * @param {URL} url
 * @param {string} id
 */
export async function del(url, id) {
  const response = await fetch(`${url}/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}
