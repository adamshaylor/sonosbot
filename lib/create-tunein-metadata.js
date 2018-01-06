// https://github.com/jishi/node-sonos-http-api/blob/b021217c67a4cbaca202c3b24bcd3c8c03a6dbce/lib/actions/tunein.js#L4-L7

const createSpotifyMetadata = (encodedUri, serviceType) => {
  return `<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">
  <item id="F00092020s${ encodedUri }" parentID="L" restricted="true">
    <dc:title>tunein</dc:title>
    <upnp:class>object.item.audioItem.audioBroadcast</upnp:class>
    <desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON${ serviceType }_</desc>
  </item>
</DIDL-Lite>`;
};

module.exports = createSpotifyMetadata;
