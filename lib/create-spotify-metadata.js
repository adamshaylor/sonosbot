// https://github.com/jishi/node-sonos-http-api/blob/e23a6aa55692274114116b308d0db562e69d09a7/lib/actions/spotify.js#L3-L8

const createSpotifyMetadata = (encodedUri, serviceType) => {
  return `<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">
  <item id="00030020${ encodedUri }" restricted="true">
    <upnp:class>object.item.audioItem.musicTrack</upnp:class>
    <desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON${ serviceType }_X_#Svc${ serviceType }-0-Token</desc>
  </item>
</DIDL-Lite>`;
};

module.exports = createSpotifyMetadata;
