// following this extremely simple example https://developers.arcgis.com/javascript/latest/display-a-map/
require([
  "esri/config",
  "esri/identity/IdentityManager",
  "esri/layers/FeatureLayer",
  "esri/Map",
  "esri/portal/Portal",
  "esri/portal/PortalQueryParams",
  "esri/identity/OAuthInfo",
  "esri/views/MapView",
  "esri/widgets/Widget"],
  function (
    esriConfig,
    esriId,
    FeatureLayer,
    Map,
    Portal,
    PortalQueryParams,
    OAuthInfo,
    MapView,
    Widget
  ) {

    esriConfig.apiKey =
      "AAPKfadec5e5ca40451d9e7446d6dd0681afeWYBX8KLFJcTchbxr4DfFgQiomIPUkMn" +
      "g7yzUiNVB8DUR4YclJV6MZayveosalIn";

    const info = new OAuthInfo({
      // Swap this ID out with registered application ID
      appId: "ephPh366b8TspMw6",
      // Uncomment the next line and update if using your own portal
      // portalUrl: "https://<host>:<port>/arcgis"
      // Uncomment the next line to prevent the user's signed in state from being shared with other apps on the same domain with the same authNamespace value.
      // authNamespace: "portal_oauth_inline",
      popup: false
    });

    esriId.registerOAuthInfos([info]);

    // console.log(info.portalUrl);

    esriId
      .checkSignInStatus(info.portalUrl + "/sharing")
      .then(() => { console.log("SIGNED IN"); })
      .catch(() => { console.log("NOT SIGNED IN"); });

    esriId.getCredential(info.portalUrl + "/sharing");

    // console.log(esriId);

    const portal = new Portal();
    portal.authMode = "immediate";
    portal.load().then(() => {
      console.log("PORTAL LOADED");
      // Create query parameters for the portal search

      const queryParams = new PortalQueryParams({
        query: "owner:" + portal.user.username,
        sortField: "numViews",
        sortOrder: "desc",
        num: 20});

      portal.queryItems(queryParams).then(() => {
        console.log("LOADED")
      });
    });

    const map = new Map({
      basemap: "arcgis-topographic"
    });

    const protectedLayer = new FeatureLayer({
      url:
        "https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/" +
        "services/NCCPs_and_HCPs/FeatureServer"
    });

    // console.log(protectedLayer.url);

    map.add(protectedLayer);

    const view = new MapView({
      map: map,
      center: [-119.45, 37.17],
      zoom: 7,
      container: "viewDiv",
      constraints: {
        snapToZoom: false
      }
    });

    //const login = "<div>Login</div>";

    view.ui.add("loginDialog", "top-right");
    view.ui.add("logoutDialog", "top-right");

});
