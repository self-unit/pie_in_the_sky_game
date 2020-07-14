const pubSub = {
  publish(channel, payload) {
    const event = new CustomEvent(channel, {
      detail: payload,
    });
    document.dispatchEvent(event);
  },
  subscribe(channel, callback) {
    document.addEventListener(channel, callback);
  },
};

export default pubSub;
