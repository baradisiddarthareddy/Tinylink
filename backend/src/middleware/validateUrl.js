export function validateUrl(url) {
  try {
    // URL must start with http(s)
    const withProtocol =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : "https://" + url;

    const parsed = new URL(withProtocol);

    // Domain must contain at least one dot: example.com, google.co.in
    if (!parsed.hostname.includes(".")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
