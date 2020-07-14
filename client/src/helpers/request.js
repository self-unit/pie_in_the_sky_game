export default class Request {
  constructor(url) {
    this.url = url;
  };

  get() {
    const response = await fetch(this.url)
    return response.json();
  }

  post(payload) {
    const response = fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json();
  }

  put(id, payload) {
    const response = fetch(`${this.url}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json();
  }

  delete(id) {
    const response = fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
    return response.json();
  }
};
