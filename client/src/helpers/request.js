// TODO this needs to be refactored into bag of functions
export default class Request {
  constructor(url) {
    this.url = url;
  }

  async get() {
    const response = await fetch(this.url);
    return response.json();
  }

  async post(payload) {
    const response = await fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async put(id, payload) {
    const response = await fetch(`${this.url}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async delete(id) {
    const response = await fetch(`${this.url}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}
