export function publish(channel, payload) {
  const event = new CustomEvent(channel, {
    detail: payload,
  });
  document.dispatchEvent(event);
}

export function subscribe(channel, callback) {
  document.addEventListener(channel, callback);
}
