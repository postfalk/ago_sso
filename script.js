// following this extremely simple example https://developers.arcgis.com/javascript/latest/display-a-map/
require([
  "esri/config",
  "esri/identity/IdentityManager",
  "esri/layers/Layer",
  "esri/Map",
  "esri/portal/Portal",
  "esri/portal/PortalQueryParams",
  "esri/identity/OAuthInfo",
  "esri/views/MapView"],
  function (
    esriConfig,
    esriId,
    Layer,
    Map,
    Portal,
    PortalQueryParams,
    OAuthInfo,
    MapView,
  ) {
    // this is necessary to access generic ESRI resources without a
    // login prompt
    // esriConfig.portalUrl = "https://tnc.maps.argcis.com/arcgis"
    /* esriConfig.apiKey =
      "AAPKfadec5e5ca40451d9e7446d6dd0681afeWYBX8KLFJcTchbxr4DfFgQiomIPUkMn" +
      "g7yzUiNVB8DUR4YclJV6MZayveosalIn"; */
    const info = new OAuthInfo({
      // Swap this ID out with registered application ID
      appId: "ephPh366b8TspMw6",
      // Uncomment the next line and update if using your own portal
      portalUrl: "https://tnc.maps.arcgis.com/",
      // Uncomment the next line to prevent the user's signed in state from being shared with other apps on the same domain with the same authNamespace value.
      // authNamespace: "portal_oauth_inline",
      popup: false
    });
    esriId.registerOAuthInfos([info]);

    esriId
      .checkSignInStatus(info.portalUrl + "/sharing")
      .then(() => { addProtectedLayer(); })
      .catch(() => { console.log("NOT SIGNED IN"); });

    esriId.getCredential(info.portalUrl); // + "/sharing");

    function addProtectedLayer() {

      const portal = new Portal();
      // Setting authMode to immediate signs the user in once loaded
      portal.authMode = "immediate";

      // Once loaded, user is signed in
      portal.load().then(() => {
        // Create query parameters for the portal search

        const queryParams = new PortalQueryParams({
          query: "title: NCCPs_and_HCPs"
        })

        portal.queryItems(queryParams).then((items) => {
          const layer = Layer.fromPortalItem({
            portalItem: items.results[0]
          }).then((layer) => {
            map.add(layer);
          })
        })
      })
    }

    const map = new Map({
      basemap: "arcgis-topographic"
    });

    const view = new MapView({
      map: map,
      center: [-119.45, 37.17],
      zoom: 7,
      container: "viewDiv",
      constraints: { snapToZoom: false }
    });

    view.ui.add("logoutDialog", "top-right");

    document.getElementById("logoutDialog").addEventListener("click", () => {
      esriId.destroyCredentials();
      window.location.reload();
    });
});
