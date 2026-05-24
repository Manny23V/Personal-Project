// useful to wait a few ms to respect rate limits
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default sleep;
