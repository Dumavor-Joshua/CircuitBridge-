# CircuitBridge

CircuitBridge is a lightweight electronics learning workspace for building circuits and understanding their behavior.

## Current build

- Add resistor, LED, DC voltage source, and switch component instances.
- Each component instance receives unique, stable pin IDs.
- Connect two pins by selecting them in sequence; remove individual wires or components.
- Project data is saved in browser storage and can be imported/exported as JSON.
- Validate component types, component IDs, pin IDs, and wire endpoints.
- Responsive interface designed to remain usable on small screens.

## Known limitations

- The editor currently presents components as cards; free-position drag-and-drop and visual wire routing are not implemented yet.
- The DC solver is a simplified series-circuit estimate and does not inspect actual wire topology.
- Arduino GPIO execution is only a prototype interface; hardware execution is not implemented.

## Run locally

Serve this folder over HTTP because the application uses JavaScript modules:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000.

## Tests

Node.js 18 or newer is recommended. Run the core tests with:

```bash
npm test
```

## Design principles

- Keep the application lightweight and mobile-aware.
- Separate project data, editor, simulation, and Arduino runtime.
- Wires reference stable pin IDs, never canvas coordinates.
- Clearly disclose solver limitations and test against known examples.
