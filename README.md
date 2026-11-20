# RIDE CARE by crodyto — Mobile PWA (Fuel + GPS Maps + Firebase)

This is a mobile-first HTML, CSS and JavaScript app. The app has the Firebase project configuration provided for **ride-care-crodyto**.

## What works in this edition

- Google / email account login via Firebase Authentication
- Cloud-only account data: fuel, service, bike details, reminders and saved GPS trips in Firestore at `users/{uid}/app/tracker`
- Multiple-device sync through Firestore listeners and server-side transactions for edits
- Add, edit, delete fuel entries; last fill, price/litre, total cost/litres
- Full-to-full mileage for the last completed interval and weighted mileage across all completed intervals (including intermediate partial fills)
- Three configurable free-service targets, maintenance reminders, due notices, in-app/browser notifications while open
- TVS model selection and Bluetooth LE scan/pair attempts (no universal TVS speed/odometer telemetry)
- **Internal Leaflet/OpenStreetMap map** with your GPS location and accuracy circle
- Tap the map to set a destination (or enter latitude / longitude); OSRM road route, distance, ETA and turns shown **inside this app**
- Live GPS-based ride recording, moving distance, elapsed time, GPS speed, GPS track drawn over map, cloud-saved trip history, view old routes on the map
- Optional addition of a completed GPS ride estimate to the bike's manual odometer
- Installable PWA (icon, standalone mobile experience, install banner)
- JSON backup export/import

## Cloud / login setup — REQUIRED

1. Go to Firebase Console for project `ride-care-crodyto`.
2. Open **Authentication > Sign-in method**: enable **Google**, and optionally **Email/Password**.
3. Under Authentication > Settings > **Authorized domains**, include your exact website domain (for example `ride-care-crodyto.web.app` or your custom domain). If testing locally, add `localhost` if necessary.
4. Create the **Cloud Firestore** database if not already created.
5. Publish the included `firestore.rules` in Firestore > Rules. They restrict the app document to the signed-in account owner. **If this Firebase project has other database uses, merge the rules instead of replacing them blindly.**
6. Host all production files on HTTPS. Opening `index.html` as `file://` will not support Google login / GPS / PWA correctly.

### Deploy with Firebase Hosting CLI

The included `firebase.json` includes Hosting and Firestore Rules configuration. If you have Node.js and the Firebase CLI installed, from the extracted app folder:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --project ride-care-crodyto
```

This uses your Firebase permissions; it does not happen automatically. To deploy Hosting only (without changing rules):

```bash
firebase deploy --only hosting --project ride-care-crodyto
```

## Using in-app Maps

1. Open Maps tab and click **My location**. Allow browser location access.
2. Touch the map to drop a destination marker, or enter valid latitude/longitude and click **Set GPS pin**.
3. Click **Plan road route**. The app draws the road line and displays expected road kilometres, travel duration and a list of turn directions.
4. Tap **Start navigation** for continuously updated remaining kilometres and the next turn from your GPS location. You can stop without leaving the app.
5. For actual distance travelled, separately click **Start ride**. The live orange trail, trip kilometres and speed are shown on the map. **Finish & save** writes the recorded trip to your account. The completed trip is available on other devices.

The map and road routing need Internet. Map tiles come from OpenStreetMap, routing from the public **OSRM demonstration server**, which has no guaranteed uptime or quota for production use. For high-traffic/commercial deployment, switch to a suitable licensed map tile provider and hosted routing backend. Always obey road signs; this is not safety-critical navigation.

**GPS limitations:** Web Geolocation requires HTTPS and permission. Accuracy varies with device, signal and environment; the app ignores many low-accuracy/jumpy points, so totals remain estimates. Keep the screen on and the app foregrounded while recording. Web PWAs cannot guarantee tracking when the phone is locked, backgrounded or the operating system stops the app. Native Android support is needed for reliable background ride recording.

## TVS Bluetooth limitations

TVS bike models may offer different Bluetooth capabilities and manufacturer-specific pairing. Generic Web Bluetooth can *request and connect* to compatible Bluetooth LE devices in some Android Chromium browsers, but it does not provide a universal API to retrieve real bike odometer, service events or fuel levels. The app does **not** claim automatic bike data sync. Fuel and odometer are entered manually; GPS distance can be recorded separately.

## Data storage

Your records are written into Firebase Firestore only after successful transactions; edit requests fail visibly if Cloud is offline. Firebase Authentication may remember login state in the browser. The service worker caches only the app shell (HTML/CSS/JS/icons), **not bike records, GPS trip data, Firebase traffic or map tiles**. Optional JSON downloads are stored wherever *you* choose to save them. Firestore's single-document size limit may eventually matter for extremely large histories; for a scaled-up product, migrate trips to their own collection.

## Smoke testing

Pure calculation tests: `node tests/logic.test.mjs`.

Locally, UI, fuel forms, service updates, in-app route parsing and GPS route saving were additionally smoke-tested with browser mocks. **Live Firebase login/save, real GPS movement, public route response and real TVS devices were not verified against the production account or hardware here.**
