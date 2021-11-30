/**
 * Publish a CustomEvent with a channel name and payload
 * @param {import('../../../params').Channels} channel - The channel name
 * @param {any} payload - The payload to publish
 */
export function publish(channel, payload) {
  const event = new CustomEvent(channel, {
    detail: payload,
  });
  document.dispatchEvent(event);
}

/**
 * Subscribe to a CustomEvent from a channel and make use of it
 * @param {import('../../../params').Channels} channel - The channel name
 * @param {(event: CustomEvent<any>) => void} callback - The callback to use when the event is fired
 */
export function subscribe(channel, callback) {
  document.addEventListener(channel, /** @type {EventListener} */ (callback));
}
